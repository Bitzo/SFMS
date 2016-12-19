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
//微信接收消息通用组件
var wechat = appRequire("service/wechat/wechatservice");
wechat.token = config.weChat.token;

//从微信端获取数据插入数据库
var wechatCustomer = appRequire("service/jinkebro/customer/customerservice");
//微信开发者认证
router.get('/accesscheck', function(req, res, next) {
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
wechat.textMsg(function(msg) {
    var resMsg = {};
    switch (msg.msgType) {
        case "text":
            // 返回文本消息
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "text",
                content: "这是文本回复" + new Date(),
                funcFlag: 0
            };
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
wechat.imageMsg(function(msg) {
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
wechat.voiceMsg(function(msg) {
    console.log("voiceMsg received");
    console.log(JSON.stringify(msg));
});

// 监听位置消息
wechat.locationMsg(function(msg) {
    console.log("locationMsg received");
    console.log(JSON.stringify(msg));
});

// 监听链接消息
wechat.urlMsg(function(msg) {
    console.log("urlMsg received");
    console.log(JSON.stringify(msg));
});

// 监听事件消息
wechat.eventMsg(function(msg) {
    console.log("eventMsg received");
    console.log(msg);
    //判断是否是订阅以及取消的判断条件
    if(msg.Event == "subscribe" ||msg.Event == "unsubscribe")
    {
        console.log("关注成功");
        //获取token
        wechat.getLocalAccessToken(operateconfig.weChat.infoManage.access_tokenGet.identifier,function(isSussess,token)
        {
            if(isSussess)
            {
                // console.log(msg.fromUserName);
                //获取用户的信息
                wechat.getCustomerInfo(token,msg.FromUserName,function(info)
                {
                    console.log(info);
                    var data = {
                        'WechatUserCode':info.openid
                    };

                    if(info.subscribe == 1)//关注的人
                    {
                        //获取用户的信息
                        data.Sex=info.sex;
                        data.NickName=info.nickname;
                        data.IsActive = 1;
                        if(info.city.length !=0)
                        {
                            data.City = info.city;
                        }                      
                        if(info.province.length !=0)
                        {
                            data.Province = info.province; 
                        }
                        if(info.country.length !=0)
                        {
                            data.Country=info.country;
                        }
                        if(info.remark.length !=0)
                        {
                            data.Memo = info.remark;
                        }

                         //根据WechatUserCode来查询是否存在这个用户
                         var queryInfo = {
                            'WechatUserCode':info.openid
                        };
                        console.log(queryInfo);
                         //开始查询是否存在用户
                         wechatCustomer.query(queryInfo,function(err,resultInfo)
                         {
                            if(err)
                            {
                                console.log("查询失败");
                                return ;
                            }
                            if(resultInfo != undefined && resultInfo.length != 0)
                            {
                                console.log("用户名已经存在");
                                //当用户名存在做更新操作
                                wechatCustomer.update(data,function(err,updataInfo)
                                {
                                    if(err)
                                    {
                                        console.log("更新失败");
                                        return;
                                    }
                                    if(updataInfo != undefined &&updataInfo.affectedRows !=0)
                                    {
                                        console.log("更新成功");
                                        return;
                                    }
                                });
                            }
                            else
                            {
                                //用户名不存在的时候做插入的操作
                                wechatCustomer.insert(data,function(err,insertInfo)
                                {
                                   if(err)
                                   {
                                    console.log("插入失败");
                                    return;
                                }
                                if(insertInfo != undefined &&insertInfo.affectedRows !=0)
                                {
                                    console.log("插入成功");
                                    return;
                                }
                            });
                            }
                        });

}
                    else//取消关注的人
                    {
                        data.IsActive = 0;
                        wechatCustomer.update(data,function(err,updataInfo)
                        {
                            if(err)
                            {
                                console.log("更新失败");
                                return;
                            }
                            if(updataInfo != undefined &&updataInfo.affectedRows !=0)
                            {
                                console.log("更新成功");
                                return;
                            }
                        });
                    }
                });
}
});
}
if(msg.Event == "LOCATION")
{
        //获取地址事件者的openid
        var locationData = {
            'WechatUserCode':msg.FromUserName,
            'Lon':msg.Longitude,
            'Lat':msg.Latitude
        }
        wechatCustomer.update(locationData,function(err,updataInfo)
        {
            if(err)
            {
                console.log("更新失败");
                return;
            }
            if(updataInfo != undefined &&updataInfo.affectedRows !=0)
            {
                console.log("更新成功");
                return;
            }
        });
        console.log("获取地址成功");

    }
});


//接受用户的消息
router.post('/accesscheck', function(req, res) {
    wechat.handleCustomerMsg(req, res);
});

module.exports = router;