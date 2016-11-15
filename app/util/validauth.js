/**
 * @Author: snail
 * @Date:   2016-11-14 22:00:00
 * @Last Modified by:
 * @Last Modified time:
 * @Function:接口鉴权
 */

var jwt = require('jwt-simple');
var config = appRequire('config/config');
var userService = appRequire('service/backend/user/userservice');

module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.jitkey) || (req.query && req.query.jitkey) || req.headers['jitkey'];

    if (token || key) {
        try {
            var decoded = jwt.decode(token, config.jwt_secret);

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }
            console.log('key:' + key);
            var data = {
                'AccountID': key
            };
             
            console.log('验证用户信息')

                //验证登录用户
            userService.queryAllUsers(data, function(err, user) {
                if (err) {
                    res.status(500);
                    res.json({
                        "status": 500,
                        "message": "应用程序异常!",
                        "error": err
                    });
                    return;
                }

                if (user!=undefined&&user.AccountID>0) {
                    if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
                        next(); // To move to next middleware
                    } else {
                        res.status(403);
                        res.json({
                            "status": 403,
                            "message": "Not Authorized"
                        });
                        return;
                    }
                } else {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                    return;
                }
            });
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
            "message": "Invalid Token or Key"
        });
        return;
    }
};