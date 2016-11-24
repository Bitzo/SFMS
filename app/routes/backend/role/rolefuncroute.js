/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:39
 * @Function: 角色功能点的增删改查
 */

var express = require('express');
var router = express.Router();

var rolefuncservice = appRequire('service/backend/role/rolefuncservice');
var functionservice = appRequire('service/backend/function/functionservice');

var logger = appRequire("util/loghelper").helper;

//角色功能查询
router.get('/:roleID',function (req, res) {
    var roleID = req.params.roleID;

    if (roleID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require roleID'
        })
        return;
    }

    var data = {
        'RoleID': roleID
    };
    
    rolefuncservice.queryRoleFunc(data, function (err, results) {
        if (err) {
            res.json({
                code:500,
                isSuccess: false,
                msg:'查询失败，服务器出错'
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            res.json({
                code:200,
                isSuccess: true,
                msg: '查询成功',
                dataNum: results.length,
                data: results
            })
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: '未查到结果'
            })
        }
    })

});

//角色功能点新增
router.post('/', function (req, res) {

    var data = ['ApplicationID', 'RoleID', 'FunctionID'];
    var err = 'required: ';

    for(var value in data)
    {
        if((!(data[value] in req.body.data[0]))&&(!(data[value] in req.body)))
        {
            logger.writeError("require " + data[value]);
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

    var applicationID = req.body.ApplicationID;
    var roleID = req.body.RoleID;
    var funcData = req.body.data;


    var funcID = [];
    var i;
    for (i=0;i<funcData.length;++i) {
        funcID[i] = funcData[i].FunctionID;
    }

    var data = {
        'ApplicationID': applicationID,
        'FunctionID': funcID
    }
    //验证传入的functionID是否都存在或有效
    functionservice.queryFuncByID(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "功能点增加失败，服务器出错"
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
            //先删除原来的功能点
            rolefuncservice.delRoleFunc(data,function (err, results) {
                logger.writeInfo(results);
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "添加失败，服务器出错"
                    })
                    return;
                }
                //删除角色功能点成功
                if (results!==undefined) {
                    //新增功能点
                    rolefuncservice.addRoleFunc(data, function (err, results) {
                        logger.writeInfo(results);
                        if (err) {
                            res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "添加失败，服务器出错"
                            })
                            return;
                        }
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
                }
            })
        } else {
            //数据非法，重新输入
            res.json({
                code: 400,
                isSuccess: false,
                msg: "功能点数据有误，请重新编辑"
            })
            return;
        }
    })
});

//角色功能点修改
router.put('/',function (req, res) {

    var data = ['ApplicationID', 'RoleID', 'FunctionID'];
    var err = 'required: ';

    for(var value in data)
    {
        if((!(data[value] in req.body.data[0]))&&(!(data[value] in req.body)))
        {
            logger.writeError("require " + data[value]);
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

    var applicationID = req.body.ApplicationID;
    var roleID = req.body.RoleID;
    var funcData = req.body.data;

    var funcID = [];
    var i;
    for (i=0;i<funcData.length;++i) {
        funcID[i] = funcData[i].FunctionID;
    }

    var data = {
        'ApplicationID': applicationID,
        'FunctionID': funcID
    }
    //验证传入的functionID是否都存在或有效
    functionservice.queryFuncByID(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "功能点修改失败，服务器出错"
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
            //先删除原先的功能点
            rolefuncservice.delRoleFunc(data, function (err, results) {
                logger.writeInfo(results);
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "修改失败，服务器出错"
                    })
                    return;
                }
                //删除成功，开始修改
                if(results!==undefined) {
                    rolefuncservice.updateRoleFunc(data, function (err, results) {
                        logger.writeInfo(results);
                        if (err) {
                            res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "修改失败，服务器出错"
                            })
                            return;
                        }
                        if (results !== undefined && results.affectedRows != 0) {
                            res.json({
                                code: 200,
                                isSuccess: true,
                                msg: "修改信息成功"
                            })
                            return;
                        } else {
                            res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "修改信息失败"
                            })
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
                msg: "功能点数据有误，请重新编辑"
            })
            return;
        }
    })
})

//角色功能点删除
router.delete('/', function (req, res) {
    if (req.body.RoleID === undefined) {
        res.json({
            code: 400,
            isSuccess: false,
            msg: "require RoleID"
        })
        return;
    }

    var data = {
        "RoleID": req.body.RoleID
    };

    rolefuncservice.delRoleFunc(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "删除失败，服务器出错"
            })
            return;
        }
        if (results !== undefined && results.affectedRows != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                msg: "删除功能点成功"
            })
            return;
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: "删除功能点失败"
            })
            return;
        }
    })
})

module.exports = router;