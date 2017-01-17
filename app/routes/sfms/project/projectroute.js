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
var KPIservice = appRequire('service/sfms/KPI/KPIservice');
var financeService = appRequire('service/sfms/finance/financeservice');
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
        temp1 = ['项目名称', '项目描述', '项目预算', '项目负责人', '项目截止时间']
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
                                'OperateUserID': req.query.jitkey,
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
                                    msg: '项目名称过长,请勿超过45个字符'
                                });
                            }
                            if (data.ProjectDesc.length > 45) {
                                res.status(400);
                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '项目描述过长,请勿超过45个字符'
                                });
                            }
                            if (isNaN(data.ProjectPrice)||data.ProjectPrice<0) {
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
                                    msg: '项目进度描述过长,请勿超过45个字符'
                                });
                            }
                            //如果有项目人员信息，则添加
                            if (userData !== undefined && userData.length > 0) {
                                //转换数据格式
                                //获取所有项目用户的username
                                var ID = [];
                                for (var i in userData) {
                                    if (userData[i].duty.length > 45) {
                                        res.status(400);
                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '人员职责描述过长,请勿超过45个字符'
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
        temp1 = ['项目ID', '项目名称', '项目描述','项目状态', '项目预算', '项目负责人', '项目截止时间', '项目进度'],
    err = '缺少值: ';
    for (var value in temp) {
        if (!(temp[value] in query)) {
            logger.writeInfo("缺少值 " + temp[value]);
            err += temp1[value] + ' ';
        }
    }
    if (err != '缺少值: ') {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    }

    projectservice.queryProject({ID: ID, OperateUserID: req.query.jitkey}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results.length>0 && results[0].IsActive === 1) {
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
                    userservice.querySingleID(accountID, function (err, results) {
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
                                'OperateUser': operateUserName,
                                'OperateUserID': req.query.jitkey,
                                'EditUser': operateUserName,
                                'EditTime': time
                            }
                            if (data.ProjectDesc.length>45) {
                                res.status(400);
                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '项目描述过长,请勿超过45个字符'
                                });
                            }
                            if (isNaN(data.ProjectPrice)||data.ProjectPrice<0) {
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
                                    msg: '项目进度描述过长,请勿超过45个字符'
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
                                                    msg: '人员职责描述过长,请勿超过45个字符'
                                                })
                                            }
                                            userData[i].projectID = data.ID;
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
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败, 该项目不存在或已被禁用'
            })
        }
    })
})

//根据用户查询有关的项目
router.get('/user', function (req, res) {
    var query =  JSON.parse(req.query.f),
        userID = query.UserID || req.query.jitkey;
    if (userID===undefined||userID=='') {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '缺少用户ID'
        })
    }

    projectuserservice.queryProjectByUserID({UserID: userID, OperateUserID: req.query.jitkey}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        var projectInfo = [];
        if (results.length>0) {
            projectInfo = results;
        }
        projectservice.queryProject({ProjectManageID:userID, OperateUserID: req.query.jitkey}, function (err, results) {
            if (err) {
                res.status(500);
                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                })
            }
            if (results.length>0) {
                var i=0,j=0;
                for (i=0;i<results.length;++i) {
                    for (j=0;j<projectInfo.length;++j) {
                        if (results[i].ID == projectInfo[j].ProjectID) break;
                    }
                    if (j==projectInfo.length) {
                        projectInfo.push({
                            ProjectID: results[i].ID,
                            ProjectName: results[i].ProjectName
                        });
                    }
                }
                console.log()
                res.status(200);
                return res.json({
                    status: 200,
                    isSuccess: true,
                    data: projectInfo
                })
            } else {
                res.status(200);
                return res.json({
                    status: 200,
                    isSuccess: true,
                    data: projectInfo
                })
            }
        })
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
        'OperateUserID': req.query.jitkey,
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
                            results[i].ProjectEndTime = moment(results[i].ProjectEndTime).format('YYYY-MM-DD');
                        if (results[i].CreateTime != null)
                            results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD');
                        if (results[i].EditTime != null)
                            results[i].EditTime = moment(results[i].EditTime).format('YYYY-MM-DD');
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
                        projectuserservice.queryProjectUser({ProjectID: results[0].ID, OperateUserID: req.query.jitkey}, function (err, results) {
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
    console.log(req.query)
    var query =  JSON.parse(req.query.f),
        ID = query.ID || '',
        projectManageID = query.projectManageID || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        selectType = req.query.isPaging || '',
        page = req.query.pageindex>0 ?req.query.pageindex:1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ID': ID,
        'ProjectManageID': projectManageID,
        'CreateTime': startTime,
        'ProjectEndTime': endTime,
        'SelectType': selectType,
        'OperateUserID': req.query.jitkey,
        'page': page,
        'pageNum': pageNum,
    }
    console.log(data)
    
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
                            results[i].ProjectEndTime = moment(results[i].ProjectEndTime).format('YYYY-MM-DD');
                        if (results[i].CreateTime != null)
                            results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD');
                        if (results[i].EditTime != null)
                            results[i].EditTime = moment(results[i].EditTime).format('YYYY-MM-DD');
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
                        projectuserservice.queryProjectUser({ProjectID: results[0].ID, OperateUserID: req.query.jitkey}, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                })
                            }
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
//删除时逻辑删除项目记录，逻辑删除项目成员，并禁用与该项目有关的绩效与财务
router.delete('/', function (req, res) {
    var ID = JSON.parse(req.query.d).ID;

    if (ID == '' || ID === undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '缺少项目ID'
        })
    }
    var data = {
        'ID': ID,
        'OperateUserID': req.query.jitkey,
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
            KPIservice.delKPI({'ProjectID': ID, 'OperateUserID': req.query.jitkey}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "操作失败，服务器出错"
                    });
                }
                if (results!==undefined) {
                    financeService.delFinance({'ProjectID': ID, 'OperateUserID': req.query.jitkey}, function (err, results) {
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
                }
            })
        }
    })
})
module.exports = router;