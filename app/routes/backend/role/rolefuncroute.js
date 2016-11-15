/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:39
 * @Function: 角色对应功能点查询
 */

var express = require('express');
var router = express.Router();

var rolefuncservice = appRequire('service/backend/role/rolefuncservice');

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

module.exports = router;