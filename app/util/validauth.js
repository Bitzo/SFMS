/**
 * @Author: snail
 * @Date:   2016-11-14 22:00:00
 * @Last Modified by:
 * @Last Modified time:
 * @Function:接口鉴权
 */

var jwt = require('jwt-simple');
var config = appRequire('config/config');

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
            "message": "Invalid Token or Key"
        });
        return;
    }
};