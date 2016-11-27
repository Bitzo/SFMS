/**
 * @Author: Cecurio
 * @Date: 2016/11/26 22:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/26 22:23
 * @Function:
 */

var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');
var userService = appRequire('service/backend/user/userservice');
//根据UserID获取用户的菜单和角色信息
router.get('/:userID',function (req,res) {
    var userID = req.params.userID;

    if (userID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require userID'
        })
        return;
    }

    var uniqueData = {
        "userID" : userID
    };

    menuService.queryMenuAndRoleByUserID(uniqueData,function (err, results) {
        if(err){
            res.json({
                code : 500,
                isSuccess :false,
                msg : '服务器出错'
            });
            return;
        }

        res.json({
            code : 200,
            isSuccess :true,
            data : {
                MenuAndRole : results
            },
            msg : '查询菜单和角色成功'
        });

    });
});


module.exports = router;