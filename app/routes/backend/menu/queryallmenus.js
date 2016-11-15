/**
 * @Author: Cecurio
 * @Date: 2016/11/15 11:49
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/15 11:49
 * @Function:
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');

router.post('/',function (req,res) {
    // req.body是一个JSON对象
    // var obj = req.body;
    // for(var i in obj){   //遍历post请求提交的request表单
    //     console.log(i);
    //     console.log(obj[i]);
    // }
    var menuID = req.body.MenuID;

    var data = {
        "MenuID" : menuID
    };


    // 如果没有查询条件，那就查询出所有
    if(menuID === undefined){
        data = {

        };
    }
    menuService.queryAllMenus(data,function (err,results) {
        if(err){
            res.json({
               code : 500,
                isSuccess : false,
                msg : '查询所有菜单失败'
            });
            return ;
        }

        res.json({
            code : 200,
            isSuccess : true,
            data : {
                Menu : results
            },
            msg : '读取所有菜单成功！'
        });
    });


});

module.exports = router;