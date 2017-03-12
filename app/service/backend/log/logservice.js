/**
 * @Author: snail
 * @Date:   2016-12-03
 * @Last Modified by:  
 * @Last Modified time: 
 */
var validator = require('validator'),
    moment = require('moment');

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
        return callback(true, result);
    }

    //数据完整性校验
    if (!validator.isInt(data.ApplicationID.toString()) && data.ApplicationID > 0) {
        result.msg = "应用ID必须是一个正整数!";
        return callback(true, result);
    }

    if (!data.Action) {
        result.msg = "操作名称不能为空!";
        return callback(true, result);
    }

    if (!validator.isInt(data.Type.toString()) && data.Type > 0) {
        result.msg = "操作类型不能为空!";
        return callback(true, result);
    }

    if (data.createUserID && !validator.isInt(data.CreateUserID.toString()) && data.CreateUserID > 0) {
        result.msg = "操作人不能为空!";
        return callback(true, result);
    }

    operationLogDAL.insertBizLog(data, function(err, results) {
        if (err) {
            console.log('日志记录异常-->' + JSON.stringify(results));
            return callback(true);
        }
        return callback(false, results.insertId);
    });
};

//日志查询
exports.queryLog = function(data, callback) {
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

    operationLogDAL.queryLog(formdata, function(err, results) {
        if (err) {
            return callback(true);
        }
        logger.writeInfo('查询操作日志');
        return callback(false, results);
    })
}

//查询数据量统计
exports.countQuery = function(data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'Type': data.Type || '',
        'PDate': data.CreateTime || '',
        'CreateUserID': data.CreateUserID || ''
    }
    operationLogDAL.countQuery(formdata, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('查询数据量统计');
        callback(false, results);
    })
}

/**
 * 生成插入日志的模型，将一些固定的属性，直接初始化
 * @param appID 应用的ID
 * @param appName 应用的名称
 * @param type 动作的类型
 * @param action 当前的动作，可能是方法名
 * @param operateName 方法名
 * @param identifier 标识
 * @param memo 备注
 * @param createUserID 当前操作的用户ID
 * @returns {object} 日志model 
 */
exports.generateLogModel = function(appID, appName, type, action, operateName, identifier, memo, createUserID) {
    var logModel = {};

    logModel.ApplicationID = appID;
    logModel.ApplicationName = appName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operateName;
    logModel.Action = action;
    logModel.Identifier = identifier;
    logModel.Type = type;
    logModel.CreateUserID = createUserID;
    logModel.Memo = memo;

    return logModel;
}