/**
 *配置文件
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
    isdevelop: 1, //1表示是开发环境0:表示非开发环境
    secretsalt: 'what1r2u3nong7sha5lei4', //盐值
    redis_host: '127.0.0.1', // redis 配置，默认是本地
    redis_port: 6379,
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
        secret:'e668e2f31c16fac4528be7f82692085d',
        baseUrl:'https://api.weixin.qq.com/cgi-bin/',
        accessTokenUrl:'token?grant_type=client_credential&',
    }
};

module.exports = config;