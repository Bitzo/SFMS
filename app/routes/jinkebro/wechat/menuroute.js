/**
 * @Author： Duncan
 * @Date: 2017-3-5
 * @Last Modified by:
 * @Last Modified time:
 * 在系统中创建一个微信端的菜单测试
 */
var express = require('express');
var router = express.Router();
var url = require("url");
var crypto = require("crypto");
var operateconfig = appRequire("config/operationconfig");
var logger = appRequire('util/loghelper').helper;
//用来插入到log中的
var logService = appRequire('service/backend/log/logservice'),
        logModel = appRequire('model/jinkebro/log/logmodel'),
        config = appRequire('config/config'),
        userFuncService = appRequire('service/backend/user/userfuncservice'),
        functionConfig = appRequire('config/functionconfig'),
        wechat = appRequire("service/wechat/wechatservice");

wechat.token = config.weChat.token;

router.post('/', function (req, res) {
        var checkFuncData = {
                userID: req.query.jitkey,
                functionCode: functionConfig.jinkeBroApp.menuAdd.functionCode
        };

        userFuncService.checkUserFunc(checkFuncData, function (err, funcResult) {
                if (err) {
                        res.status(500);
                        return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "服务器内部错误！"
                        });
                }

                if (!(funcResult != undefined && funcResult.isSuccess)) {
                        res.status(400);
                        return res.json({
                                code: 400,
                                isSuccess: false,
                                msg: funcResult.msg
                        });
                }

                /**
                 * 其他部分已经做好  要写对数据的处理 部分
                 * 通过前端来传，postman 测试的格式不正确
                 */
                var menuData = req.body.Menu;
                console.log(req.body);
                wechat.getLocalAccessToken(operateconfig.weChat.infoManage.access_tokenGet.identifier,
                        function (isSuccess, token) {				 
                                //如果成功
                                if (isSuccess) {
                                        console.log("获取token成功");
                                        wechat.createMenu(token, menuData, function (result) {

                                                console.log("errcode:" + result.errcode);
                                                return;
                                        });
                                } else {
                                        console.log("获取微信端的token失败");
                                }
                        });

        });

});

module.exports = router;