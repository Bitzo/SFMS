/**
 * @Author: snail
 * @Date:   2016-11-14 22:00:00
 * @Last Modified by:
 * @Last Modified time:
 * @Function:接口鉴权
 */
var jwt = require('jwt-simple');
var config = appRequire('config/config');

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

exports.genToken = function(user) {
    var expires = expiresIn(1); //3天后token过期
    var token = jwt.encode({
        exp: expires
    }, config.jwt_secret);

    return {
        access_token: token,
        data: user,
        expires: expires,
    };
}