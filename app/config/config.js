/**
 * @Author: snail
 * @Date: 2016-12-13
 * @Last Modified by:
 * @Last Modified time:
 * @Function:配置
 */
var path = require('path');
var config = {
    app_name: 'JinkeBro',
    app_description: 'JIT1320管理集成平台',
    app_keywords: 'JinkeBro',
    app_version: '0.1.0',
    cookieSecret: 'snail',
    cookiekey: 'cookiename',
    wechat_token: 'snail',
    jwt_secret: 'j1i3t20', //jwt
    isdev: false, //true:开发环境 false:生产环境
    secretsalt: 'what1r2u3nong7sha5lei4', //盐值
    port: 80, // 程序运行的端口
    host: '127.0.0.1',
    mysql: {
        host: '139.224.51.160',
        user: 'jinkebro_common_user',
        password: 'jinkebrocommon1320',
        database: 'jit_backend',
        
        connectionLimit: 100,
        supportBigNumbers: true,
    },
    pageCount: 20, //分页时每一页要显示的数据量
    // 邮箱配置
    mail_opts: {
        host: '',
        port: 25,
        auth: {
            user: '',
            pass: ''
        }
    },
    //微信相关
    weChat: {
        token: 'snail',
        appid: 'wx844d9a89f533f63d',
        rediskey: 'jit_jkbro_wechat_token',
        expiretime: 7200,
        secret: 'e668e2f31c16fac4528be7f82692085d',
        host: 'api.weixin.qq.com',
        baseUrl: 'https://api.weixin.qq.com/cgi-bin/',
        accessTokenUrl: 'token?grant_type=client_credential&', //获取token
        createMenu: 'menu/create?access_token=', //创建菜单
        userInfo: 'user/info?access_token=',//获取用户信息
        autoreplyInfo: 'get_current_autoreply_info?access_token='//获取公众号自动回复的信息

    },
    //金科小哥相关的
    jinkebro: {
        host: 'jit.upsnail.com',
        baseUrl: 'http://jit.upsnail.com/',
        //host: 'http://d64a5cce.ngrok.io',
        //baseUrl: 'http://sun.tunnel.2bdata.com/',
        productInfo: 'jinkeBro/product/info',
        order: 'jinkeBro/order',
        productstock: 'jinkeBro/proStock'
    },
    redis_prd: {
        host: '47.93.91.197',
        port: '6379',
        password: 'jit1320go'
    },
    redis_local: {
        host: '127.0.0.1',
        port: '6379',
    }
};

module.exports = config;