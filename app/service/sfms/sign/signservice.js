/**
 * @Author: bitzo
 * @Date:   2016-11-09 09:44:26
 * @Last Modified by:
 * @Last Modified time:
 */
var signDAL = appRequire('dal/sfms/sign/signdal.js');

//用户签到签退
exports.signLog = function(data, callback) {
    signDAL.signLogInsert(data, function(err, results) {
        if(err) {
            callback(true);
            return;
        }
        console.log('test1');
        callback(false, results);
    });
};
