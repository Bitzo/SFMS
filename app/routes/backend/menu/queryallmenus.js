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

//获得树形Menu结构
router.get('/',function (req,res) {
    // res.json({ti : '获得树形Menu结构'});
    var data = {};
    menuService.queryAllMenusFormTree(data,function (err,results) {
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
})

router.post('/nolimit',function (req,res) {

    //没有查询条件，那就查询出所有

    data = {

    };

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

router.post('/bymenuid',function (req,res) {

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

router.post('/bymenulevel',function (req,res) {

    var MenuLevel = req.body.MenuLevel;

    var data = {
        "MenuLevel" : MenuLevel
    };


    // 如果没有查询条件，那就查询出所有
    if(MenuLevel === undefined){
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

router.post('/byparentid',function (req,res) {

    var ParentID = req.body.ParentID;

    var data = {
        "ParentID" : ParentID
    };


    // 如果没有查询条件，那就查询出所有
    if(ParentID === undefined){
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