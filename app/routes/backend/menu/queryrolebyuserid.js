/**
 * @Author: Cecurio
 * @Date: 2016/11/17 20:15
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/17 20:15
 * @Function:
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');


router.post('/',function (req,res) {
    //接收前台数据
    //数据库中的userID就是AccountID
    var userID = req.body.userID;
    var uniqueData = {
        "userID" : userID
    };

    //判断userID是否存在
    // .....
    menuService.queryRoleByUserID(uniqueData,function (err,results) {
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
        }
    })

});

module.exports = router;