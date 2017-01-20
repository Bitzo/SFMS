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
router.get('/count', function (req, res) {
    var query = JSON.parse(req.query.f);
    var userID = query.accountID || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        page = req.query.pageindex || 1,
        pagesize = req.query.pagesize || config.pageCount;
    page = page > 0? page : 1;

    if (startTime != '') startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    if (endTime != '') endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

    var data = {
        'userID': userID,
        'startTime': startTime,
        'endTime': endTime,
        'OperateUserID': req.query.jitkey
    }
    userservice.countUser({isActive:1}, function (err,results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results!==undefined&&results.length>0) {
            var totalNum = results[0].num;
            userservice.queryAllUsers({page:page,pageNum:pagesize,IsPage:0,isActive:1}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined&&results.length>0) {
                    var ID = [], userInfo = [];
                    for (var i in results) {
                        ID[i] = results[i].AccountID;
                        userInfo[i] = {
                            'userID': results[i].AccountID,
                            'userName': results[i].UserName,
                            'college': results[i].College,
                            'class': results[i].Class,
                            'signTime': '00:00:00',
                            'signNum': 0
                        }
                    }
                    data.userID = ID;
                    signservice.signCount(data, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        if (results!==undefined&&results.length>0) {
                            var signInfo = [],k=0;
                            signInfo[k] = {
                                userID: results[0].UserID,
                                userName: '',
                                inTime: 0,
                                outTime: 0,
                                signNum: 0
                            };
                            for(var i=0;i<results.length;++i) {
                                if(signInfo[k].userID != results[i].UserID) {
                                    signInfo[++k] = {
                                        userID: results[i].UserID,
                                        inTime: 0,
                                        outTime: 0,
                                        signNum: 0
                                    };
                                }
                                if (signInfo[k].inTime == 0 && results[i].SignType == 1) continue;
                                if (results[i].SignType == 0) {
                                    //计算前先判断这次的签到信息是否有匹配的签出信息，若无，则跳过此数据
                                    if(i==results.length-1) break;
                                    if(results[i+1].UserID != undefined && results[i+1].UserID == signInfo[k].userID) {
                                        signInfo[k].inTime += moment(results[i].CreateTime).unix();
                                        signInfo[k].signNum ++;
                                    }
                                } else {
                                    signInfo[k].outTime += moment(results[i].CreateTime).unix();
                                }
                            }
                            for(var i in signInfo) {
                                //取得签到时常总秒数，换算成小时
                                var second = signInfo[i].outTime - signInfo[i].inTime,
                                    h = Math.floor(second/3600),
                                    m = Math.floor((second - h*3600)/60),
                                    s = (second - h*3600 - m*60);
                                signInfo[i].signTime = h+':'+m+':'+s ;
                                delete signInfo[i].inTime;
                                delete signInfo[i].outTime;
                            }
                            for (var i in userInfo) {
                                for (var j in signInfo) {
                                    if (userInfo[i].userID == signInfo[j].userID) {
                                        userInfo[i].signTime = signInfo[j].signTime;
                                        userInfo[i].signNum = signInfo[j].signNum;
                                    }
                                }
                            }
                            var temp = {
                                status: 200,
                                isSuccess: true,
                                dataNum: totalNum,
                                curPage: page,
                                totalPage: Math.ceil(totalNum/pagesize),
                                curPageNum: pagesize,
                                data: userInfo
                            }
                            if(temp.curPage == temp.totalPage) {
                                temp.curPageNum = temp.dataNum - (temp.totalPage-1)*pagesize;
                            }
                            res.status(200);
                            return res.json(temp)
                        } else {
                            var temp = {
                                status: 200,
                                isSuccess: true,
                                dataNum: totalNum,
                                curPage: page,
                                totalPage: Math.ceil(totalNum/pagesize),
                                curPageNum: pagesize,
                                data: userInfo
                            }
                            if(temp.curPage == temp.totalPage) {
                                temp.curPageNum = temp.dataNum - (temp.totalPage-1)*pagesize;
                            }
                            res.status(200);
                            return res.json(temp)
                        }
                    })
                } else {
                    res.status(200);
                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '暂无数据'
                    })
                }
            })

        }
    })
})

//签到记录的统计
router.get('/count/person', function (req, res) {
    var query = JSON.parse(req.query.f);
    var userID = req.query.jitkey || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        page = req.query.pageindex || 1,
        pagesize = req.query.pagesize || config.pageCount;
    page = page > 0? page : 1;

    if (startTime != '') startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    if (endTime != '') endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    if (userID == '') {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '用户出错'
        })
    }
    var data = {
        'userID': userID,
        'startTime': startTime,
        'endTime': endTime,
        'OperateUserID': req.query.jitkey
    }

    userservice.queryAllUsers({page:1,pageNum:pagesize,IsPage:0,AccountID:userID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results!==undefined&&results.length>0) {
            var  userInfo = [];
            userInfo = [{
                'userID': results[0].AccountID,
                'userName': results[0].UserName,
                'college': results[0].College,
                'class': results[0].class,
                'signTime': '00:00:00',
                'signNum': 0
            }];
            data.userID = [userID];
            signservice.signCount(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined&&results.length>0) {
                    var signInfo = [],k=0;
                    signInfo[k] = {
                        userID: results[0].UserID,
                        userName: '',
                        inTime: 0,
                        outTime: 0,
                        signNum: 0
                    };
                    for(var i=0;i<results.length;++i) {
                        if(signInfo[k].userID != results[i].UserID) {
                            signInfo[++k] = {
                                userID: results[i].UserID,
                                inTime: 0,
                                outTime: 0,
                                signNum: 0
                            };
                        }
                        if (signInfo[k].inTime == 0 && results[i].SignType == 1) continue;
                        if (results[i].SignType == 0) {
                            //计算前先判断这次的签到信息是否有匹配的签出信息，若无，则跳过此数据
                            if(i==results.length-1) break;
                            if(results[i+1].UserID != undefined && results[i+1].UserID == signInfo[k].userID) {
                                signInfo[k].inTime += moment(results[i].CreateTime).unix();
                                signInfo[k].signNum ++;
                            }
                        } else {
                            signInfo[k].outTime += moment(results[i].CreateTime).unix();
                        }
                    }
                    for(var i in signInfo) {
                        //取得签到时常总秒数，换算成小时
                        var second = signInfo[i].outTime - signInfo[i].inTime,
                            h = Math.floor(second/3600),
                            m = Math.floor((second - h*3600)/60),
                            s = (second - h*3600 - m*60);
                        signInfo[i].signTime = h+':'+m+':'+s ;
                        delete signInfo[i].inTime;
                        delete signInfo[i].outTime;
                    }
                    for (var i in userInfo) {
                        for (var j in signInfo) {
                            if (userInfo[i].userID == signInfo[j].userID) {
                                userInfo[i].signTime = signInfo[j].signTime;
                                userInfo[i].signNum = signInfo[j].signNum;
                            }
                        }
                    }
                    var temp = {
                        status: 200,
                        isSuccess: true,
                        dataNum: 1,
                        curPage: page,
                        totalPage: Math.ceil(1/pagesize),
                        curPageNum: pagesize,
                        data: userInfo
                    }
                    if(temp.curPage == temp.totalPage) {
                        temp.curPageNum = temp.dataNum - (temp.totalPage-1)*pagesize;
                    }
                    res.status(200);
                    return res.json(temp)
                } else {
                    var temp = {
                        status: 200,
                        isSuccess: true,
                        curPage: page,
                        curNum: pagesize,
                        totalNum: 1,
                        totalPage: Math.ceil(1 / pagesize),
                        dataNum: pagesize,
                        data: data
                    }
                    if(temp.curPage == temp.totalPage) {
                        temp.curPageNum = temp.dataNum - (temp.totalPage-1)*pagesize;
                    }
                    res.status(200);
                    return res.json(temp)
                }
            })
        } else {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: false,
                msg: '暂无数据'
            })
        }
    })
})

//签到信息记录查询
router.get('/:userID', function (req, res) {
    var query = JSON.parse(req.query.f);
    var userID = req.params.userID || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        totalNum = 0,
        page = req.query.pageindex > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize || config.pageCount;

    if (userID == 0) {
        userID = req.query.jitkey;
    }
    if (startTime !== '') startTime = moment(startTime).format('YYYY-MM-DD hh:mm:ss');
    if (endTime !== '') endTime = moment(endTime).format('YYYY-MM-DD hh:mm:ss');
    var data = {
        'UserID': userID,
        'startTime': startTime,
        'endTime': endTime,
        'page': page,
        'pageNum': pageNum,
        'OperateUserID': req.query.jitkey
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
                        dataNum: totalNum,
                        curPage: page,
                        totalPage: Math.ceil(totalNum/pageNum),
                        curPageNum: pageNum,
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