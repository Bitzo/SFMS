/**
 * @Author: snail
 * @Date:   2016-12-03
 * @Last Modified by:
 * @Last Modified time:
 * 微信相关
 */

var sha1 = require('sha1'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    xml2js = require('xml2js');
var https = require('https');
var iconv = require("iconv-lite");

var config = appRequire('config/config');
var logger = appRequire('util/loghelper').helper;
var logService = appRequire('service/backend/log/logservice');
var logModel = appRequire('model/jinkebro/log/logmodel');
//日期组件
var moment = require('moment');
//redis缓存组件
var redisHelper = appRequire('util/redishelper');
var redisCache = new redisHelper();

// 微信类
var Weixin = function() {
    this.data = '';
    this.msgType = 'text';
    this.fromUserName = '';
    this.toUserName = '';
    this.funcFlag = 0;
}

/**
 * 与微信接口的统一入口（业务处理）
 */


/***********************************************************************************************************************/
/*待查*/
//监听用户是否要点击地址栏的菜单
// Weixin.prototype.clickAddress = function (callback) {
// =======
Weixin.prototype.handleWechatMsg = function(req, res) {
    this.res = res;

    var self = this,
        buf = '';

    // 获取XML内容
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        buf += chunk;
    });

    // 内容接收完毕
    req.on('end', function() {
        xml2js.parseString(buf, function(err, json) {
            if (err) {
                err.status = 400;
            } else {
                req.body = json;
            }
        });

        self.data = req.body.xml;
        self.parseWeChatCommand();
    });
}

/**
 * 处理微信发送过来的指令信息
 */
Weixin.prototype.parseWeChatCommand = function() {
        this.msgType = this.data.MsgType[0] ? this.data.MsgType[0] : "text";

        switch (this.msgType) {
            case 'text':
                this.parseTextMsg();
                break;
            case 'image':
                this.parseImageMsg();
                break;
            case 'voice':
                this.parseVoiceMsg();
                break;
            case 'location':
                this.parseLocationMsg();
                break;
            case 'link':
                this.parseLinkMsg();
                break;
            case 'event':
                this.parseEventMsg();
                break;
        }
    }
    // ------------------ 具体消息类型处理     开始------------------
    /*
     * 文本消息格式：
     * ToUserName 开发者微信号
     * FromUserName  发送方帐号（一个OpenID）
     * CreateTime  消息创建时间 （整型）
     * MsgType   text
     * Content   文本消息内容
     * MsgId   消息id，64位整型
     */
Weixin.prototype.parseTextMsg = function() {
    var msg = {
        "toUserName": this.data.ToUserName[0],
        "fromUserName": this.data.FromUserName[0],
        "createTime": this.data.CreateTime[0],
        "msgType": this.data.MsgType[0],
        "content": this.data.Content[0],
        "msgId": this.data.MsgId[0]
    }

    emitter.emit("weixinTextMsg", msg);

    return this;
}

/*
 * 图片消息格式：
 * ToUserName 开发者微信号
 * FromUserName  发送方帐号（一个OpenID）
 * CreateTime  消息创建时间 （整型）
 * MsgType   image
 * Content   图片链接
 * MsgId   消息id，64位整型
 */
Weixin.prototype.parseImageMsg = function() {
    var msg = {
        "toUserName": this.data.ToUserName[0],
        "fromUserName": this.data.FromUserName[0],
        "createTime": this.data.CreateTime[0],
        "msgType": this.data.MsgType[0],
        "picUrl": this.data.PicUrl[0],
        "msgId": this.data.MsgId[0],
        "MediaId": this.data.MediaId[0]
    }

    emitter.emit("weixinImageMsg", msg);

    return this;
}

/*
 * 事件消息格式：
 * ToUserName 开发者微信号
 * FromUserName  发送方帐号（一个OpenID）
 * CreateTime  消息创建时间 （整型）
 * MsgType   voice
 * MediaId 语音消息媒体id，可以调用多媒体文件下载接口拉取数据。
 * Format 语音格式，如amr，speex等
 * MsgID 消息id，64位整型
 */
Weixin.prototype.parseVoiceMsg = function() {
    var eventKey = '';
    if (this.data.EventKey) {
        eventKey = this.data.EventKey[0];
    }

    var msg = {
        "toUserName": this.data.ToUserName[0],
        "fromUserName": this.data.FromUserName[0],
        "createTime": this.data.CreateTime[0],
        "msgType": this.data.MsgType[0],
        "mediaId": this.data.MediaId[0],
        "format": this.data.Format[0],
        "msgId": this.data.MsgId[0]
    }

    emitter.emit("weixinVoiceMsg", msg);

    return this;
}

/*
 * 地理位置消息格式：
 * ToUserName 开发者微信号
 * FromUserName  发送方帐号（一个OpenID）
 * CreateTime  消息创建时间 （整型）
 * MsgType   location
 * Location_X  x
 * Location_Y    y
 * Scale　地图缩放大小
 * Label 位置信息
 * MsgId   消息id，64位整型
 */
Weixin.prototype.parseLocationMsg = function(data) {
    var msg = {
        "toUserName": this.data.ToUserName[0],
        "fromUserName": this.data.FromUserName[0],
        "createTime": this.data.CreateTime[0],
        "msgType": this.data.MsgType[0],
        "locationX": this.data.Location_X[0],
        "locationY": this.data.Location_Y[0],
        "scale": this.data.Scale[0],
        "label": this.data.Label[0],
        "msgId": this.data.MsgId[0]
    }

    emitter.emit("weixinLocationMsg", msg);

    return this;
}

/*
 * 链接消息格式：
 * ToUserName 开发者微信号
 * FromUserName  发送方帐号（一个OpenID）
 * CreateTime  消息创建时间 （整型）
 * MsgType   link
 * Title   消息标题
 * Description    消息描述
 * Url　消息链接
 * MsgId   消息id，64位整型
 */
Weixin.prototype.parseLinkMsg = function() {
    var msg = {
        "toUserName": this.data.ToUserName[0],
        "fromUserName": this.data.FromUserName[0],
        "createTime": this.data.CreateTime[0],
        "msgType": this.data.MsgType[0],
        "title": this.data.Title[0],
        "description": this.data.Description[0],
        "url": this.data.Url[0],
        "msgId": this.data.MsgId[0]
    }

    emitter.emit("weixinUrlMsg", msg);

    return this;
}

/*
 * 事件消息格式：
 * ToUserName 开发者微信号
 * FromUserName  发送方帐号（一个OpenID）
 * CreateTime  消息创建时间 （整型）
 * MsgType   event
 * Event 事件类型，subscribe(订阅)、unsubscribe(取消订阅)、CLICK(自定义菜单点击事件)
 * EventKey 事件KEY值，与自定义菜单接口中KEY值对应
 */
Weixin.prototype.parseEventMsg = function() {
        // var eventKey = '';
        // if (this.data.EventKey) {
        //     eventKey = this.data.EventKey[0];
        // }

        // var msg = {
        //     "toUserName": this.data.ToUserName[0],
        //     "fromUserName": this.data.FromUserName[0],
        //     "createTime": this.data.CreateTime[0],
        //     "msgType": this.data.MsgType[0],
        //     "event": this.data.Event[0],
        //     "eventKey": eventKey
        // }
        var msg = {};
        for (var key in this.data) {
            msg[key] = this.data[key][0];
        }
        emitter.emit("weixinEventMsg", msg);

        return this;
    }
    // ------------------ 具体消息类型处理     结束------------------

// ------------------ 注册监听事件  开始------------------------
// 监听文本消息
Weixin.prototype.textMsg = function(callback) {

    emitter.on("weixinTextMsg", callback);

    return this;
}

// 监听图片消息
Weixin.prototype.imageMsg = function(callback) {

    emitter.on("weixinImageMsg", callback);

    return this;
}

// 监听语音消息
Weixin.prototype.voiceMsg = function(callback) {

    emitter.on("weixinVoiceMsg", callback);

    return this;
}

// 监听地理位置消息
Weixin.prototype.locationMsg = function(callback) {

    emitter.on("weixinLocationMsg", callback);

    return this;
}

// 监听链接消息
Weixin.prototype.urlMsg = function(callback) {

    emitter.on("weixinUrlMsg", callback);

    return this;
}

// 监听事件
Weixin.prototype.eventMsg = function(callback) {

    emitter.on("weixinEventMsg", callback);

    return this;
}

//监听用户是否要点击地址栏的菜单
Weixin.prototype.clickAddress = function(callback) {

    emitter.on("wexinclickAddress", callback);

    return this;
}

// ------------------ 注册监听事件  结束------------------------


// -------------------消息返回            开始 -----------------
// 返回文字信息
Weixin.prototype.sendTextMsg = function(msg) {
    var time = Math.round(new Date().getTime() / 1000);
    // for (var key in msg) {
    //     console.log("[service/wechat/wechatservice:]" + "要发送的值" + key + " " + msg[key]);
    // }
    var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;

    var output = "" +
        "<xml>" +
        "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
        "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
        "<CreateTime>" + time + "</CreateTime>" +
        "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
        //这边之后要考虑微信这边的最大字符数限制
        "<Content><![CDATA[" + msg.content + "]]></Content>" +
        "<FuncFlag>" + funcFlag + "</FuncFlag>" +
        "</xml>";

    this.res.type('xml');
    this.res.status(200).send(output);

    return this;
}

// 返回音乐信息
Weixin.prototype.sendMusicMsg = function(msg) {
    var time = Math.round(new Date().getTime() / 1000);

    var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;

    var output = "" +
        "<xml>" +
        "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
        "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
        "<CreateTime>" + time + "</CreateTime>" +
        "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
        "<Music>" +
        "<Title><![CDATA[" + msg.title + "]]></Title>" +
        "<Description><![CDATA[" + msg.description + "DESCRIPTION]]></Description>" +
        "<MusicUrl><![CDATA[" + msg.musicUrl + "]]></MusicUrl>" +
        "<HQMusicUrl><![CDATA[" + msg.HQMusicUrl + "]]></HQMusicUrl>" +
        "</Music>" +
        "<FuncFlag>" + funcFlag + "</FuncFlag>" +
        "</xml>";

    this.res.type('xml');
    this.res.status(200).send(output);

    return this;
}

// 返回图文信息
Weixin.prototype.sendNewsMsg = function(msg) {
    var time = Math.round(new Date().getTime() / 1000);
    var articlesStr = "";

    for (var i = 0; i < msg.articles.length; i++) {
        articlesStr += "<item>" +
            "<Title><![CDATA[" + msg.articles[i].title + "]]></Title>" +
            "<Description><![CDATA[" + msg.articles[i].description + "]]></Description>" +
            "<PicUrl><![CDATA[" + msg.articles[i].picUrl + "]]></PicUrl>" +
            "<Url><![CDATA[" + msg.articles[i].url + "]]></Url>" +
            "</item>";
    }

    var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;
    var output = "" +
        "<xml>" +
        "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
        "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
        "<CreateTime>" + time + "</CreateTime>" +
        "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
        "<ArticleCount>" + msg.articles.length + "</ArticleCount>" +
        "<Articles>" + articlesStr + "</Articles>" +
        "<FuncFlag>" + funcFlag + "</FuncFlag>" +
        "</xml>";

    this.res.type('xml');
    this.res.status(200).send(output);

    return this;
}

//返回图片的消息
Weixin.prototype.sendimgMsg = function(msg) {
    var time = Math.round(new Date().getTime() / 1000);
    var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;
    var output = "" +
        "<xml>" +
        "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
        "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
        "<CreateTime>" + time + "</CreateTime>" +
        "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
        "<Image>" +
        "<MediaId><![CDATA[" + msg.MediaId + "]]></MediaId>" +
        "</Image>" +
        "<funcFlag><![CDATA[" + msg.funcFlag + "]]></funcFlag>" +
        "</xml>";

    this.res.type('xml');
    this.res.status(200).send(output);
    return this;
}

//待测
//当点击地址栏菜单的时候返回一个true值
Weixin.prototype.sendClickAddressEvent = function(msg) {

    var username = msg.FromUserName;
    var judgement = 'false';

    if (username != undefined && username.length != 0) {
        judgement = 'true';
    }

    emitter.emit("wexinclickAddress", judgement, username);

    return this;

}

// -------------------消息返回            结束 -----------------

// 发送信息
Weixin.prototype.sendMsg = function(msg) {
    switch (msg.msgType) {
        case 'text':
            this.sendTextMsg(msg);
            break;

        case 'music':
            this.sendMusicMsg(msg);
            break;

        case 'news':
            this.sendNewsMsg(msg);
            break;
        case 'image':
            this.sendimgMsg(msg);
    }
}

//以下的代码不应该放在该文件中，待优化 snail
// ------------------ 微信认证  开始------------------------
Weixin.prototype.checkSignature = function(req) {
        // 获取校验参数
        this.signature = req.query.signature;
        this.timestamp = req.query.timestamp;
        this.nonce = req.query.nonce;
        this.echostr = req.query.echostr;

        // 按照字典排序
        var array = [this.token, this.timestamp, this.nonce];
        array.sort();

        // 连接
        var str = sha1(array.join(""));

        // 对比签名
        if (str == this.signature) {
            return true;
        } else {
            return false;
        }
    }
    // ------------------ 微信认证  结束------------------------

// ------------------ 微信获取Token  开始-------------------
/*
 *获取access_token
 *先走redis缓存，如未获取到，再重新请求微信获取，并覆盖缓存
 */
Weixin.prototype.getLocalAccessToken = function(operatorid, callback) {
    var me = this;
    redisCache.get(config.weChat.rediskey, function(err, token) {
        if (err) {
            //记录异常
            logger.writeInfo('从redis获取微信token异常' + new Date());
        } else {
            if (token != 'null' && token != null) {
                callback(true, token);
            } else {
                logger.writeInfo('redis中没有微信的token，准备从微信重新获取' + new Date());

                //从微信重新请求获取数据
                me.getAccessToken(operatorid, function(wehcattoken) {
                    logger.writeInfo('从微信重新获取access_token' + new Date());
                    if (wehcattoken != undefined && wehcattoken.access_token !== undefined && wehcattoken.access_token !== null) {
                        logger.writeInfo('从微信重新获取access_token:' + wehcattoken);

                        //放到redis
                        redisCache.set(config.weChat.rediskey, wehcattoken.access_token, function(err, result) {
                            if (err) {
                                logger.writeError('redis插入键异常' + new Date());
                            }
                            logger.writeInfo('将access_token插入到redis成功');
                        });

                        redisCache.expire(config.weChat.rediskey, config.weChat.expiretime, function(err, result) {
                            if (err) {
                                logger.writeError('redis设置键过期异常' + new Date());
                            }
                            logger.writeInfo('将redis中access_token设置过期成功');
                            callback(true, wehcattoken);
                        });

                    } else {
                        callback(false, null);
                    }
                });
            }
        }
    });
};

//从微信获取access_token
Weixin.prototype.getAccessToken = function(operatorid, callback) {
    var accessurl = config.weChat.baseUrl + config.weChat.accessTokenUrl +
        'appid=' + config.weChat.appid +
        "&secret=" + config.weChat.secret;

    https.get(accessurl, function(res) {
        var datas = [];
        var size = 0;
        res.on('data', function(data) {
            datas.push(data);
            size += data.length;
        });

        res.on("end", function() {
            var buff = Buffer.concat(datas, size);
            var result = JSON.parse(iconv.decode(buff, "utf8")); //转码//var result = buff.toString();//不需要转编码,直接tostring  
            logModel.OperationName = '获取微信AccessToken';
            logModel.NewValue = result.access_token;
            logModel.Action = '微信操作_获取AccessToken';
            logModel.Memo = 'AccessToken获取成功';
            logModel.CreateUserID = operatorid;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('获取微信token成功，生成操作日志异常' + new Date());
                }
            });

            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });

    }).on('error', function(e) {
        logger.writeError('获取微信token时异常' + new Date());
    });
};

// ------------------ 微信获取Token  结束-------------------

// ------------------ 微信用户信息处理  开始-----------------

//微信获取用户的列表
Weixin.prototype.getCustomerList = function(accessToken, callback) {
    var getUrl = config.weChat.baseUrl + 'user/get?access_token=' + accessToken;
    console.log(getUrl);
    https.get(getUrl, function(res) {
        var datas = [];
        var size = 0;
        res.on('data', function(data) {
            datas.push(data);
            size += data.length;
        });

        res.on('end', function() {
            var buff = Buffer.concat(datas, size);
            var result = JSON.parse(iconv.decode(buff, "utf8")); //转码
            if (callback && typeof callback === 'function') {
                callback(result);
            }

        })
    }).on('error', function(e) {
        logger.writeError('获取列表信息时异常' + new Date());
    });
}

//微信获取到指定用户的的列表
Weixin.prototype.getNextOpenid = function(accessToken, nextopenid, callback) {
    var getUrl = config.weChat.baseUrl + config.weChat.getCustomerList + accessToken + "&nextopenid=" + nextopenid;
    // console.log(getUrl);
    https.get(getUrl, function(res) {
        var datas = [];
        var size = 0;
        res.on('data', function(data) {
            datas.push(data);
            size += data.length;
        });

        res.on('end', function() {
            var buff = Buffer.concat(datas, size);
            var result = JSON.parse(iconv.decode(buff, "utf8")); //转码
            console.log(result);

            if (callback && typeof callback === 'function') {
                callback(result);
            }

        })
    }).on('error', function(e) {
        logger.writeError('获取列表信息时异常' + new Date());
    });
}

//微信获取用户信息
Weixin.prototype.getCustomerInfo = function(accessToken, openid, callback) {
    //get获取微信端的接口的url
    var getUrl = config.weChat.baseUrl + config.weChat.userInfo + accessToken + "&openid=" + openid;
    //console.log(getUrl);
    https.get(getUrl, function(res) {
        var datas = [];
        var size = 0;
        res.on('data', function(data) {
            datas.push(data);
            size += data.length;
        });

        res.on('end', function() {
            var buff = Buffer.concat(datas, size);
            var result = JSON.parse(iconv.decode(buff, "utf8")); //转码
            if (callback && typeof callback === 'function') {
                callback(result);
            }

        })
    }).on('error', function(e) {
        logger.writeError('获取用户信息时异常' + new Date());
    });
}

// ------------------ 微信用户信息处理  结束-----------------

// ------------------ 微信创建自定义菜单  开始---------------

//微信创建菜单的方法
Weixin.prototype.createMenu = function (accessToken, menuData, callback) {
    //微信的创建菜单的url
    var postUrl = config.weChat.baseUrl + config.weChat.createMenu + accessToken; 
    var body = menuData;
   
    var bodyString = JSON.stringify(body);

    //头文件
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': bodyString.length
    };

    var options = {
        protocol: 'https:',
        host: config.weChat.host,
        port: '443',
        path: postUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(bodyString)
        }
    }

    var post_req = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
    });

    post_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    post_req.write(bodyString);
    post_req.end();
}

// ------------------ 微信创建自定义菜单  结束---------------

module.exports = new Weixin();