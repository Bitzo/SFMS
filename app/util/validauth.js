/**
 * @Author: snail
 * @Date:   2016-11-14 22:00:00
 * @Last Modified by:
 * @Last Modified time:
 * @Function:接口鉴权
 */

var jwt = require('jwt-simple');
var config = appRequire('config/config');
var logger = appRequire('util/loghelper').helper;

module.exports = function(req, res, next) {
    if (req.url === '/' || req.url === '/login' || req.url === '/generatecode?r='+req.query.r || req.url === '/api/v1/login' || req.url.indexOf('/wechat') >= 0||req.url=="/index"||req.url.indexOf('jinkeBro') >= 0 ) {
        next();
    } else {
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        var key = (req.body && req.body.jitkey) || (req.query && req.query.jitkey) || req.headers['jitkey'];

        if (token || key) {
            try {
                if (token == undefined || token.split('.').length !== 3) {
                    res.status(400);
                    return res.json({
                        "status": 400,
                        "message": "token不合法!",
                    });
                }

                var decoded = jwt.decode(token, config.jwt_secret);
                if (decoded.exp <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "Token过期!"
                    });
                    return;
                } else {
                    next();
                }
            } catch (err) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "应用程序异常!",
                    "error": err
                });
            }
        } else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "未提供鉴权Token!"
            });
            return;
        }
    }
};