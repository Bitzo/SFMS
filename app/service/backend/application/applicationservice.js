/**
 * @Author: Spring
 * @Date:   2016-11-14 20:14:22
 * @Last Modified by:
 * @Last Modified time:
 */

var appDAL = appRequire('dal/backend/application/applicationdal');

//查询目前所有的应用
exports.queryAllApp = function (data, callback) {
    appDAL.queryAllApp(data, function (err, results) {
       if (err) {
           callback(true);
           return;
       }
       callback(false, results);
    });
};

exports.insert = function (data, callback) {
    appDAL.insert(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

exports.update = function (data, callback) {
    appDAL.update(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

exports.delete = function (data, callback) {
    appDAL.delete(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};