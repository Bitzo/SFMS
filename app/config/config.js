/**
 *配置文件
 */
var path = require('path');
var config = {
    app_name: 'JinkeBro',
    app_description: '金科小哥项目',
    app_keywords: 'JinkeBro',
    app_version: '0.1.0',
    cookieSecret: 'snail',
    cookiekey: 'cookiename',
    wechat_token: 'snail',
    isdevelop: 1, //1表示是开发环境0:表示非开发环境
    secretsalt: 'what1r2u3nong7sha5lei4', //盐值
    redis_host: '127.0.0.1', // redis 配置，默认是本地
    redis_port: 6379,
    port: 3000, // 程序运行的端口
    host: '127.0.0.1',
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'jinkebro',
        connectionLimit: 100,
        supportBigNumbers: true,
    },
    // 邮箱配置
    mail_opts: {
        host: '',
        port: 25,
        auth: {
            user: '',
            pass: ''
        }
    }
};

module.exports = config;