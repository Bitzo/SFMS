/**
 * @Author: bitzo
 * @Date: 2017/1/18 22:55
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/18 22:55
 * @Function: 用户功能的鉴定
 */

var express = require('express');
var router = express.Router();
var config = appRequire('config/config');
//引入角色服务、角色功能点服务、功能点服务
var roleService = appRequire('service/backend/role/roleservice');
var userfuncService = appRequire('service/backend/user/userfuncservice');
var userRoleService = appRequire('service/backend/user/userroleservice');
var functionService = appRequire('service/backend/function/functionservice');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

/**
 * 输入：FunctionCode AccountID
 * 输出：true/false
 * 逻辑：: 找到AccountID对应的RoleID，RoleID具有的所有功能点FunctionCode
 *        考虑用户有多个角色判断获取的功能点中有没有包含传入的FunctionCode
 *        存在就返回true，否则返回false
 */

router.get('/', function (req, res) {
    var accountID = req.query.accountID,
        functionCode = req.query.functionCode;

    if (accountID === undefined || isNaN(accountID)) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '用户ID有误！'
        });
    }

    if (functionCode === undefined || functionCode.trim() == '') {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '功能点代码有误！'
        })
    }

    functionCode = functionCode.trim();

    userRoleService.query({AccountID: accountID}, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器出错！'
            })
        }
        if (results!==undefined && results.length>0) {
            var roleID = [];
            for (var i in results) {
                roleID[i] = results[i].RoleID;
            }
            userfuncService.queryUserFunc({RoleID:roleID}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错！'
                    })
                }
                if (results!==undefined && results.length > 0) {
                    for (var i in results) {
                        if (functionCode === results[i].FunctionCode) {
                            res.status(200);
                            return res.json({
                                code: 200,
                                isSuccess: true,
                                msg: '权限正确'
                            })
                        }
                    }
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: false,
                        msg: '无权限'
                    })
                } else {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: false,
                        msg: '无权限'
                    })
                }

            })
        } else {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: false,
                msg: '无权限'
            })
        }
    })
})

module.exports = router;