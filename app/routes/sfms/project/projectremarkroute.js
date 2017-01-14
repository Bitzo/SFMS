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
        projectID = query.ProjectID,
        userID = req.query.jitkey,
        remark = query.Remark,
        userName = '',
        projectName = '';
    var temp = ['ProjectID','Remark'],
        temp1 = ['项目名称', '备注信息'],
        err = '缺少值: ';

    for(var value in temp)
    {
        if(!(temp[value] in query))
        {
            logger.writeInfo("缺少值 " + temp[value]);
            err += temp1[value] + ' ';
        }
    }
    if(err!='缺少值: ')
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
            projectservice.queryProject({ID:projectID, OperateUserID: req.query.jitkey}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }

                if (results!==undefined&&results.length>0) {
                    var projectManageID = results[0].ProjectManageID;
                    projectuserservice.queryProjectByUserID({UserID: userID}, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        if (results!==undefined) {
                            var isIn = false;
                            if (projectManageID == userID) isIn = true;
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
                                            'OperateUserID': req.query.jitkey,
                                            'userName': userName,
                                            'remark': remark
                                        }
                                        if (data.remark.length > 200) {
                                            res.status(400);
                                            return res.json({
                                                status: 400,
                                                isSuccess: false,
                                                msg: '备注信息过长,请勿超过200个字符'
                                            })
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
                        msg: '操作失败，项目不存在'
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
        projectID = query.ProjectID,
        userID = req.query.jitkey,
        remark = query.Remark,
        userName = '',
        projectName = '',
        temp = ['ID', 'ProjectID','Remark'],
        temp1 = ['项目备注ID', '项目名称', '备注信息'],
        err = '缺少值: ';

    for(var value in temp)
    {
        if(!(temp[value] in query))
        {
            logger.writeInfo("缺少值 " + temp[value]);
            err += temp1[value] + ' ';
        }
    }
    if(err!='缺少值: ')
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
            projectservice.queryProject({ID:projectID, OperateUserID: req.query.jitkey}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined&&results.length>0) {
                    var projectManageID = results[0].ProjectManageID;
                    projectuserservice.queryProjectByUserID({UserID: userID}, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        if (results!==undefined) {
                            var isIn = false;
                            if (projectManageID == userID) isIn = true;
                            for (var i in results) {
                                if (projectID == results[i].ProjectID) isIn = true;
                            }
                            if (isIn == true) {
                                projectservice.queryProject({ID: projectID, OperateUserID: req.query.jitkey}, function (err, results) {
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
                                            'ID':ID,
                                            'projectID': projectID,
                                            'projectName': projectName,
                                            'OperateUserID': req.query.jitkey,
                                            'userID': userID,
                                            'userName': userName,
                                            'remark': remark
                                        }
                                        if (data.remark.length > 200) {
                                            res.status(400);
                                            return res.json({
                                                status: 400,
                                                isSuccess: false,
                                                msg: '备注信息过长,请勿超过200个字符'
                                            })
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
                        msg: '操作失败，项目不存在'
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

//项目备注信息查询 普通用户
router.get('/person', function (req, res) {
    var query = JSON.parse(req.query.f);
    var projectID = query.ProjectID || '',
        userID = req.query.jitkey,
        page = req.query.pageindex || 1,
        pageNum = req.query.pagesize || config.pageCount,
        countNum = 0;
    page > 0? page :1;

    var data = {
        'userID': userID,
        'projectID': projectID,
        'OperateUserID': req.query.jitkey,
        'page': page,
        'pageNum': pageNum
    }
    projectRemarkservice.countRemark(data, function (err, results) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: "查询失败，服务器内部错误"
            });
            return;
        }
        if (results !==undefined && results.length != 0) {
            countNum = results[0]['num'];
            projectRemarkservice.queryRemark(data, function (err, results) {
                if (err) {
                    res.status(500);
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                    return;
                }
                if (results!==undefined && results.length > 0) {
                    var result = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:pageNum,
                        totalPage: Math.ceil(countNum/pageNum),
                        data: results
                    };
                    if(result.curPage == result.totalPage) {
                        result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                    }
                    res.status(200);
                    return res.json(result);
                } else {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: false,
                        msg: "未查询到相关信息"
                    });
                }
            })
        } else {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
        }
    })
})

//项目备注信息查询
router.get('/', function (req, res) {
    var query = JSON.parse(req.query.f);
    var projectID = query.ProjectID || '',
        ID = query.ID || '',
        page = req.query.pageindex || 1,
        pageNum = req.query.pagesize || config.pageCount,
        countNum = 0;
    page > 0? page :1;

    var data = {
        'ID': ID,
        'projectID': projectID,
        'OperateUserID': req.query.jitkey,
        'page': page,
        'pageNum': pageNum
    }
    projectRemarkservice.countRemark(data, function (err, results) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: "查询失败，服务器内部错误1"
            });
            return;
        }
        if (results !==undefined && results.length != 0) {
            countNum = results[0]['num'];
            projectRemarkservice.queryRemark(data, function (err, results) {
                if (err) {
                    res.status(500);
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误2"
                    });
                    return;
                }
                if (results!==undefined && results.length > 0) {
                    var result = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:pageNum,
                        totalPage: Math.ceil(countNum/pageNum),
                        data: results
                    };
                    if(result.curPage == result.totalPage) {
                        result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                    }
                    res.status(200);
                    return res.json(result);
                } else {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: false,
                        msg: "未查询到相关信息"
                    });
                }
            })
        } else {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
        }
    })
})

//删除项目用户备注信息
router.delete('/', function (req, res) {
    var ID = JSON.parse(req.query.d).ID;
    if (ID == '' || ID == undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: "缺少项目备注ID"
        })
    }

    projectRemarkservice.delRemark({ID:ID, OperateUserID: req.query.jitkey}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: "服务器出错"
            });
        }
        if (results!==undefined && results.affectedRows > 0) {
            res.status(200);
            res.json({
                status: 200,
                isSuccess: true,
                msg: "删除成功"
            })
        } else {
            res.status(400);
            res.json({
                status: 400,
                isSuccess: true,
                msg: "删除失败"
            })
        }
    })
})
module.exports = router;