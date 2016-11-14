var jwt = require('jwt-simple');
var config = appRequire('config/config');

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

exports.genToken = function(user) {
    var expires = expiresIn(3); //3天后token过期
    var token = jwt.encode({
        exp: expires
    }, config.jwt_secret);

    return {
        token: token,
        expires: expires,
        user: user
    };
}

