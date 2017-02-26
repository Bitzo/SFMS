/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:39
 * @Function: 角色功能点的增删改查
 */

var express = require('express'),
    router = express.Router(),
    rolefuncservice = appRequire('service/backend/role/rolefuncservice'),
    functionservice = appRequire('service/backend/function/functionservice'),
    logger = appRequire("util/loghelper").helper,
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice');

//角色功能查询
router.get('/:roleID', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleFuncManage.roleFuncQuery.functionCode
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
            var roleID = req.params.roleID;

            data = {
                'RoleID': roleID,
                'OperateUserID': req.query.jitkey
            };

            if (roleID === undefined) {
                res.status(404);

                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: 'require roleID'
                })
            }

            rolefuncservice.queryRoleFunc(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '查询失败，服务器出错'
                    });
                }

                //查询到结果并返回
                if (results !== undefined && results.length != 0) {
                    res.status(200);

                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: results.length,
                        data: results
                    })
                } else {
                    res.status(200);

                    return res.json({
                        code: 404,
                        isSuccess: true,
                        msg: '未查到结果'
                    })
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
    });
});

//角色功能点新增
router.post('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleFuncManage.roleFuncAdd.functionCode
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
            var err = 'required: ',
                roleID = req.body.RoleID,
                funcData = req.body.data;

            data = ['RoleID', 'FunctionID'];

            for (var value in data) {
                if (req.body.data.length > 0) {
                    if ((!(data[value] in req.body.data[0])) && (!(data[value] in req.body))) {
                        logger.writeError("require " + data[value]);
                        err += data[value] + ' ';
                    }
                }
            }

            if (err != 'required: ') {
                res.status(400);

                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: err
                });
            }

            var funcID = [],
                i = 0;

            for (i = 0; i < funcData.length; ++i) {
                funcID[i] = funcData[i].FunctionID;
            }

            data = {
                'FunctionID': funcID
            };

            //验证传入的functionID是否都存在或有效
            functionservice.queryFuncByID(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "功能点增加操作失败，服务器出错"
                    });
                }

                var count = results[0]['count'];

                if (results !== undefined && count == i) {
                    //数据相同可以添加功能点
                    data = {
                        'RoleID': roleID,
                        'data': funcData,
                        'OperateUserID': req.query.jitkey
                    };

                    //先删除原来的功能点
                    rolefuncservice.delRoleFunc(data, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "操作失败，服务器出错"
                            });
                        }
                        //删除角色功能点成功
                        if (results !== undefined) {
                            //新增功能点
                            rolefuncservice.addRoleFunc(data, function (err, results) {
                                logger.writeInfo(results);
                                if (err) {
                                    res.status(500);

                                    return res.json({
                                        code: 500,
                                        isSuccess: false,
                                        msg: "操作失败，服务器出错"
                                    });
                                }

                                if (results !== undefined && results.insertId > 0) {
                                    data = {
                                        code: 200,
                                        isSuccess: true,
                                        funcData: data.data,
                                        msg: "操作成功"
                                    };
                                    res.status(200);
                                    return res.json(data);
                                } else {
                                    res.status(400);

                                    return res.json({
                                        code: 400,
                                        isSuccess: false,
                                        msg: "操作失败"
                                    });
                                }
                            });
                        }
                    });
                } else {
                    //数据非法，重新输入
                    res.status(400);

                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: "功能点数据有误，请重新编辑"
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

//角色功能点删除
router.delete('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.roleFuncManage.roleFuncDel.functionCode
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
            if (req.body.RoleID === undefined) {
                res.status(400);

                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: "require RoleID"
                });
            }

            data = {
                "RoleID": req.body.RoleID,
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