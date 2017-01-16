/**
 * @Author: bitzo
 * @Date:   2016-11-09 09:44:26
 * @Last Modified by:
 * @Last Modified time:
 */
var signDAL = appRequire('dal/sfms/sign/signdal.js');
var logger = appRequire("util/loghelper").helper;
var config = appRequire('config/config');
var logModel = appRequire('model/backend/log/logmodel');
var logService = appRequire('service/backend/log/logservice');
var operationConfig = appRequire('config/operationconfig');
var moment = require('moment');

logModel.ApplicationID = operationConfig.sfmsApp.applicationID;
logModel.ApplicationName = operationConfig.sfmsApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;


//用户签到签退
exports.signLog = function(data, callback) {
    if (data.SignType===0) {
        logModel.OperationName = operationConfig.sfmsApp.SignManage.SignIn.actionName;
        logModel.Action = operationConfig.sfmsApp.SignManage.SignIn.actionName;
        logModel.Identifier = operationConfig.sfmsApp.SignManage.SignIn.identifier;
    } else {
        logModel.OperationName = operationConfig.sfmsApp.SignManage.SignOut.actionName;
        logModel.Action = operationConfig.sfmsApp.SignManage.SignOut.actionName;
        logModel.Identifier = operationConfig.sfmsApp.SignManage.SignOut.identifier;
    }
    logModel.CreateUserID = data.UserID;

    signDAL.signLogInsert(data, function(err, results) {
        if(err) {
            logModel.Type = 1;
            logModel.Memo = "打卡记录新增失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("打卡记录新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "打卡记录新增成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("打卡记录新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('签到签退记录新增');
        callback(false, results);
    });
};

//用户签到记录查询
exports.querySign = function (data, callback) {
    var formdata = {
        'UserID': data.UserID || '',
        'UserAgent': data.UserAgent || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'SignType': data.SignType || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount
    }

    logModel.OperationName = operationConfig.sfmsApp.SignManage.SignQuery.actionName;
    logModel.Action = operationConfig.sfmsApp.SignManage.SignQuery.actionName;
    logModel.Identifier = operationConfig.sfmsApp.SignManage.SignQuery.identifier;
    logModel.CreateUserID = data.UserID;

    signDAL.querySign(formdata, function (err, results) {
        if(err) {
            logModel.Type = 1;
            logModel.Memo = "打卡记录查询失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("打卡记录查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "打卡记录查询成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("打卡记录查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('查询签到记录');
        callback(false, results);
    })
}

//查询数据量统计
exports.countQuery = function (data, callback) {
    var formdata = {
        'UserID': data.UserID || '',
        'UserAgent': data.UserAgent || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'SignType': data.SignType || '',
    }
    signDAL.countQuery(formdata, function (err, results) {
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

exports.signCount = function (data, callback) {
    var formdata = {
        'userID': data.userID || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
    }

    logModel.OperationName = operationConfig.sfmsApp.SignManage.SignCount.actionName;
    logModel.Action = operationConfig.sfmsApp.SignManage.SignCount.actionName;
    logModel.Identifier = operationConfig.sfmsApp.SignManage.SignCount.identifier;
    logModel.CreateUserID = data.OperateUserID;

    signDAL.signCount(formdata, function (err, results) {
        if(err) {
            logModel.Type = 1;
            logModel.Memo = "打卡记录统计失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("打卡记录统计失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "打卡记录统计成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("打卡记录统计成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('签到信息统计');
        callback(false, results);
    })
}