/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:24
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:24
 * @Function: project 项目管理
 */

var express = require('express'),
    router = express.Router(),
    projectservice = appRequire('service/sfms/project/projectservice'),
    userservice = appRequire('service/backend/user/userservice'),
    KPIservice = appRequire('service/sfms/KPI/KPIservice'),
    financeService = appRequire('service/sfms/finance/financeservice'),
    projectuserservice = appRequire('service/sfms/project/projectuserservice'),
    config = appRequire('config/config'),
    moment = require('moment'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    logger = appRequire("util/loghelper").helper;

//项目基本信息新增
router.post('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectAdd.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (results !== undefined && results.isSuccess === true) {
            var query = req.body.formdata,
                projectName = query.ProjectName,
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

            if (!moment(projectEndTime).isValid()){
                res.status(400);
                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '项目截止时间不合法'
                });
            }

            if (moment(projectEndTime).isBefore()) {
                res.status(400);
                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '项目截止时间不能比当前日期早'
                });
            }

            //检查所需要的参数是否齐全
            var temp = ['ProjectName', 'ProjectDesc', 'ProjectPrice', 'ProjectManageID', 'ProjectEndTime'],
                temp1 = ['项目名称', '项目描述', '项目预算', '项目负责人', '项目截止时间'];

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
                });
            };

            projectservice.queryProject({projectName: projectName,OperateUserID: req.query.jitkey}, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (results!==undefined&&results.length==0) {

                    userservice.querySingleID(projectManageID, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
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
                                    });
                                }

                                if (results !== undefined && results.length > 0) {
                                    var operateUserName = results[0].UserName;

                                    data = {
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
                                    };

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
                                                });
                                            }

                                            if (userData[i].duty.trim().length <= 0) {
                                                res.status(400);

                                                return res.json({
                                                    status: 400,
                                                    isSuccess: false,
                                                    msg: '人员职责不得为空'
                                                });
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
                                            });
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
                                                    });
                                                }
                                            }

                                            projectservice.addProject(data, function (err, results) {
                                                if (err) {
                                                    res.status(500);
                                                    return res.json({
                                                        status: 500,
                                                        isSuccess: false,
                                                        msg: '操作失败，服务器出错'
                                                    });
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
                                                                });
                                                            }

                                                            if (results !== undefined && results.insertId > 0) {
                                                                res.status(200);

                                                                return res.json({
                                                                    status: 200,
                                                                    isSuccess: true,
                                                                    msg: '操作成功'
                                                                });
                                                            } else {
                                                                res.status(400);

                                                                return res.json({
                                                                    status: 404,
                                                                    isSuccess: false,
                                                                    msg: results
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        res.status(200);

                                                        return res.json({
                                                            status: 200,
                                                            isSuccess: true,
                                                            msg: '操作成功'
                                                        });
                                                    }
                                                } else {
                                                    res.status(400);

                                                    return res.json({
                                                        status: 400,
                                                        isSuccess: false,
                                                        msg: '操作失败！'
                                                    });
                                                }
                                            });
                                        } else {
                                            res.status(400);

                                            return res.json({
                                                status: 400,
                                                isSuccess: false,
                                                msg: '操作失败，添加的项目成员信息有误！'
                                            });
                                        }
                                    });
                                } else {
                                    res.status(400);

                                    return res.json({
                                        status: 400,
                                        isSuccess: false,
                                        msg: '操作失败，操作用户信息有误！'
                                    });
                                }
                            });
                        } else {
                            res.status(400);

                            return res.json({
                                status: 400,
                                isSuccess: false,
                                msg: '操作失败，项目负责人信息有误！'
                            });
                        }
                    });
                } else {
                    res.status(400);

                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '操作失败，此项目名称已存在'
                    });
                }
            });
        } else {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    });
});

//项目重新启用
router.put('/restart',function (req,res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectEdit.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (results !== undefined && results.isSuccess === true) {
            var ID = req.body.formdata.ID || '';

            if (ID === '' || isNaN(ID)) {
                res.status(400);

                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: '项目ID有误！'
                });
            }

            var data = {
                ID: ID,
                IsActive:1,
                OperateUserID: req.query.jitkey
            };

            projectservice.updateProject(data, function(err, results){
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '查询失败，服务器出错'
                    });
                }

                if (results!==undefined && results.affectedRows>0) {
                    res.status(200);

                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '操作成功'
                    });
                } else {
                    res.status(40);

                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: '操作失败'
                    });
                }
            })
        } else {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    })
});


//项目基本信息修改
router.put('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectEdit.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query = req.body.formdata,
            ID = query.ID,
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
            temp1 = ['项目ID', '项目名称', '项目描述','项目状态', '项目预算', '项目负责人', '项目截止时间', '项目进度'];

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
            });
        }

        projectservice.queryProject({ID: ID, OperateUserID: req.query.jitkey}, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (!(results.length>0 && results[0].IsActive === 1)) {
                res.status(400);

                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '操作失败, 该项目不存在或已被禁用'
                });
            }

            projectservice.queryProject({projectName: projectName, OperateUserID: req.query.jitkey}, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (results.length!=0&&results[0].ID!=ID) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '已有同名的项目存在！'
                    });
                }

                projectEndTime = moment(projectEndTime).format("YYYY-MM-DD HH:mm:ss");

                if (!moment(projectEndTime).isValid()){
                    res.status(400);
                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '项目截止时间不合法'
                    });
                }

                if (moment(projectEndTime).isBefore()) {
                    res.status(400);

                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '项目截止时间不能比当前日期早'
                    });
                }

                userservice.querySingleID(projectManageID, function (err, results) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    if (!(results !== undefined && results.length > 0)) {
                        res.status(400);

                        return res.json({
                            status: 400,
                            isSuccess: false,
                            msg: '操作失败，项目负责人信息有误'
                        });
                    }

                    projectManageName = results[0].UserName;

                    userservice.querySingleID(accountID, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        if (!(results!==undefined && results.length>0)) {
                            res.status(400);

                            return res.json({
                                status: 400,
                                isSuccess: false,
                                msg: '操作失败，操作人信息有误'
                            });
                        }

                        var operateUserName = results[0].UserName;

                        data = {
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
                        };

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
                                });
                            }

                            logger.writeInfo(results);

                            if(!(results !== undefined && results.affectedRows > 0)) {
                                res.status(400);

                                return res.json({
                                    status: 400,
                                    isSuccess: false,
                                    msg: '操作失败'
                                });
                            }

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
                                        });
                                    }

                                    if (userData[i].duty.trim().length<=0) {
                                        res.status(400);

                                        return res.json({
                                            code: 400,
                                            isSuccess: false,
                                            msg: '项目成员职责不得为空'
                                        });
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
                                        });
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
                                                });
                                            }
                                        }

                                        projectuserservice.addProjectUser(userData, function (err, results) {
                                            if (err) {
                                                res.status(500);

                                                return res.json({
                                                    status: 500,
                                                    isSuccess: false,
                                                    msg: '操作失败，服务器出错'
                                                });
                                            }

                                            if(results !== undefined && results.insertId > 0) {
                                                res.status(200);

                                                return res.json({
                                                    status: 200,
                                                    isSuccess: true,
                                                    msg: '操作成功'
                                                });
                                            } else {
                                                res.status(404);

                                                return res.json({
                                                    status: 404,
                                                    isSuccess: false,
                                                    msg: results
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(400);

                                        return res.json({
                                            status: 400,
                                            isSuccess: false,
                                            msg: '操作失败，添加的项目成员信息有误！'
                                        });
                                    }
                                });
                            } else {
                                res.status(200);

                                return res.json({
                                    status: 200,
                                    isSuccess: true,
                                    msg: '操作成功'
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

//根据用户查询有关的项目
router.get('/user', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (results !== undefined && results.isSuccess === true) {
            var query =  JSON.parse(req.query.f),
                userID = query.UserID || req.query.jitkey;

            if (userID===undefined||userID=='') {
                res.status(400);

                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '缺少用户ID'
                });
            }

            projectuserservice.queryProjectByUserID({UserID: userID, OperateUserID: req.query.jitkey}, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                var projectInfo = [];

                if (results.length>0) {
                    projectInfo = results;
                }

                projectservice.queryProject({ProjectManageID:userID, IsActive:1, OperateUserID: req.query.jitkey}, function (err, results) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    if (results.length>0) {
                        var i=0,j=0;

                        for (i;i<results.length;++i) {
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
                        res.status(200);

                        return res.json({
                            status: 200,
                            isSuccess: true,
                            data: projectInfo
                        });
                    } else {
                        res.status(200);

                        return res.json({
                            status: 200,
                            isSuccess: true,
                            data: projectInfo
                        });
                    }
                });
            });
        } else {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    });
});

//项目基本信息查询-项目负责人
router.get('/person', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query =  JSON.parse(req.query.f),
            ID = query.ID || '',
            projectManageID = req.query.jitkey,
            startTime = query.startTime || '',
            endTime = query.endTime || '',
            page = req.query.pageindex>0 ?req.query.pageindex:1,
            pageNum = req.query.pagesize || config.pageCount,
            totalNum = 0;

        data = {
            'ID': ID,
            'ProjectManageID': projectManageID,
            'CreateTime': startTime,
            'ProjectEndTime': endTime,
            'OperateUserID': req.query.jitkey,
            'IsActive': 1,
            'page': page,
            'pageNum': pageNum,
        };

        //查询数据量
        projectservice.countQuery(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
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
                        });
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

                        if (totalNum != 1) {
                            res.status(200);

                            return res.json(result);
                        }

                        projectuserservice.queryProjectUser({ProjectID: results[0].ID, OperateUserID: req.query.jitkey}, function (err, results) {
                            if (err) {
                                res.status(500);

                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                });
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
                        });
                    } else {
                        res.status(200);

                        return res.json({
                            status: 200,
                            isSuccess: false,
                            msg: '无数据'
                        });
                    }
                });
            } else {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    msg: '无数据'
                });
            }
        });
    });
});

//项目基本信息查询-管理员
router.get('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
        var query =  JSON.parse(req.query.f),
            ID = query.ID || '',
            projectManageID = query.projectManageID || '',
            startTime = query.startTime || '',
            endTime = query.endTime || '',
            selectType = req.query.isPaging || '',
            page = req.query.pageindex>0 ?req.query.pageindex:1,
            pageNum = req.query.pagesize || config.pageCount,
            totalNum = 0;

        data = {
            'ID': ID,
            'ProjectManageID': projectManageID,
            'CreateTime': startTime,
            'ProjectEndTime': endTime,
            'SelectType': selectType,
            'OperateUserID': req.query.jitkey,
            'page': page,
            'pageNum': pageNum,
        };

        //查询数据量
        projectservice.countQuery(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            totalNum = results[0].num;

            if(totalNum <= 0) {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    msg: '无数据'
                });
            }
            //查询所需的详细数据
            projectservice.queryProject(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }
                if (!(results !== undefined && results.length > 0)) {
                    res.status(200);

                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '无数据'
                    });
                }
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
                            });
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
                    });
                } else {
                    res.status(200);

                    return res.json(result);
                }
            });
        });
    });
});

//项目删除
router.delete('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.projectManage.projectDelete.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (results !== undefined && results.isSuccess === true) {
            var ID = JSON.parse(req.query.d).ID;

            if (ID == '' || ID === undefined) {
                res.status(400);

                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '缺少项目ID'
                })
            }

            data = {
                'ID': ID,
                'OperateUserID': req.query.jitkey,
                'IsActive': 0
            };

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

                    return res.json({
                        status: 200,
                        isSuccess: true,
                        msg: "操作成功"
                    })
                } else {
                    res.status(400);

                    return res.json({
                        status: 400,
                        isSuccess: true,
                        msg: "操作失败"
                    });
                }
            });
        } else {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    });
});
module.exports = router;