/**
* @Author: snail
* @Date:   2016-12-03
* @Last Modified by:
* @Last Modified time:
* 微信相关的操作
*/

var express = require('express');
var router = express.Router();
var url = require("url");
var crypto = require("crypto");
var operateconfig = appRequire("config/operationconfig");
var config = appRequire("config/config");
var logger = appRequire('util/loghelper').helper;
//用来插入到log中的
var logService = appRequire('service/backend/log/logservice');
var logModel = appRequire('model/jinkebro/log/logmodel');
var config = appRequire('config/config');
//微信接收消息通用组件
var customerhtml = appRequire('views/jinkeBro/wechat/readfilecustomer');
//微信的地址栏
var wechat = appRequire("service/wechat/wechatservice");
wechat.token = config.weChat.token;

//从微信端获取数据插入数据库
var wechatCustomer = appRequire("service/jinkebro/customer/customerservice");

//调用商品的模块的内容
var product = appRequire('service/jinkebro/product/productservice'),
    order = appRequire('service/jinkebro/order/orderservice');

//微信开发者认证
router.get('/accesscheck', function (req, res, next) {
    var query = url.parse(req.url, true).query;


    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;

    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = 'snail';
    oriArray.sort();

    var original = oriArray.join('');
    var md5sum = crypto.createHash("sha1");
    md5sum.update(original);

    var scyptoString = md5sum.digest("hex");
    if (signature == scyptoString) {
        res.end(echostr);
    } else {
        res.end("false");
    }
});

// 监听文本消息
wechat.textMsg(function (msg) {
    var resMsg = {};
    console.log(msg);
    switch (msg.msgType) {
        case "text":
            // 返回文本消息           
            if (/^(\d+#\d+)$/.test(msg.content) ||
                /^((\d+#\d+\|)+(\d+#\d+))$/.test(msg.content)) {
                console.log("收到订单的消息");
                resMsg = {
                    fromUserName: msg.toUserName,
                    toUserName: msg.fromUserName,
                    msgType: "text",
                    content: "收到订单" + new Date(),
                    funcFlag: 0
                };
            }
            else {
                resMsg = {
                    fromUserName: msg.toUserName,
                    toUserName: msg.fromUserName,
                    msgType: "text",
                    content: "这是文本回复" + new Date(),
                    funcFlag: 0
                };
            }
            break;

        case "音乐":
            // 返回音乐消息
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "music",
                title: "音乐标题",
                description: "音乐描述",
                musicUrl: "音乐url",
                HQMusicUrl: "高质量音乐url",
                funcFlag: 0
            };
            break;

        case "图文":
            // 返回图文消息
            var articles = [];
            articles[0] = {
                title: "测试",
                description: "测试描述",
                picUrl: "http://www.baidu.com",
                url: "http://www.baidu.com"
            };

            // 返回图文消息
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "news",
                articles: articles,
                funcFlag: 0
            }
    }
    wechat.sendMsg(resMsg);

    //测试获取token
    
});

// 监听图片消息
wechat.imageMsg(function (msg) {
    console.log("imageMsg received");
    console.log(JSON.stringify(msg));
    var resMsg = {};
    switch (msg.msgType) {
        case 'image':

            //返回的图片数据
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "image",
                MediaId: msg.MediaId,
                funcFlag: 1
            }
            break;
    }
    wechat.sendMsg(resMsg);
});

// 监听语音消息
wechat.voiceMsg(function (msg) {
    console.log("voiceMsg received");
    console.log(JSON.stringify(msg));
});

// 监听位置消息
wechat.locationMsg(function (msg) {
    console.log("locationMsg received");
    console.log(JSON.stringify(msg));
});

// 监听链接消息
wechat.urlMsg(function (msg) {
    console.log("urlMsg received");
    console.log(JSON.stringify(msg));
});

// 监听事件消息
wechat.eventMsg(function (msg) {
    console.log("eventMsg received");
    console.log(msg);
    //判断是否是订阅以及取消的判断条件
    switch (msg.Event) {
        //订阅的事件
        case 'subscribe':
            //获取token
            wechat.getLocalAccessToken(operateconfig.weChat.infoManage.access_tokenGet.identifier, function (isSussess, token) {
                //如果成功  
                if (isSussess) {

                    // wechat.createMenu(token, function () {
                    //     console.log("创建菜单");
                    // });
                    //用户订阅时的操作
                    wechatCustomer.addSubscibe(token, msg, function (err, errinfo) {

                        if (err) {
                            console.log(errinfo);
                            return;
                        }

                        console.log("成功");
                    })

                }
            });

            break;
        
        //取消订阅
        case 'unsubscribe':
            wechat.getLocalAccessToken(operateconfig.weChat.infoManage.access_tokenGet.identifier, function (isSussess, token) {
                if (isSussess) {
                    //当服务器出错的时候的补过
                    wechatCustomer.addAllList(token, function (err, errinfo) {
                        if (err) {
                            console.log(errinfo);
                            return;
                        }

                        console.log("由服务器导致的错误，添加成功");
                        return;
                    });
                }
            });
            //获取token
            wechat.getLocalAccessToken(operateconfig.weChat.infoManage.access_tokenGet.identifier, function (isSussess, token) {
                //如果成功  
                
                if (isSussess) {              
                    //取消时更改用户
                    wechatCustomer.unsubscribe(token, msg, function (err, errinfo) {
                        if (err) {
                            console.log(errinfo);
                            return;
                        }

                        console.log("取消成功");
                    });
                }
            });

            break;

        //发送地址
        case 'LOCATION':

            //添加地址坐标到数据库
            wechatCustomer.addLocation(msg, function (err, errinfo) {
                if (err) {
                    console.log(errinfo);
                    return;
                }
                console.log("获取地址成功");
            });

            break;

        //扫码的事件
        case 'SCAN':
            break;

        //菜单点击的事件
        case 'CLICK':
            switch (msg.EventKey) {
                case 'ProductDisplay':
                    product.getProductInfoThroughHttpGet(function (productInfo) {
                        var contentInfo = '';
                        for (var index in productInfo.data) {
                            console.log("商品的序列" + index);
                            for (var key in productInfo.data[index]) {
                                if (key == 'ProductID') {
                                    contentInfo += "编号:" + productInfo.data[index][key] + "  ";
                                }

                                if (key == 'ProductName') {
                                    contentInfo += "名称:" + productInfo.data[index][key] + "  ";
                                }

                                if (key == 'ProductPrice') {
                                    contentInfo += "价格:" + productInfo.data[index][key] + "  ";
                                }

                                if (key == 'ProductTypeName') {
                                    contentInfo += "规格:" + productInfo.data[index][key] + "  ";
                                }
                            }
                            contentInfo += "\n";
                        }
                        console.log(contentInfo);
                        var resMsg = {
                            fromUserName: msg.ToUserName,
                            toUserName: msg.FromUserName,
                            msgType: "text",
                            content: contentInfo,
                            funcFlag: 0
                        };
                        wechat.sendMsg(resMsg);
                    });

                    break;

                case 'SubmitOrder':
                    console.log("提交订单");
                    break;
            }
            break;

        //菜单的链接的事件
        case 'VIEW':
            switch (msg.EventKey) {
                case 'http://sun.tunnel.2bdata.com/wechat/addressinfo':
                    wechat.sendClickAddressEvent(msg);
                    break;
                case 'http://www.baidu.com':
                    console.log("点击了百度的页面");
                    break;

            }

            break;

    }

});

//监听地址的事件
wechat.clickAddress(function (judgement, username) {
    console.log(username);
    if (judgement != undefined && judgement == 'true') {
        var tempRoute = '/' + username;
        console.log(tempRoute)
        router.get(tempRoute, function (req, res) {
            customerhtml(res);
        });
        return;
    }

});

/************************************************************************************/
//渲染地址栏的页面
router.get('/addressinfo', function (req, res) {

    var addressurl = config.jinkebro.baseUrl + 'wechat/' + wechat.data.FromUserName;
    console.log(addressurl);
    //路由的重定义
    res.redirect(301, addressurl);
   
});

/************************************************************************************/

//接受用户的消息
router.post('/accesscheck', function (req, res) {
    wechat.handleCustomerMsg(req, res);
});

module.exports = router;