/**
 * @Author: Cecurio
 * @Date: 2016/11/15 11:49
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/15 11:49
 * @Function:查询菜单
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');

//获得树形Menu结构
router.get('/',function (req,res) {

    var userID = req.query.userID;
    if (userID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require userID'
        })
        return;
    }

    var data = {
        "userID":userID
    };
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

router.get('/nolimit',function (req,res) {

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

router.get('/:bymenuid',function (req,res) {

    var menuID = req.query.MenuID;

    if (menuID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require menuID'
        })
        return;
    }

    var data = {
        "MenuID" : menuID
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

router.get('/:bymenulevel',function (req,res) {

    var menuLevel = req.query.MenuLevel;

    if (menuLevel === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require MenuLevel'
        })
        return;
    }

    var data = {
        "MenuLevel" : menuLevel
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

router.get('/:byparentid',function (req,res) {

    var parentID = req.query.ParentID;

    if (parentID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require ParentID'
        })
        return;
    }

    var data = {
        "ParentID" : ParentID
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

module.exports = router;