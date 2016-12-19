/**
 * @Author: bitzo
 * @Date: 2016/12/2 12:54
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/2 12:54
 * @Function: 签到信息查询
 */
var express = require('express');
var router = express.Router();
var signservice = appRequire('service/sfms/sign/signservice');
var userservice = appRequire('service/backend/user/userservice');
var config = appRequire('config/config');
var moment = require('moment');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//签到记录的统计
router.get('/count/:type', function (req, res) {
    var type = req.params.type;
    var query = JSON.parse(req.query.f);
    var userID = query.accountID || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        page = req.query.pageindex || 1,
        pagesize = req.query.pagesize || config.pageCount;
    page > 0? page : 1;
    
    if (type == 'person') userID = req.query.jitkey; 
    
    if (startTime != '') startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    if (endTime != '') endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

    var data = {
        'userID': userID,
        'startTime': startTime,
        'endTime': endTime
    }

    signservice.signCount(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results!==undefined && results.length > 0) {
            //查询到数据，开始统计
            //先取出所有用户ID
            var userInfo = [],k=0;
            userInfo[k] = {
                userID: results[0].UserID,
                userName: '',
                inTime: 0,
                outTime: 0,
                signNum: 0
            };
            for(var i=0;i<results.length;++i) {
                if(userInfo[k].userID != results[i].UserID) {
                    userInfo[++k] = {
                        userID: results[i].UserID,
                        userName: '无效用户',
                        inTime: 0,
                        outTime: 0,
                        signNum: 0
                    };
                }
                if (userInfo[k].inTime == 0 && results[i].SignType == 1) continue;
                if (results[i].SignType == 0) {
                    //计算前先判断这次的签到信息是否有匹配的签出信息，若无，则跳过此数据
                    if(i==results.length-1) break;
                    if(results[i+1].UserID != undefined && results[i+1].UserID == userInfo[k].userID) {
                        userInfo[k].inTime += moment(results[i].CreateTime).unix();
                        userInfo[k].signNum ++;
                    }
                } else {
                    userInfo[k].outTime += moment(results[i].CreateTime).unix();
                }
            }
            var ID = [];
            for (var i in userInfo) {
                ID[i] = userInfo[i].userID;
            }
            userservice.queryAccountByID(ID, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined && results.length>0) {
                    for (var i in results) {
                        for(var j in userInfo) {
                            if (userInfo[j].userID == results[i].AccountID) {
                                userInfo[j].userName = results[i].UserName;
                                break;
                            }
                        }
                    }
                    //获取完所有用户数据，对数据遍历，算出用户的签到总时长
                    for(var i in userInfo) {
                        //取得签到时常总秒数，换算成小时
                        var second = userInfo[i].outTime - userInfo[i].inTime,
                            h = Math.floor(second/3600),
                            m = Math.floor((second - h*3600)/60),
                            s = (second - h*3600 - m*60);
                        userInfo[i].signTime = h+':'+m+':'+s ;
                        delete userInfo[i].inTime;
                        delete userInfo[i].outTime;
                    }
                    //根据分页量传数据
                    var totalNum = userInfo.length,
                        curPage = page,
                        totalPage = Math.ceil(totalNum/pagesize),
                        curNum = pagesize;
                    if (curPage == totalPage) curNum = totalNum - (totalPage-1)*pagesize;
                    data = [];
                    for (var i = 0;i<pagesize;++i) {
                        if((page-1)*pagesize+i>=userInfo.length) break;
                        data[i] = userInfo[(page-1)*pagesize+i];
                    }
                    res.status(200);
                    return res.json({
                        curPage: curPage,
                        curNum: curNum,
                        totalNum: totalNum,
                        totalPage: totalPage,
                        dataNum: userInfo.length,
                        data: data
                    })
                } else {
                    res.status(200);
                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '无数据'
                    })
                }
            })
        } else {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: false,
                msg: '无数据'
            })
        }
    })
})

//签到信息记录查询
router.get('/:userID', function (req, res) {
    var query = req.query;
    var userID = req.params.userID || '',
        userAgent = query.userAgent || '',
        createTime = query.createTime || '',
        signType = query.signType || '',
        totalNum = 0,
        page = req.query.pageindex > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize || config.pageCount;

    if (userID == 0) {
        userID = req.query.jitkey;
    }
    var data = {
        'UserID': userID,
        'UserAgent': userAgent,
        'CreateTime': createTime,
        'SignType': signType,
        'page': page,
        'pageNum': pageNum
    }

    signservice.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        logger.writeInfo(results);
        totalNum = results[0].num;
        if(totalNum > 0) {
            //查询所需的详细数据
            signservice.querySign(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    //格式化时间
                    for(var i in results) {
                        results[i].CreateTime = moment(results[i].CreateTime).format("YYYY-MM-DD HH:mm:ss");
                    }
                    var result = {
                        status: 200,
                        isSuccess: true,
                        totalNum: totalNum,
                        curPage: page,
                        totalPage: Math.ceil(totalNum/pageNum),
                        curNum: pageNum,
                        data: results
                    };
                    if(result.curPage == result.totalPage) {
                        result.curNum = result.totalNum - (result.totalPage-1)*pageNum;
                    }
                    //获取用户名
                    var ID = [];
                    for (var i=0;i<results.length;++i) {
                        results[i].UserName = "无效用户";
                        if (i==0) ID[i] = results[i].UserID;
                        else {
                            var j = 0;
                            for (j=0;j<ID.length;++j) {
                                if (ID[j] == results[i].UserID) break;
                            }
                            if (j == ID.length) ID[j] = results[i].UserID;
                        }
                    }
                    userservice.queryAccountByID(ID, function (err, data) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        for (var i in results) {
                            if(results[i].SignType == 0) results[i].SignType = '签入';
                            else results[i].SignType = '签出'; 
                            for (var j in data) {
                                if (results[i].UserID == data[j].AccountID) {
                                    results[i].UserName = data[j].UserName;
                                    break;
                                }
                            }
                        }
                        res.status(200);
                        return res.json(result);
                    })
                } else {
                    res.status(404);
                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '无数据'
                    })
                }
            })
        } else {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: false,
                msg: '无数据'
            })
        }
    })
})


module.exports = router;