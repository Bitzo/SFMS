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
//引入角色服务、角色功能点服务、功能点服务
var roleservice = appRequire('service/backend/role/roleservice');
var rolefuncservice = appRequire('service/backend/role/rolefuncservice');
var functionservice = appRequire('service/backend/function/functionservice');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//查询角色信息
router.get('/',function (req, res) {
    var query = JSON.parse(req.query.f);
    var appID = query.ApplicationID || '',
        roleID = query.RoleID || '',
        page = req.query.pageindex || 1,
        pageNum = req.query.pagesize || 20,
        roleName = query.RoleName || '',
        isActive = query.IsActive || 1;
    page = page>0?page:1;

    if (pageNum == '') pageNum = config.pageCount;

    var data = {
        'ApplicationID': appID,
        'RoleID': roleID,
        'page': page,
        'pageNum': pageNum,
        'RoleName': roleName,
        'IsActive': isActive
    };
    console.log(data)
    //用于查询结果总数的计数
    var countNum = 0;

    //查询所有数据总数
    roleservice.countAllRoles(data, function (err, results) {
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
});

//增加角色信息
router.post('/',function (req, res) {
    console.log(req.body);
    var data = ['ApplicationID', 'RoleCode', 'RoleName', 'IsActive'],
        err = 'required: ';

    //增加角色所需要的参数
    var applicationID = req.body.formdata.ApplicationID,
        roleCode = req.body.formdata.RoleCode,
        roleName = req.body.formdata.RoleName,
        isActive = req.body.formdata.IsActive;

    //增加角色功能点所需要的数据
    var funcData = req.body.formdata.data;

    for(var value in data)
    {
        if(!(data[value] in req.body.formdata))
        {
            console.log("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if(err!='required: ')
    {
        res.status(400);
        return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: err
                });
    };

    //先查询要增添的角色信息是否已经存在
    data = {
        'ApplicationID': applicationID,
        'RoleName': roleName
    };
    roleservice.countAllRoles(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "增加失败，服务器内部错误"
                    });
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
                    res.status(500);
                    return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "添加失败，服务器出错"
                            })
                }
                //角色信息增添成功
                if (results !== undefined && results.length != 0) {
                    var roleID = results.insertId;
                    //若存在功能点数据，则继续新增该角色的功能点
                    if (funcData !== undefined){
                        //声明空数组存放FunctionID
                        var funcID = [],
                            i = 0;

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
                                res.status(500);
                                return res.json({
                                            code: 500,
                                            isSuccess: false,
                                            msg: "用户添加成功，功能点添加成功，服务器出错"
                                        })
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
                                        res.status(500);
                                        return res.json({
                                                    code: 500,
                                                    isSuccess: false,
                                                    msg: "用户添加成功，功能点添加失败，服务器出错"
                                                })
                                    }
                                    //增添成功
                                    if (results !== undefined && results.affectedRows != 0) {
                                        res.status(200);
                                        return res.json({
                                                    code: 200,
                                                    isSuccess: true,
                                                    msg: "添加信息成功"
                                                })
                                    } else {
                                        res.status(200);
                                        return res.json({
                                                    code: 404,
                                                    isSuccess: false,
                                                    msg: "用户已添加，功能点添加失败"
                                                })
                                    }
                                })
                            } else {
                                //数据非法，重新输入
                                res.status(200);
                                return res.json({
                                            code: 400,
                                            isSuccess: false,
                                            msg: "角色已添加，功能点数据有误，请重新编辑"
                                        })
                            }
                        })
                    } else {
                        res.status(200);
                        return res.json({
                                   code: 200,
                                   isSuccess: true,
                                   msg: "添加用户成功"
                               })
                    }
                } else {
                    res.status(400);
                    return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "添加用户失败"
                            })
                }
        })
        }else {
            res.status(400);
            return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: "用户数据重复，添加失败"
                    })
        }
    })
});

//角色基本信息更改
router.put('/', function (req, res) {
    var data = ['ApplicationID', 'RoleID', 'RoleCode', 'RoleName', 'IsActive'],
        err = 'required: ';

    //编辑角色基本信息所需要的数据
    var appID = req.body.formdata.ApplicationID,
        roleID = req.body.formdata.RoleID,
        roleCode = req.body.formdata.RoleCode,
        roleName = req.body.formdata.RoleName,
        isActive = req.body.formdata.IsActive;

    //增加角色功能点所需要的数据
    var funcData = req.body.formdata.data;

    for(var value in data)
    {
        if(!(data[value] in req.body.formdata))
        {
            logger.writeInfo("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if(err!='required: ')
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
        'IsActive': isActive
    };

    roleservice.updateRole(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "修改信息失败，服务器内部错误"
                    });
        }
        //完成角色基本信息修改
        if (results !== undefined && results.affectedRows != 0) {
            //如果存在功能点数据，则继续修改功能点
            if (funcData !== undefined) {
                    //声明空数组存放FunctionID
                    var funcID = [],
                        i = 0;

                    for (i = 0; i < funcData.length; ++i) {
                        funcID[i] = funcData[i].FunctionID;
                    }

                    var queryData = {
                        'ApplicationID': appID,
                        'FunctionID': funcID
                    }
                    logger.writeInfo(queryData);
                    //验证传入的functionID是否都存在或有效
                    functionservice.queryFuncByID(queryData, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                        code: 500,
                                        isSuccess: false,
                                        msg: "角色修改成功，功能点添加成功，服务器出错"
                                    })
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
                                    res.status(500);
                                    return res.json({
                                                code: 500,
                                                isSuccess: false,
                                                msg: "修改角色基本信息成功，修改功能点失败，服务器出错"
                                            });
                                }
                                //已删除原来的功能点准备新增
                                if (results!==undefined) {
                                    rolefuncservice.updateRoleFunc(data, function (err, results) {
                                        if (err) {
                                            res.status(500);
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
                                                        msg: "修改信息成功"
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
                        } else {
                            //数据非法，重新输入
                            res.status(400);
                            return res.json({
                                        code: 400,
                                        isSuccess: false,
                                        msg: "修改角色基本信息成功，修改功能点数据失败，功能点数据有误"
                                    });
                        }
                    })
            } else {
                res.status(200);
                return res.json({
                            code: 200,
                            isSuccess: true,
                            msg: "修改信息成功"
                        });
            }
        } else {
            res.status(400);
            return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "修改信息失败"
                    });
        }
    })
});

//删除角色
router.delete('/', function (req, res) {
    var roleID = JSON.parse(req.query.d).RoleID;
    if (roleID == '' || roleID === undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: "require RoleID"
        })
    }

    var data = {
        'RoleID': roleID,
        'IsActive': 0
    }

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
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: "删除失败"
            });
        }
    })
})
module.exports = router;