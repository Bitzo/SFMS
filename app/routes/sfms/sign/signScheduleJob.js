// /**
//  * @Author: bitzo
//  * @Date: 2017/3/10 17:00
//  * @Last Modified by: bitzo
//  * @Last Modified time: 2017/3/10 17:00
//  * @Function: 与签到相关的定时任务
//  */

// var signservice = appRequire('service/sfms/sign/signservice'),
//     userservice = appRequire('service/backend/user/userservice'),
//     config = appRequire('config/config'),
//     moment = require('moment'),
//     logger = appRequire("util/loghelper").helper,
//     mailserver  = require('nodemailer'),
//     path = require('path'),
//     schedule = require('node-schedule');

// //定时任务：每天23：50触发，签退当日未主动签退的签到记录
// function autoSignOut(){
//     schedule.scheduleJob('00 50 23 * * *', function(){
//         var time = moment().format('YYYY-MM-DD HH:mm:ss');

//         console.log(time + ' ====> start scheduleJob autoSignOut');
//         time = moment(time).format('YYYY-MM-DD');

//         signservice.querySign({startTime: time, isPage: 1, OperateUserID: 0}, function(err, results){
//             if (err) {
//                 console.log('autoSignOut scheduleJob failed......');
//                 return;
//             }

//             if (results.length<=0){
//                 console.log('autoSignOut scheduleJob finished......');
//                 return;
//             }

//             var userIdArray = [];

//             for (var i in results){
//                 var ID = results[i].UserID,
//                     count = 0;

//                 if (userIdArray.indexOf(ID)<0) {
//                     userIdArray.push(ID);

//                     for (var j in results){
//                         if (results[j].UserID == ID){
//                             if (results[j].SignType == 0) {
//                                 ++count;
//                             }

//                             if (results[j].SignType == 1) {
//                                 --count;
//                             }
//                         }
//                     }

//                     if (count != 0) {

//                         time = moment(time).set({
//                             'hour': 23,
//                             'minute': 0,
//                             'second': 0
//                         }).format('YYYY-MM-DD HH:mm:ss');

//                         var data = {
//                             'UserID': ID,
//                             'IP': '127.0.0.1',
//                             'UserAgent': results[i].UserAgent,
//                             'MAC': 'mac',
//                             'Longitude': results[i].Longitude,
//                             'Latitude': results[i].Latitude,
//                             'SignType': 1,
//                             'CreateTime': time,
//                             'Remark': 'Auto Sign Out'
//                         };

//                         signservice.signLog(data, function(err, result) {
//                             if (err||result.affectedRows!=1) {
//                                 console.log('ID: ' + data.UserID + 'AutoSignOut FAILED！！')
//                             }
//                         });
//                     }
//                 }
//             }
//         });
//     });
// }

// //autoSignOut();

// //每月第一天查阅上月签到信息，给予预警信息
// function autoSignAlert() {

//     //预警线 单位：小时
//     var alertLine = '10';
//     schedule.scheduleJob('00 00 2 1 * *', function(){

//     // schedule.scheduleJob('40 44 20 * * *', function(){

//         console.log('Auto Sign Alert Schedule Job start...');

//         var startTime = moment().format('YYYY-MM-DD'),
//             endTime = moment().format('YYYY-MM-DD');

//         startTime = moment(startTime).set({
//             'month': moment().get('month')-1,
//             'date': 1
//         }).format('YYYY-MM-DD');

//         endTime = moment(endTime).set({
//             'month': moment().get('month'),
//             date:1
//         }).format('YYYY-MM-DD');

//         var data = {
//             'startTime': startTime,
//             'endTime': endTime,
//             'OperateUserID': 0
//         };

//         userservice.countUser({isActive:1}, function (err,results) {
//             if (err) {
//                 console.log('Auto Sign Alert Schedule Job failed...');
//                 return;
//             }

//             if (results!==undefined&&results.length>0) {

//                 userservice.queryAllUsers({IsPage:1,isActive:1}, function (err, results) {
//                     if (err) {
//                         console.log('Auto Sign Alert Schedule Job failed...');
//                         return;
//                     }

//                     if (!(results!==undefined&&results.length>0)) {
//                         return console.log('Auto Sign Alert Schedule Job failed...');
//                     }

//                     var ID = [], userInfo = [];

//                     for (var i in results) {
//                         ID[i] = results[i].AccountID;
//                         userInfo[i] = {
//                             'userID': results[i].AccountID,
//                             'userName': results[i].UserName,
//                             'college': results[i].College,
//                             'class': results[i].Class,
//                             'email': results[i].Email,
//                             'signTime': '0',
//                             'signNum': 0
//                         }
//                     }

//                     data.userID = ID;

//                     signservice.signCount(data, function (err, results) {
//                         if (err) {
//                             console.log('Auto Sign Alert Schedule Job failed..');
//                             return;
//                         }

//                         if (results!==undefined&&results.length>0) {
//                             var signInfo = [],k=0;

//                             signInfo[k] = {
//                                 userID: results[0].UserID,
//                                 userName: '',
//                                 inTime: 0,
//                                 outTime: 0,
//                                 signNum: 0
//                             };

//                             for(var i=0;i<results.length;++i) {
//                                 if(signInfo[k].userID != results[i].UserID) {
//                                     signInfo[++k] = {
//                                         userID: results[i].UserID,
//                                         inTime: 0,
//                                         outTime: 0,
//                                         signNum: 0
//                                     };
//                                 }

//                                 if (signInfo[k].inTime == 0 && results[i].SignType == 1) continue;

//                                 if (results[i].SignType == 0) {
//                                     //计算前先判断这次的签到信息是否有匹配的签出信息，若无，则跳过此数据
//                                     if(i==results.length-1) break;

//                                     if(results[i+1].UserID != undefined && results[i+1].UserID == signInfo[k].userID) {
//                                         signInfo[k].inTime += moment(results[i].CreateTime).unix();
//                                         signInfo[k].signNum ++;
//                                     }

//                                 } else {
//                                     signInfo[k].outTime += moment(results[i].CreateTime).unix();
//                                 }
//                             }

//                             for(var i in signInfo) {
//                                 //取得签到时常总秒数，换算成小时
//                                 var second = signInfo[i].outTime - signInfo[i].inTime;

//                                 signInfo[i].signTime = second ;

//                                 delete signInfo[i].inTime;
//                                 delete signInfo[i].outTime;
//                             }

//                             for (var i in userInfo) {
//                                 for (var j in signInfo) {
//                                     if (userInfo[i].userID == signInfo[j].userID) {
//                                         userInfo[i].signTime = signInfo[j].signTime;
//                                         userInfo[i].signNum = signInfo[j].signNum;
//                                     }
//                                 }
//                             }
//                         }

//                         alertLine = alertLine * 3600;

//                         var mail = '';

//                         for (var i in userInfo){
//                             var isTrue = false;

//                             isTrue = userInfo[i].signTime < alertLine;
//                             console.log(userInfo[i].email);
//                             if ((userInfo[i].signNum == 0 || isTrue)&&userInfo[i].email!=null) {
//                                 if (mail.length==0){
//                                     mail += userInfo[i].email;
//                                 } else {
//                                     mail += ', ' + userInfo[i].email;
//                                 }
//                             }
//                         }

//                         //预警代码 发送邮件提醒 mailserver
//                         var mailTransport = mailserver.createTransport({
//                             host : 'smtp.qq.com',
//                             secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
//                             auth : {
//                                 user : 'bitzo@qq.com',
//                                 pass : 'lrnwxsyauzqobajd'
//                             },
//                         });

//                         var url = 'http://jit.sylcloud.cn:3000',
//                             picUrl = url + '/public/imgs/background.png';
//                         console.log(picUrl);

//                         var html = "  <body> <tbody> <tr> <td align='center' valign='top' style='padding:0px 0px 0px 0px; '> <table align='center' class='container_tbl' width='600' border='0' cellspacing='0' cellpadding='0' style='table-layout:fixed; background-color:#ffffff; ' bgcolor='#FFFFFF'> <tbody> <tr bgcolor='#2B2833'> <td></td> </tr> <tr style=''> <td class='full_rw_td-banner' valign='top' align='center' style='padding:0px 0px 0px 0px; margin:0px; color:#e24630; font-size:28px; font-weight:400; line-height:30px; font-family:Helvetica,Arial,sans-serif; '> <div class='mktEditable' style='' id='mkto_autogen_id_0'> <p> <a href='" + url + "' style='text-decoration: none; color: #e24630;' target='_blank'><img src='" + picUrl + "' style='width: 600px; max-width: 600px; display: block;' border='0' width='600' height='230' constrain='true' imagepreview='false'></a></p></div></td></tr><tr bgcolor='#fbfbfb' style=''><td class='full_rw_td-titletxt' valign='top' align='center' style='padding:40px 20px 0px 20px; margin:0px; color:#292929; font-size:26px; font-weight:600; line-height:30px; font-family:'open sans',helvetica,Arial,sans-serif; text-transform:uppercase; ' bgcolor='#fbfbfb'><div class='mktEditable' style='' id='mkto_autogen_id_1'><p>WARNING<br></p></div></td></tr><tr bgcolor='#FFFFFF' style=''><td class='full_rw_td-infotxt' valign='top' align='center' style='padding:20px 20px 0px 20px; margin:0px; color:#292929; font-size:14px; font-weight:400; line-height:20px; font-family:'open sans',helvetica,Arial,sans-serif; ' bgcolor='#FFFFFF'><div class='mktEditable' style='' id='mkto_autogen_id_6'><p style='text-align: left;'><g class='gr_ gr_14 gr-alert gr_gramm gr_run_anim Grammar multiReplace' id='14' data-gr-id='14'>"

//                             +"您上个月在实验室的学习时间未达到要求，现给予预警一次，请下个月按时打卡签到，并完成当月的学习任务。"+

//                             "</g></p><p style='text-align: left;'>您可以通过点击右方链接：👉 <a href='" + url + "' target='_blank' id=''>查询</a></p> <p style='text-align: left;'>" +

//                             "以进入1320实验室管理系统，查询上月详细的签到记录与统计信息，若您确认已完成上月学习时间的要求或有其它特殊原因，请忽略此条邮件，并联系或咨询实验室管理人员！！" +

//                             "</p></div> </td></tr> </tbody> </table> </td> </tr> </tbody> </body>";

//                         var options = {
//                             from           : 'bitzo@qq.com',
//                             to             : 'bitzo@qq.com', //email
//                             // cc          : ''    //抄送
//                             // bcc         : ''    //密送
//                             subject        : '签到预警',
//                             text           : '签到预警',
//                             html           : html,
//                             attachments    : ''
//                                 // [
//                                 //     {
//                                 //         filename: 'img1.png',            // 改成你的附件名
//                                 //         path: 'public/images/img1.png',  // 改成你的附件路径
//                                 //         cid : '00000001'                 // cid可被邮件使用
//                                 //     },
//                                 //     {
//                                 //         filename: 'img2.png',            // 改成你的附件名
//                                 //         path: 'public/images/img2.png',  // 改成你的附件路径
//                                 //         cid : '00000002'                 // cid可被邮件使用
//                                 //     },
//                                 // ]
//                         };

//                         mailTransport.sendMail(options, function(err, msg){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 console.log(msg);
//                             }
//                         });
//                     })
//                 })
//             }
//         })
//     })
// }

// //autoSignAlert();
