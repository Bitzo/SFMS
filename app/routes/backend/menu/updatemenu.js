/**
 * @Author: Cecurio
 * @Date: 2016/11/15 14:38
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/15 14:38
 * @Function:
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');

router.post('/',function (req,res) {
    var menuID = req.body.MenuID;
    var applicationID = req.body.ApplicationID;
    var menuLevel = req.body.MenuLevel;
    var parentID = req.body.ParentID;
    var menuName = req.body.MenuName;
    var memo = req.body.Memo;
    var isActive = req.body.IsActive;
    var data = {
        "MenuID" : menuID,
        "ApplicationID" : applicationID,
        "MenuLevel" : menuLevel,
        "ParentID" : parentID,
        "MenuName" : menuName,
        "Memo" : memo,
        "IsActive" : isActive
    };

    // 修改MenuID之前，先判断是否存在这个MenuID,MenuID不可以更改
    var JudgeData = {
        "MenuID" : menuID
    }

    menuService.queryAllMenus(JudgeData,function (err,results) {
        if(err){
            res.json({
                code : 500,
                isSuccess : false,
                msg : '查询失败，服务器出错'
            });
            return ;
        }
        // 所要修改的菜单存在
        if(results !== undefined && results.length !== 0){
            menuService.menuUpdate(data,function (err,results) {
                if(err){
                    res.json({
                        code :500,
                        isSuccess : false,
                        msg : '修改菜单失败'
                    });
                }

                //console.log(results);

                if(results !== undefined && results.affectedRows === 1){
                    res.json({
                        code : 200,
                        isSuccess : true,
                        msg : '菜单修改成功'
                    });
                }
            });
        }else{
            // 所要修改的菜单不存在
            res.json({
                code :404,
                isSuccess : false,
                msg : '所要修改的菜单不存在'
            });
        }
    });

});


module.exports = router;
