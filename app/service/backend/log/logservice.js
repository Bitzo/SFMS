/**
 * @Author: snail
 * @Date:   2016-12-03
 * @Last Modified by:  
 * @Last Modified time: 
 */
var validator = require('validator');

var operationLogDAL = appRequire('dal/backend/log/logdal');
var logger = appRequire('util/loghelper').helper;

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