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

//查询角色信息
router.get('/',function (req, res) {
    var appID = req.query.appID;
    var page = req.query.page || 1;

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
                        totlePage: Math.ceil(countNum/config.pageCount),
                        data: results
                    };
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

    var data = {
        'ApplicationID': applicationID,
        'RoleCode': roleCode,
        'RoleName': roleName,
        'IsActive': isActive
    };

    //先增添角色信息
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
            if (funcData !== undefined){
                //查询刚才添加的角色信息的RoleID
                roleservice.queryAllRoles(data, function (err, results) {
                    if (err) {
                        res.json({
                            code: 500,
                            isSuccess: false,
                            msg: "添加失败，服务器出错"
                        });
                        return;
                    }
                    //成功获取添加的角色RoleID
                    if (results !== undefined && results.length != 0) {
                        var roleID = results[0].RoleID;
                        data = {
                            'RoleID': roleID,
                            'FunctionID': funcData
                        }
                        console.log("成功获取RoleID: "+roleID);
                        //通过获取到的RoleID 与前端传输的功能点数据，为角色增加功能点
                        rolefuncservice.addRoleFunc(data, function (err, results) {
                            if (err) {
                                res.json({
                                    code: 500,
                                    isSuccess: false,
                                    msg: "添加失败，服务器出错"
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
                                    msg: "添加信息失败"
                                })
                                return;
                            }
                        })
                    } else {
                        res.json({
                            code: 404,
                            isSuccess: false,
                            msg: "添加信息失败"
                        });
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
});

module.exports = router;