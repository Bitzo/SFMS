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

    var data = ['RoleID', 'FunctionID'];
    var err = 'required: ';

    for(var value in data)
    {
        if((!(data[value] in req.body.data[0]))&&(!(data[value] in req.body)))
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

    var roleID = req.body.RoleID;
    var funcID = req.body.data;

    var data = {
        'RoleID': roleID,
        'FunctionID': funcID
    }

    rolefuncservice.addRoleFunc(data, function (err, results) {
        console.log(results);
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
});

//角色功能点修改
router.put('/',function (req, res) {
    var data = ['RoleID', 'FunctionID'];
    var err = 'required: ';
    for(var value in data)
    {
        if((!(data[value] in req.body.data[0]))&&(!(data[value] in req.body)))
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

    var roleID = req.body.RoleID;
    var functionData = req.body.data;

    var data = {
        'RoleID': roleID,
        'data': functionData
    };

    rolefuncservice.updateRoleFunc(data, function (err, results) {
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