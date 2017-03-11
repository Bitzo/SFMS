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
                functionCode: functionConfig.jinkeBroApp.menu.menuAdd.functionCode
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
                var menuData = req.body.formdata.body;
                wechat.getLocalAccessToken(operateconfig.weChat.infoManage.access_tokenGet.identifier,
                        function (isSuccess, token) {				 
                                //如果成功
                                if (!isSuccess) {
                                        res.json({
                                                code: 200,
                                                isSuccess: true,
                                                msg: "微信获取token出错"
                                        })
                                }

                                if (isSuccess) {
                                        console.log("获取token成功");
                                        try {
                                                var data = JSON.parse(menuData);
                                        } catch (error) {

                                                return res.json({
                                                        code: 200,
                                                        isSuccess: true,
                                                        msg: "请输入正确的json格式"
                                                });
                                        }

                                        wechat.createMenu(token, data, function (result) {
                                                var response = JSON.parse(result);
                                                console.log("errcode:" + response.errcode);
                                                if (response.errcode == 0) {
                                                        return res.json({
                                                                code: 200,
                                                                isSuccess: false,
                                                                msg: "微信创建菜单成功"
                                                        })
                                                } else {
                                                        return res.json({
                                                                code: 200,
                                                                isSuccess: true,
                                                                msg: "创建失败，返回错误码：" + response.errcode + ",请查看api文档"
                                                        });
                                                }
                                                return;
                                        });
                                }
                        });

        });

});

module.exports = router;