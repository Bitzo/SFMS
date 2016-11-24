/**
 * @Author: bitzo
 * @Date: 2016/11/13 19:04
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 19:04
 * @Function: 角色查询模块路由
 */

var express = require('express');
var router = express.Router();
var config = appRequire('config/config');

var roleservice = appRequire('service/backend/role/roleservice');
var rolefuncservice = appRequire('service/backend/role/rolefuncservice');
var functionservice = appRequire('service/backend/function/functionservice');

var logger = appRequire("util/loghelper").helper;

//查询角色信息
router.get('/',function (req, res) {
    var appID = req.query.appID;
    var page = req.query.page || 1;
    page = page>0?page:1;

    var roleName = req.query.RoleName;
    var isActive = req.query.IsActive;

    var data = {
        'ApplicationID': appID,
        'page': page,
        'RoleName': roleName,
        'IsActive': isActive
    };

    //用于查询结果总数的计数
    var countNum = 0;

    //查询所有数据总数
    roleservice.countAllRoles(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "查询失败，服务器内部错误"
            });
            return;
        }
        if (results !==undefined && results.length != 0) {
            countNum = results[0]['num'];

            //查询所需的详细数据
            roleservice.queryAllRoles(data, function (err, results) {
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                    return;
                }

                if (results !== undefined && results.length != 0 && countNum != -1) {
                    var result = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:config.pageCount,
                        totlePage: Math.ceil(countNum/config.pageCount),
                        data: results
                    };
                    if(result.curPage == result.totlePage) {
                        result.curPageNum = result.dataNum - (result.totlePage-1)*config.pageCount;
                    }
                    res.json(result);
                    return;
                } else {
                    res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相关信息"
                    });
                    return;
                }

            });
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
            return;
        }
    });

});

//增加角色信息
router.post('/',function (req, res) {

    var data = ['ApplicationID', 'RoleCode', 'RoleName', 'IsActive'];
    var err = 'required: ';
    for(var value in data)
    {
        if(!(data[value] in req.body))
        {
            console.log("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if(err!='required: ')
    {
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    };

    //增加角色所需要的参数
    var applicationID = req.body.ApplicationID;
    var roleCode = req.body.RoleCode;
    var roleName = req.body.RoleName;
    var isActive = req.body.IsActive;

    //增加角色功能点所需要的数据
    var funcData = req.body.data;

    //先查询要增添的角色信息是否已经存在
    var data = {
        'ApplicationID': applicationID,
        'RoleName': roleName
    };
    roleservice.countAllRoles(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "增加失败，服务器内部错误"
            });
            return;
        }
        //没有查询重复的相关信息,则可以添加用户
        if (results !== undefined && results[0]['num'] == 0) {
            //先增添角色信息

            data = {
                'ApplicationID': applicationID,
                'RoleCode': roleCode,
                'RoleName': roleName,
                'IsActive': isActive
            };

            roleservice.addRole(data, function (err, results) {
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "添加失败，服务器出错"
                    })
                    return;
                }
                //角色信息增添成功
                if (results !== undefined && results.length != 0) {
                    var roleID = results.insertId;
                    //若存在功能点数据，则继续新增该角色的功能点
                    if (funcData !== undefined){
                        //声明空数组存放FunctionID
                        var funcID = [];
                        var i;
                        for (i=0;i<funcData.length;++i) {
                            funcID[i] = funcData[i].FunctionID;
                        }
                        var queryData = {
                            'ApplicationID': applicationID,
                            'FunctionID': funcID
                        }
                        //验证传入的functionID是否都存在或有效
                        functionservice.queryFuncByID(queryData, function (err, results) {
                            if (err) {
                                res.json({
                                    code: 500,
                                    isSuccess: false,
                                    msg: "用户添加成功，功能点添加成功，服务器出错"
                                })
                                return;
                            }
                            var count = results[0]['count'];
                            if (results!==undefined && count == i) {
                                //数据相同可以添加功能点
                                data = {
                                    'RoleID': roleID,
                                    'data': funcData
                                }
                                logger.writeInfo("成功获取RoleID: "+roleID);
                                //通过获取到的RoleID 与前端传输的功能点数据，为角色增加功能点
                                rolefuncservice.addRoleFunc(data, function (err, results) {
                                    if (err) {
                                        res.json({
                                            code: 500,
                                            isSuccess: false,
                                            msg: "用户添加成功，功能点添加失败，服务器出错"
                                        })
                                        return;
                                    }
                                    //增添成功
                                    if (results !== undefined && results.affectedRows != 0) {
                                        res.json({
                                            code: 200,
                                            isSuccess: true,
                                            msg: "添加信息成功"
                                        })
                                        return;
                                    } else {
                                        res.json({
                                            code: 404,
                                            isSuccess: false,
                                            msg: "用户已添加，功能点添加失败"
                                        })
                                        return;
                                    }
                                })
                            } else {
                                //数据非法，重新输入
                                res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: "角色已添加，功能点数据有误，请重新编辑"
                                })
                                return;
                            }
                        })
                    } else {
                       res.json({
                           code: 200,
                           isSuccess: true,
                           msg: "添加用户成功"
                       })
                       return;
                    }
                } else {
                    res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "添加用户失败"
                    })
                    return;
                }
        })
        }else {
            res.json({
                code: 400,
                isSuccess: false,
                msg: "用户数据重复，添加失败"
            })
            return;
        }
    })
});

//角色基本信息更改
router.put('/', function (req, res) {
    var data = ['ApplicationID', 'RoleID', 'RoleCode', 'RoleName', 'IsActive'];
    var err = 'required: ';
    for(var value in data)
    {
        if(!(data[value] in req.body))
        {
            logger.writeInfo("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if(err!='required: ')
    {
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    }

    //编辑角色基本信息所需要的数据
    var appID = req.body.ApplicationID;
    var roleID = req.body.RoleID;
    var roleCode = req.body.RoleCode;
    var roleName = req.body.RoleName;
    var isActive = req.body.IsActive;

    //增加角色功能点所需要的数据
    var funcData = req.body.data;

    data = {
        'ApplicationID': appID,
        'RoleID': roleID,
        'RoleCode': roleCode,
        'RoleName': roleName,
        'IsActive': isActive
    };

    roleservice.updateRole(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "修改信息失败，服务器内部错误"
            });
            return;
        }
        //完成角色基本信息修改
        if (results !== undefined && results.affectedRows != 0) {
            //如果存在功能点数据，则继续修改功能点
            if (funcData !== undefined) {
                    //声明空数组存放FunctionID
                    var funcID = [];
                    var i;
                    for (i = 0; i < funcData.length; ++i) {
                        funcID[i] = funcData[i].FunctionID;
                    }
                    var queryData = {
                        'ApplicationID': appID,
                        'FunctionID': funcID
                    }
                    console.log(queryData);
                    //验证传入的functionID是否都存在或有效
                    functionservice.queryFuncByID(queryData, function (err, results) {
                        if (err) {
                            res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "角色修改成功，功能点添加成功，服务器出错"
                            })
                            return;
                        }
                        var count = results[0]['count'];
                        if (results!==undefined && count == i) {
                            //数据相同可以添加功能点
                            data = {
                                "RoleID":roleID,
                                "data":funcData
                            }
                            //先删除原先的功能点
                            rolefuncservice.delRoleFunc(data, function (err, results) {
                                if (err) {
                                    res.json({
                                        code: 500,
                                        isSuccess: false,
                                        msg: "修改角色基本信息成功，修改功能点失败，服务器出错"
                                    });
                                    return;
                                }
                                //已删除原来的功能点准备新增
                                if (results!==undefined) {
                                    rolefuncservice.updateRoleFunc(data, function (err, results) {
                                        if (err) {
                                            res.json({
                                                code: 500,
                                                isSuccess: false,
                                                msg: "修改角色基本信息成功，修改功能点失败，服务器出错"
                                            });
                                            return;
                                        }
                                        if (results !== undefined && results.affectedRows != 0) {
                                            res.json({
                                                code: 200,
                                                isSuccess: true,
                                                msg: "修改信息成功"
                                            });
                                            return;
                                        } else {
                                            res.json({
                                                code: 404,
                                                isSuccess: false,
                                                msg: "修改角色成功，修改功能点信息失败"
                                            });
                                            return;
                                        }
                                    })
                                }
                            })
                        } else {
                            //数据非法，重新输入
                            res.json({
                                code: 400,
                                isSuccess: false,
                                msg: "修改角色基本信息成功，修改功能点数据失败，功能点数据有误"
                            });
                            return;
                        }
                    })
            } else {
                res.json({
                    code: 200,
                    isSuccess: true,
                    msg: "修改信息成功"
                });
                return;
            }
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: "修改信息失败"
            });
            return;
        }
    })
});

module.exports = router;