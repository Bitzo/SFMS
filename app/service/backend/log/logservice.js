/**
 * @Author: snail
 * @Date:   2016-12-03
 * @Last Modified by:  
 * @Last Modified time: 
 */
var validator = require('validator');

var operationLogDAL = appRequire('dal/backend/log/logdal');
var logger = appRequire('util/loghelper').helper;
var config = appRequire('config/config');

/*
 *新增操作日志
 *return 新增成功的自增ID
 */
exports.insertOperationLog = function(data, callback) {
    var result = {
        "msg": "参数不能为空!"
    };

    //校验
    if (data == undefined || data.length == 0) {
        return callback(false, result);
    }

    //数据完整性校验
    if (!validator.isInt(data.ApplicationID.toString()) && data.ApplicationID > 0) {
        result.msg = "应用ID必须是一个正整数!";
        return callback(false, result);
    }

    if (!data.Action) {
        result.msg = "操作名称不能为空!";
        return callback(false, result);
    }

    if (!validator.isInt(data.Type.toString()) && data.Type > 0) {
        result.msg = "操作类型不能为空!";
        return callback(false, result);
    }

    if (!validator.isInt(data.CreateUserID.toString()) && data.CreateUserID > 0) {
        result.msg = "操作人不能为空!";
        return callback(false, result);
    }

    operationLogDAL.insertBizLog(data, function(err, results) {
        if (err) {
            return callback(true);
        }
        return callback(false, results.insertId);
    });
};

//日志查询
exports.queryLog = function (data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'Type': data.Type || '',
        'PDate': data.CreateTime || '',
        'CreateUserID': data.CreateUserID || '',
        'sort': data.sort,
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount,
        'sortDirection': data.sortDirection
    };

    operationLogDAL.queryLog(formdata, function (err, results) {
        if (err) {
            return callback(true);
        }
        logger.writeInfo('查询操作日志');
        return callback(false, results);
    })
}

//查询数据量统计
exports.countQuery = function (data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'Type': data.Type || '',
        'PDate': data.CreateTime || '',
        'CreateUserID': data.CreateUserID || ''
    }
    operationLogDAL.countQuery(formdata, function (err, results) {
        if(err) {
            callback(true);
            return;
        }
        logger.writeInfo('查询数据量统计');
        callback(false, results);
    })
}