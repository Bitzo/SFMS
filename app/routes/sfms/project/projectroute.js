/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:24
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:24
 * @Function: project 项目管理
 */

var express = require('express');
var router = express.Router();
var projectservice = appRequire('service/sfms/project/projectservice');
var userservice = appRequire('service/backend/user/userservice');
var projectuserservice = appRequire('service/sfms/project/projectuserservice');
var config = appRequire('config/config');
var moment = require('moment');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目基本信息新增
router.post('/', function (req, res) {
    var query = req.body.formdata;
    var projectName = query.ProjectName,
        projectDesc = query.ProjectDesc,
        projectManageID = query.ProjectManageID,
        projectEndTime = query.ProjectEndTime,
        projectTimeLine = query.ProjectTimeLine || '待完成',
        projectStatus = query.ProjectStatus || '待完成',
        projectPrice = query.ProjectPrice,
        accountID = req.query.jitkey,
        isActive = query.isActive || 1,
        userData = query.data;
    projectEndTime = moment(projectEndTime).format("YYYY-MM-DD HH:mm:ss");
    if (moment(projectEndTime).isBefore()) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '项目截止时间不能比当前日期早'
        })
    }
    //检查所需要的参数是否齐全
    var temp = ['ProjectName', 'ProjectDesc', 'ProjectPrice', 'ProjectManageID', 'ProjectEndTime'],
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

    projectservice.queryProject({projectName: projectName}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results!==undefined&&results.length==0) {
            userservice.querySingleID(projectManageID, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    var projectManageName = results[0].UserName;
                    userservice.querySingleID(projectManageID, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        if (results !== undefined && results.length > 0) {
                            var operateUserName = results[0].UserName;
                            var data = {
                                'ProjectName': projectName,
                                'ProjectDesc': projectDesc,
                                'ProjectManageID': projectManageID,
                                'ProjectManageName': projectManageName,
                                'ProjectEndTime': projectEndTime,
                                'ProjectTimeLine': projectTimeLine,
                                'ProjectStatus': projectStatus,
                                'ProjectPrice': projectPrice,
                                'OperateUser': accountID,
                                'EditUser': accountID,
                                'IsActive': isActive,
                                'EditTime': '',
                                'CreateTime': ''
                            }
                            if (data.ProjectName.length > 45) {
                                res.status(400);
                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '项目名称过长'
                                });
                            }
                            if (data.ProjectDesc.length > 45) {
                                res.status(400);
                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '项目描述过长'
                                });
                            }
                            if (isNaN(data.ProjectPrice)) {
                                res.status(400);
                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '项目预算不是正确的数值'
                                });
                            }
                            if (data.ProjectTimeLine.length > 45) {
                                res.status(400);
                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '项目进度描述过长'
                                });
                            }
                            //如果有项目人员信息，则添加
                            if (userData !== undefined && userData.length > 0) {
                                //转换数据格式
                                userData.push({
                                    projectName: projectName,
                                    userID: projectManageID,
                                    editName: operateUserName,
                                    operateUser: operateUserName,
                                    duty: '项目负责人',
                                    isActive: 1
                                });
                                //获取所有项目用户的username
                                var ID = [];
                                for (var i in userData) {
                                    if (userData[i].duty.length > 45) {
                                        res.status(400);
                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '人员职责描述过长'
                                        })
                                    }
                                    userData[i].projectName = projectName;
                                    userData[i].editName = operateUserName;
                                    userData[i].operateUser = operateUserName;
                                    userData[i].isActive = 1;
                                    if (i == 0) ID[i] = userData[i].userID;
                                    else {
                                        var j = 0;
                                        for (j = 0; j < ID.length; ++j) {
                                            if (userData[i] == ID[j]) break;
                                        }
                                        if (j == ID.length) {
                                            ID[j] = userData[i].userID;
                                        }
                                    }
                                }
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
                                if (results !== undefined && results.length > 0) {
                                    for (var i = 0; i < userData.length; ++i) {
                                        var k = false;
                                        for (var j = 0; j < results.length; ++j) {
                                            if (userData[i].userID == results[j].AccountID) {
                                                k = true;
                                                userData[i].userName = results[j].UserName;
                                            }
                                        }
                                        if (k == false) {
                                            res.status(400);
                                            return res.json({
                                                status: 400,
                                                isSuccess: false,
                                                msg: '操作失败，添加的用户 ' + userData[i].userID + ' 信息有误！'
                                            })
                                        }
                                    }
                                    projectservice.addProject(data, function (err, results) {
                                        if (err) {
                                            res.status(500);
                                            return res.json({
                                                status: 500,
                                                isSuccess: false,
                                                msg: '操作失败，服务器出错'
                                            })
                                        }
                                        if (results !== undefined && results.insertId > 0) {
                                            if (userData != undefined && userData.length != 0) {
                                                for (var i in userData) {
                                                    userData[i].projectID = results.insertId;
                                                }
                                                projectuserservice.addProjectUser(userData, function (err, results) {
                                                    if (err) {
                                                        res.status(500);
                                                        return res.json({
                                                            status: 500,
                                                            isSuccess: false,
                                                            msg: '操作失败，服务器出错'
                                                        })
                                                    }
                                                    if (results !== undefined && results.insertId > 0) {
                                                        res.status(200);
                                                        return res.json({
                                                            status: 200,
                                                            isSuccess: true,
                                                            msg: '操作成功'
                                                        })
                                                    } else {
                                                        res.status(400);
                                                        return res.json({
                                                            status: 404,
                                                            isSuccess: false,
                                                            msg: results
                                                        })
                                                    }
                                                })
                                            } else {
                                                res.status(200);
                                                return res.json({
                                                    status: 200,
                                                    isSuccess: true,
                                                    msg: '操作成功'
                                                })
                                            }
                                        } else {
                                            res.status(400);
                                            return res.json({
                                                status: 400,
                                                isSuccess: false,
                                                msg: '操作失败！'
                                            })
                                        }
                                    })
                                } else {
                                    res.status(400);
                                    return res.json({
                                        status: 400,
                                        isSuccess: false,
                                        msg: '操作失败，添加的用户信息有误！'
                                    })
                                }
                            })
                        } else {
                            res.status(400);
                            return res.json({
                                status: 400,
                                isSuccess: false,
                                msg: '操作失败，操作用户信息有误！'
                            })
                        }
                    })
                } else {
                    res.status(400);
                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '操作失败，项目负责人信息有误！'
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败，此项目名称已存在'
            })
        }
    })
})

//项目基本信息修改
router.put('/', function (req, res) {
    var query = req.body.formdata;
    var ID = query.ID,
        projectName = query.ProjectName,
        projectDesc = query.ProjectDesc,
        projectManageID = query.ProjectManageID,
        projectManageName = query.ProjectManageName,
        projectEndTime = query.ProjectEndTime,
        projectTimeLine = query.ProjectTimeLine,
        projectStatus = query.ProjectStatus,
        projectPrice = query.ProjectPrice,
        accountID = req.query.jitkey,
        userData = query.data,
        time = moment().format('YYYY-MM-DD HH:mm:ss');
    //检查所需要的参数是否齐全
    var temp = ['ID', 'ProjectName', 'ProjectDesc', 'ProjectStatus', 'ProjectPrice', 'ProjectManageID', 'ProjectEndTime', 'ProjectTimeLine'],
        err = 'required: ';
    for (var value in temp) {
        if (!(temp[value] in query)) {
            logger.writeInfo("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if (err != 'required: ') {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    }

    projectEndTime = moment(projectEndTime).format("YYYY-MM-DD HH:mm:ss");
    if (moment(projectEndTime).isBefore()) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '项目截止时间不能比当前日期早'
        })
    }

    userservice.querySingleID(projectManageID, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results !== undefined && results.length > 0) {
            projectManageName = results[0].UserName;
            userservice.querySingleID(projectManageID, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined && results.length>0) {
                    var operateUserName = results[0].UserName;
                    var data = {
                        'ID': ID,
                        'ProjectDesc': projectDesc,
                        'ProjectName': projectName,
                        'ProjectManageID': projectManageID,
                        'ProjectManageName': projectManageName,
                        'ProjectEndTime': projectEndTime,
                        'ProjectTimeLine': projectTimeLine,
                        'ProjectStatus': projectStatus,
                        'ProjectPrice': projectPrice,
                        'OperateUser': accountID,
                        'EditUser': accountID,
                        'EditTime': time
                    }
                    if (data.ProjectDesc.length>45) {
                        res.status(400);
                        return res.json({
                            code: 400,
                            isSuccess: false,
                            msg: '项目描述过长'
                        });
                    }
                    if (isNaN(data.ProjectPrice)) {
                        res.status(400);
                        return res.json({
                            code: 400,
                            isSuccess: false,
                            msg: '项目预算不是正确的数值'
                        });
                    }
                    if (data.ProjectTimeLine.length>45) {
                        res.status(400);
                        return res.json({
                            code: 400,
                            isSuccess: false,
                            msg: '项目进度描述过长'
                        });
                    }
                    projectservice.updateProject(data, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        logger.writeInfo(results);
                        if(results !== undefined && results.affectedRows > 0) {
                            //如果有项目人员信息，则修改
                            if (userData!==undefined) {
                                //获取所有项目用户的username
                                var ID = [];
                                for (var i in userData) {
                                    if (userData[i].duty.length>45) {
                                        res.status(400);
                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '人员职责描述过长'
                                        })
                                    }
                                    userData[i].projectID = results.insertId;
                                    userData[i].projectName = projectName;
                                    userData[i].editName = operateUserName;
                                    userData[i].operateUser = operateUserName;
                                    userData[i].isActive = 1;
                                    if (i==0) ID[i] = userData[i].userID;
                                    else {
                                        var j = 0;
                                        for(j=0;j<ID.length;++j) {
                                            if (userData[i] == ID[j]) break;
                                        }
                                        if (j == ID.length) {
                                            ID[j] = userData[i].userID;
                                        }
                                    }
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
                                        for (var i = 0; i < userData.length; ++i) {
                                            var k = false;
                                            for (var j = 0; j < results.length; ++j) {
                                                if (userData[i].userID == results[j].AccountID) {
                                                    k = true;
                                                    userData[i].userName = results[j].UserName;
                                                }
                                            }
                                            if (k == false) {
                                                res.status(400);
                                                return res.json({
                                                    status: 400,
                                                    isSuccess: false,
                                                    msg: '操作失败，添加的用户 ' + userData[i].userID + ' 信息有误！'
                                                })
                                            }
                                        }
                                        projectuserservice.addProjectUser(userData, function (err, results) {
                                            if (err) {
                                                res.status(500);
                                                return res.json({
                                                    status: 500,
                                                    isSuccess: false,
                                                    msg: '操作失败，服务器出错'
                                                })
                                            }
                                            if(results !== undefined && results.insertId > 0) {
                                                res.status(200);
                                                return res.json({
                                                    status: 200,
                                                    isSuccess: true,
                                                    msg: '操作成功'
                                                })
                                            } else {
                                                res.status(404);
                                                return res.json({
                                                    status: 404,
                                                    isSuccess: false,
                                                    msg: results
                                                })
                                            }
                                        })
                                    } else {
                                        res.status(400);
                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '操作失败，添加的用户信息有误！'
                                        })
                                    }
                                })
                            } else {
                                res.status(200);
                                return res.json({
                                    status: 200,
                                    isSuccess: true,
                                    msg: '操作成功'
                                })
                            }
                        } else {
                            res.status(400);
                            return res.json({
                                status: 400,
                                isSuccess: false,
                                msg: '操作失败'
                            })
                        }
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败，项目负责人信息有误'
            })
        }
    })
})

//项目基本信息查询-项目负责人
router.get('/person', function (req, res) {
    var query =  JSON.parse(req.query.f),
        ID = query.ID || '',
        projectManageID = req.query.jitkey,
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        page = req.query.pageindex>0 ?req.query.pageindex:1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ID': ID,
        'ProjectManageID': projectManageID,
        'CreateTime': startTime,
        'ProjectEndTime': endTime,
        'page': page,
        'pageNum': pageNum,
    }

    //查询数据量
    projectservice.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        totalNum = results[0].num;
        if(totalNum > 0) {
            //查询所需的详细数据
            projectservice.queryProject(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    for (var i in results) {
                        if (results[i].ProjectEndTime != null)
                            results[i].ProjectEndTime = moment(results[i].ProjectEndTime).format('YYYY-MM-DD HH:mm:ss');
                        if (results[i].CreateTime != null)
                            results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm:ss');
                        if (results[i].EditTime != null)
                            results[i].EditTime = moment(results[i].EditTime).format('YYYY-MM-DD HH:mm:ss');
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
                        result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                    }
                    if (totalNum == 1) {
                        projectuserservice.queryProjectUser({ProjectID: results[0].ID}, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                })
                            }
                            logger.writeInfo(results);
                            result.data[0].userdata = {};
                            if (results !== undefined && results.length > 0) {
                                result.data[0].userdata = results;
                                res.status(200);
                                return res.json(result);
                            } else {
                                res.status(200);
                                return res.json(result);
                            }
                        })
                    } else {
                        res.status(200);
                        return res.json(result);
                    }
                } else {
                    res.status(200);
                    return res.json({
                        status: 200,
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

//项目基本信息查询-管理员
router.get('/', function (req, res) {
    var query =  JSON.parse(req.query.f),
        ID = query.ID || '',
        projectManageID = query.projectManageID || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        page = req.query.pageindex>0 ?req.query.pageindex:1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ID': ID,
        'ProjectManageID': projectManageID,
        'CreateTime': startTime,
        'ProjectEndTime': endTime,
        'page': page,
        'pageNum': pageNum,
    }
    
    //查询数据量
    projectservice.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        totalNum = results[0].num;
        if(totalNum > 0) {
            //查询所需的详细数据
            projectservice.queryProject(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    for (var i in results) {
                        if (results[i].ProjectEndTime != null)
                            results[i].ProjectEndTime = moment(results[i].ProjectEndTime).format('YYYY-MM-DD HH:mm:ss');
                        if (results[i].CreateTime != null)
                            results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm:ss');
                        if (results[i].EditTime != null)
                            results[i].EditTime = moment(results[i].EditTime).format('YYYY-MM-DD HH:mm:ss');
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
                        result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                    }
                    if (totalNum == 1) {
                        projectuserservice.queryProjectUser({ProjectID: results[0].ID}, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                })
                            }
                            logger.writeInfo(results);
                            result.data[0].userdata = {};
                            if (results !== undefined && results.length > 0) {
                                result.data[0].userdata = results;
                                res.status(200);
                                return res.json(result);
                            } else {
                                res.status(200);
                                return res.json(result);
                            }
                        })
                    } else {
                        res.status(200);
                        return res.json(result);
                    }
                } else {
                    res.status(200);
                    return res.json({
                        status: 200,
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

//项目删除
router.delete('/', function (req, res) {
    var ID = JSON.parse(req.query.d).ID;

    if (ID == '' || ID === undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: 'require: ID'
        })
    }
    var data = {
        'ID': ID,
        'IsActive': 0
    };

    projectuserservice.updateProjectUser([{ProjectID: ID, IsActive:0}], function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败，服务器出错"
            });
        }
        if (results!==undefined) {
            projectservice.updateProject(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "操作失败，服务器出错"
                    });
                }
                if(results !== undefined && results.affectedRows > 0) {
                    res.status(200);
                    res.json({
                        status: 200,
                        isSuccess: true,
                        msg: "操作成功"
                    })
                } else {
                    res.status(400);
                    res.json({
                        status: 400,
                        isSuccess: true,
                        msg: "操作失败"
                    })
                }
            })
        }
    })
})
module.exports = router;