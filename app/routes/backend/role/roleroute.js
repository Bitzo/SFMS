/**
 * @Author: bitzo
 * @Date: 2016/11/13 19:04
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 19:04
 * @Function: 角色查询模块路由
 */

var express = require('express');
var router = express.Router();

var roleservice = appRequire('service/backend/role/roleservice');

//查询角色信息
router.get('/',function (req, res) {
    var appID = req.query.appID;
    var page = req.query.page || 1;

    var roleName = req.query.RoleName;
    var isActive = req.query.IsActive;

    var data = {
        'appID': appID,
        'page': page,
        'RoleName': roleName,
        'IsActive': isActive
    };

    //用于查询结果总数的计数
    var countNum = 0;

    //查询所有数据总数
    roleservice.countAllRoles(data, function (err, results) {
        if (err) {
            countNum = -1;
            return;
        }
        if (results !==undefined && results.length != 0) {
            countNum = results[0]['num'];
        } else {
            countNum = -1;
            return;
        }
    });

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
                totlePage: Math.ceil(countNum/10),
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

    var ApplicationID = req.body.ApplicationID;
    var RoleCode = req.body.RoleCode;
    var RoleName = req.body.RoleName;
    var IsActive = req.body.IsActive;

    var data = {
        'ApplicationID': ApplicationID,
        'RoleCode': RoleCode,
        'RoleName': RoleName,
        'IsActive': IsActive
    }

    roleservice.addRole(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "添加失败，服务器出错"
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                data: data,
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

});

module.exports = router;