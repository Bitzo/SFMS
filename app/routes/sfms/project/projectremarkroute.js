/**
 * @Author: bitzo
 * @Date: 2016/12/18 12:37
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/18 12:37
 * @Function:
 */

var express = require('express');
var router = express.Router();
var projectservice = appRequire('service/sfms/project/projectservice');
var userservice = appRequire('service/backend/user/userservice');
var projectuserservice = appRequire('service/sfms/project/projectuserservice');
var projectRemarkservice = appRequire('service/sfms/project/projectremarkservice');
var config = appRequire('config/config');
var moment = require('moment');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目备注信息新增
router.post('/', function (req, res) {
    var query = req.body.formdata,
        projectID = query.projectID,
        userID = req.query.jitkey,
        remark = query.remark,
        userName = '',
        projectName = '';
    var temp = ['projectID','remark'],
        err = 'required: ';

    for(var value in temp)
    {
        if(!(temp[value] in query))
        {
            logger.writeInfo("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if(err!='required: ')
    {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    };
    userservice.querySingleID(userID, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results!==undefined && results.length>0) {
            userName = results[0].UserName;
            projectuserservice.queryProjectByUserID({UserID: userID}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined&&results.length>0) {
                    console.log(results);
                    var isIn = false;
                    for (var i in results) {
                        if (projectID == results[i].ProjectID) isIn = true;
                    }
                    if (isIn == true) {
                        projectservice.queryProject({ID: projectID}, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                })
                            }
                            if (results!==undefined&& results.length>0) {
                                projectName = results[0].ProjectName;
                                var data = {
                                    'projectID': projectID,
                                    'projectName': projectName,
                                    'userID': userID,
                                    'userName': userName,
                                    'remark': remark
                                }
                                projectRemarkservice.addRemark(data, function (err, results) {
                                    if (err) {
                                        res.status(500);
                                        return res.json({
                                            status: 500,
                                            isSuccess: false,
                                            msg: '操作失败，服务器出错'
                                        })
                                    }
                                    if (results!==undefined&&results.insertId>0) {
                                        res.status(200);
                                        return res.json({
                                            status: 200,
                                            isSuccess: true,
                                            msg: '操作成功'
                                        })
                                    } else {
                                        res.status(400);
                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '操作失败'
                                        })
                                    }
                                })
                            } else {
                                res.status(400);
                                return res.json({
                                    status: 400,
                                    isSuccess: false,
                                    msg: '操作失败，项目信息有误！'
                                })
                            }
                        })
                    } else {
                        res.status(400);
                        return res.json({
                            status: 400,
                            isSuccess: false,
                            msg: '操作失败，该用户不在项目组内'
                        })
                    }
                } else {
                    res.status(400);
                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '操作失败，该用户还不在项目组内'
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败，用户信息有误！'
            })
        }
    })
})


//项目备注信息编辑
router.put('/', function (req, res) {
    var query = req.body.formdata,
        ID = query.ID,
        projectID = query.projectID,
        userID = req.query.jitkey,
        remark = query.remark,
        userName = '',
        projectName = '';
    var temp = ['ID', 'projectID','remark'],
        err = 'required: ';

    for(var value in temp)
    {
        if(!(temp[value] in query))
        {
            logger.writeInfo("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if(err!='required: ')
    {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    };

    userservice.querySingleID(userID, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results!==undefined && results.length>0) {
            userName = results[0].UserName;
            projectuserservice.queryProjectByUserID({UserID: userID}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined&&results.length>0) {
                    var isIn = false;
                    for (var i in results) {
                        if (projectID == results[i].ProjectID) isIn = true;
                    }
                    if (isIn == true) {
                        console.log(projectID)
                        projectservice.queryProject({ID: projectID}, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                })
                            }
                            console.log(results)
                            if (results!==undefined&& results.length>0) {
                                projectName = results[0].ProjectName;
                                var data = {
                                    'ID':ID,
                                    'projectID': projectID,
                                    'projectName': projectName,
                                    'userID': userID,
                                    'userName': userName,
                                    'remark': remark
                                }
                                projectRemarkservice.updateRemark(data, function (err, results) {
                                    if (err) {
                                        res.status(500);
                                        return res.json({
                                            status: 500,
                                            isSuccess: false,
                                            msg: '操作失败，服务器出错'
                                        })
                                    }
                                    if (results!==undefined&&results.affectedRows>0) {
                                        res.status(200);
                                        return res.json({
                                            status: 200,
                                            isSuccess: true,
                                            msg: '操作成功'
                                        })
                                    } else {
                                        res.status(400);
                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '操作失败'
                                        })
                                    }
                                })
                            } else {
                                res.status(400);
                                return res.json({
                                    status: 400,
                                    isSuccess: false,
                                    msg: '操作失败，项目信息有误！'
                                })
                            }
                        })
                    } else {
                        res.status(400);
                        return res.json({
                            status: 400,
                            isSuccess: false,
                            msg: '操作失败，该用户不在项目组内'
                        })
                    }
                } else {
                    res.status(400);
                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '操作失败，该用户还不在项目组内'
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败，用户信息有误！'
            })
        }
    })
})
module.exports = router;