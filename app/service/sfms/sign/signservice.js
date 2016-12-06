/**
 * @Author: bitzo
 * @Date:   2016-11-09 09:44:26
 * @Last Modified by:
 * @Last Modified time:
 */
var signDAL = appRequire('dal/sfms/sign/signdal.js');
var logger = appRequire("util/loghelper").helper;

//用户签到签退
exports.signLog = function(data, callback) {
    signDAL.signLogInsert(data, function(err, results) {
        if(err) {
            callback(true);
            return;
        }
        logger.writeInfo('签到签退记录新增');
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
    logger.writeInfo(data)
    signDAL.querySign(data, function (err, results) {
        if(err) {
            callback(true);
            return;
        }
        logger.writeInfo('查询签到记录');
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
        logger.writeInfo('查询数据量统计');
        callback(false, results);
    })
}

//签到信息验证查询
exports.signCheck = function (data, callback) {
    signDAL.signCheck(data, function (err, results) {
        if(err) {
            callback(true);
            return;
        }
        logger.writeInfo('签到信息验证查询');
        callback(false, results);
    })
}