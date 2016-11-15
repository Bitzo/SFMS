/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-14 20:41
 */
var functionDAL = appRequire('dal/backend/function/functiondal.js');

//查询目前所有功能点
exports.queryAllFunctions = function (data, callback) {
    functionDAL.queryAllFunctions(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('functionserver');
        callback(false, results);
    });
};

exports.countAllFunctions = function (data, callback) {
    functionDAL.countAllFunctions(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('countAllFunctions');
        callback(false, results);
    });
}

//新增功能点
exports.insert = function (data, callback) {
    functionDAL.insert(data, function (err) {
        if (err) {
            callback(true);
            return;
        }
        callback(false);
    });
};

//修改功能点
exports.update = function (data, callback) {
    functionDAL.update(data, function (err) {
        if (err) {
            callback(true);
            return;
        }
        callback(false);
    });
};

//删除功能点
exports.delete = function (data, callback) {
    functionDAL.delete(data, function (err) {
        if (err) {
            callback(true);
            return;
        }
        callback(false);
    });
};