/**
 * @Author: Cecurio
 * @Date: 2016/11/17 19:38
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/17 19:38
 * @Function:根据UserID查看用户拥有的菜单、菜单和角色
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');


router.get('/',function (req,res) {
    //接收前台数据
    //数据库中的userID就是AccountID
    var userID = req.query.userID;

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

    menuService.queryMenuByUserID(uniqueData,function (err,results) {
        if(err){
            res.json({
                code : 500,
                isSuccess :false,
                msg : '服务器出错'
            });
            return;
        }
        if(results !== undefined && results.length !== 0){
            res.json({
                code : 200,
                isSuccess :true,
                data : {
                    Menu : results
                },
                msg : '查询菜单成功'
            });
        }else {
            res.json({
                code : 404,
                isSuccess : false,
                msg : '查询菜单失败'
            });
        }
    });



});

router.get('/menuandrole',function (req,res) {
    var userID = req.query.userID;

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