/**
 * @Author: bitzo
 * @Date: 2016/11/13 19:04
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 19:04
 * @Function: 角色查询模块路由
 */

var express = require('express'),
    router = express.Router(),
    config = appRequire('config/config'),
    roleservice = appRequire('service/backend/role/roleservice'),
    rolefuncservice = appRequire('service/backend/role/rolefuncservice'),
    functionservice = appRequire('service/backend/function/functionservice'),
    logger = appRequire("util/loghelper").helper,
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice');

//查询角色信息
router.get('/',function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleManage.roleQuery.functionCode
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
            var query = JSON.parse(req.query.f),
                appID = query.ApplicationID || '',
                roleID = query.RoleID || '',
                page = req.query.pageindex || 1,
                pageNum = req.query.pagesize || config.pageCount,
                isActive = query.IsActive || '',
                selectType = req.query.isPaging || '',
                roleName = query.RoleName || '',
                roleCode = query.RoleCode || '',
                page = page > 0 ? page : 1;

            data = {
                'ApplicationID': appID,
                'RoleID': roleID,
                'SelectType': selectType,
                'IsActive': isActive,
                'RoleName': roleName,
                'RoleCode': roleCode,
                'page': page,
                'pageNum': pageNum,
                'OperateUserID': req.query.jitkey
            };

            //用于查询结果总数的计数
            var countNum = 0;

            //查询所有数据总数
            roleservice.countAllRoles(data, function (err, results) {
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

                    //查询所需的详细数据
                    roleservice.queryAllRoles(data, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "查询失败，服务器内部错误"
                            });
                        }

                        if (results !== undefined && results.length != 0 && countNum != -1) {
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
                    });
                } else {
                    res.status(200);

                    return res.json({
                        code: 200,
                        isSuccess: false,
                        msg: "未查询到相关信息"
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
        };
    });
});

//增加角色信息
router.post('/',function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleManage.roleAdd.functionCode
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

        var data = ['RoleCode', 'RoleName', 'IsActive'],
            temp = ['角色代码', '角色名称', '是否有效'];

        err = '缺少值： ';

        //增加角色功能点所需要的数据
        var funcData = req.body.funcData;

        for(var value in data)
        {
            if(!(data[value] in req.body.formdata))
            {
                err += temp[value] + ' ';
            }
        }

        if(err!='缺少值： ')
        {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: err
            });
        }

        //增加角色所需要的参数
        var applicationID = req.body.formdata.ApplicationID || 1,
            roleCode = req.body.formdata.RoleCode,
            roleName = req.body.formdata.RoleName,
            isActive = req.body.formdata.IsActive;

        //先查询要增添的角色信息是否已经存在
        data = {
            'RoleCode': roleCode
        };

        roleservice.countAllRoles(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "操作失败，服务器内部错误"
                });
            }

            //没有查询重复的相关信息,则可以添加用户
            if (!(results !== undefined && results[0]['num'] == 0)) {
                res.status(400);

                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: "角色数据重复，添加失败"
                });
            }

            //先增添角色信息
            data = {
                'ApplicationID': applicationID,
                'RoleCode': roleCode,
                'RoleName': roleName,
                'IsActive': isActive,
                'OperateUserID': req.query.jitkey
            };

            if (data.RoleName.length>50) {
                res.status(400);

                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: '角色名称过长'
                });
            }

            if (data.RoleCode.length>50) {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: '角色代码过长'
                });
            }

            roleservice.addRole(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "操作失败，服务器出错"
                    });
                }

                //角色信息增添成功
                if (!(results !== undefined && results.length != 0)) {
                    res.status(400);

                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "添加角色失败"
                    });
                }
                var roleID = results.insertId;

                //若存在功能点数据，则继续新增该角色的功能点
                if (!(funcData !== undefined && funcData.length>0)) {
                    res.status(200);

                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: "操作成功"
                    });
                }

                //声明空数组存放FunctionID
                var funcID = [],
                    i = 0;

                for (i=0;i<funcData.length;++i) {
                    funcID[i] = funcData[i].FunctionID;
                }

                var queryData = {
                    'FunctionID': funcID
                };

                //验证传入的functionID是否都存在或有效
                functionservice.queryFuncByID(queryData, function (err, results) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: "角色添加成功，功能点添加失败，服务器出错"
                        });
                    }

                    var count = results[0]['count'];

                    if (!(results!==undefined && count == funcData.length)) {
                        res.status(200);

                        return res.json({
                            code: 400,
                            isSuccess: false,
                            funcData: {},
                            msg: "角色已添加，功能点数据有误，请重新编辑"
                        });
                    }

                    //数据相同可以添加功能点
                    data = {
                        'RoleID': roleID,
                        'data': funcData,
                        'OperateUserID': req.query.jitkey
                    };

                    logger.writeInfo("成功获取RoleID: "+roleID);

                    //通过获取到的RoleID 与前端传输的功能点数据，为角色增加功能点
                    rolefuncservice.addRoleFunc(data, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "角色添加成功，功能点添加失败，服务器出错"
                            });
                        }

                        //增添成功
                        if (results !== undefined && results.affectedRows != 0) {
                            res.status(200);

                            return res.json({
                                code: 200,
                                isSuccess: true,
                                funcData: funcData,
                                msg: "操作成功"
                            });
                        } else {
                            res.status(200);

                            return res.json({
                                code: 404,
                                isSuccess: false,
                                funcData: {},
                                msg: "角色已添加，功能点添加失败"
                            });
                        }
                    });
                });
            });
        });
    });
});

//角色基本信息更改
router.put('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleManage.roleEdit.functionCode
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

        err = '缺少值: ';
        data = ['RoleID', 'RoleCode', 'RoleName', 'IsActive'];
        var temp = ['角色ID', '角色代码', '角色名称', '是否有效'];

        //编辑角色基本信息所需要的数据
        var appID = req.body.formdata.ApplicationID || 1,
            roleID = req.body.formdata.RoleID,
            roleCode = req.body.formdata.RoleCode,
            roleName = req.body.formdata.RoleName,
            isActive = req.body.formdata.IsActive;

        //增加角色功能点所需要的数据
        var funcData = req.body.funcdata;

        for(var value in data)
        {
            if(!(data[value] in req.body.formdata))
            {
                err += temp[value] + ' ';
            }
        }

        if(err!='缺少值: ')
        {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: err
            });
        }

        data = {
            'ApplicationID': appID,
            'RoleID': roleID,
            'RoleCode': roleCode,
            'RoleName': roleName,
            'IsActive': isActive,
            'OperateUserID': req.query.jitkey
        };

        if (data.RoleName.length>50) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: '角色名称过长'
            });
        }

        if (data.RoleCode.length>50) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: '角色代码过长'
            });
        }

        //先查询要增添的角色信息是否已经存在
        var querydata = {
            'RoleID': roleID,
            'RoleCode': roleCode
        };

        roleservice.countAllRoles(querydata, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "操作失败，服务器内部错误"
                });
            }

            //没有查询重复的相关信息,则可以添加用户
            if (!(results !== undefined && results[0]['num'] <= 1)) {
                res.status(400);

                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: "角色数据重复，添加失败"
                });
            }

            roleservice.updateRole(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "操作失败，服务器内部错误"
                    });
                }

                //完成角色基本信息修改
                if (!(results !== undefined && results.affectedRows != 0)) {
                    res.status(400);

                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "操作失败"
                    });
                }

                //如果存在功能点数据，则继续修改功能点
                if (funcData === undefined) {
                    res.status(200);

                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: "操作成功"
                    });
                }

                //声明空数组存放FunctionID
                var funcID = [],
                    i = 0;

                for (i = 0; i < funcData.length; ++i) {
                    funcID[i] = funcData[i].FunctionID;
                }

                var queryData = {
                    'FunctionID': funcID
                };

                logger.writeInfo(queryData);

                if(funcID.length>0){
                    //验证传入的functionID是否都存在或有效
                    functionservice.queryFuncByID(queryData, function (err, results) {
                        if (err) {
                            res.status(200);

                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "角色修改成功，功能点添加失败，服务器出错"
                            })
                        }

                        var count = results[0]['count'];

                        if (!(results!==undefined && count == funcData.length)) {
                            res.status(200);

                            return res.json({
                                code: 400,
                                isSuccess: false,
                                msg: "修改角色基本信息成功，修改功能点数据失败，功能点数据有误"
                            });
                        }

                        //数据相同可以添加功能点
                        data = {
                            "RoleID":roleID,
                            "data":funcData,
                            'OperateUserID': req.query.jitkey
                        };

                        //先删除原先的功能点
                        rolefuncservice.delRoleFunc(data, function (err, results) {
                            if (err) {
                                res.status(200);

                                return res.json({
                                    code: 500,
                                    isSuccess: false,
                                    msg: "修改角色基本信息成功，修改功能点失败，服务器出错"
                                });
                            }
                            //已删除原来的功能点准备新增
                            if (results!==undefined) {
                                rolefuncservice.addRoleFunc(data, function (err, results) {
                                    if (err) {
                                        res.status(200);

                                        return res.json({
                                            code: 500,
                                            isSuccess: false,
                                            msg: "修改角色基本信息成功，修改功能点失败，服务器出错"
                                        });
                                    }

                                    if (results !== undefined && results.affectedRows != 0) {
                                        res.status(200);

                                        return res.json({
                                            code: 200,
                                            isSuccess: true,
                                            msg: "操作成功"
                                        });
                                    } else {
                                        res.status(200);

                                        return res.json({
                                            code: 404,
                                            isSuccess: false,
                                            msg: "修改角色成功，修改功能点信息失败"
                                        });
                                    }
                                })
                            }
                        })
                    })
                } else {
                    data = {
                        "RoleID": roleID,
                        'OperateUserID': req.query.jitkey
                    };

                    rolefuncservice.delRoleFunc(data, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "操作失败，服务器出错"
                            });
                        }

                        if (results !== undefined && results.affectedRows != 0) {
                            res.status(200);

                            return res.json({
                                code: 200,
                                isSuccess: true,
                                msg: "操作成功"
                            });
                        } else {
                            res.status(400);

                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "操作失败"
                            });
                        }
                    });
                }
            })
        })
    });
});

//删除角色
router.delete('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleManage.roleDel.functionCode
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
            var roleID = JSON.parse(req.query.d).RoleID;

            if (roleID == '' || roleID === undefined) {
                res.status(400);

                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: "缺少角色ID"
                })
            }

            data = {
                'RoleID': roleID,
                'IsActive': 0,
                'OperateUserID': req.query.jitkey
            };

            roleservice.updateRole(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "服务器出错"
                    });
                }
                if (results!==undefined && results.affectedRows > 0) {
                    rolefuncservice.delRoleFunc(data, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "服务器出错"
                            });
                        }
                        if (results !== undefined) {
                            res.status(200);

                            return res.json({
                                status: 200,
                                isSuccess: true,
                                msg: "禁用成功"
                            })
                        } else {
                            res.status(400);

                            return res.json({
                                status: 400,
                                isSuccess: true,
                                msg: "禁用失败"
                            })
                        }
                    });
                } else {
                    res.status(400);

                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: "禁用失败"
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