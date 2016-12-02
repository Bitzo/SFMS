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

//用户签到记录查询
exports.querySign = function (data, callback) {
    if (data !== undefined) {
        for(var key in data) {
            if (data[key] === undefined)
                delete data.key;
        }
    }
    console.log(data)
    signDAL.querySign(data, function (err, results) {
        if(err) {
            callback(true);
            return;
        }
        console.log('查询签到记录');
        callback(false, results);
    })
}

//查询数据量统计
exports.countQuery = function (data, callback) {
    if (data !== undefined) {
        for(var key in data) {
            if (data[key] == undefined)
                delete data.key;
        }
    }
    signDAL.countQuery(data, function (err, results) {
        if(err) {
            callback(true);
            return;
        }
        console.log('查询数据量统计');
        callback(false, results);
    })
}
