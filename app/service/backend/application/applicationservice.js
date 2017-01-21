/**
 * @Author: Spring
 * @Date:   2016-11-14 20:14:22
 * @Last Modified by:
 * @Last Modified time:
 * @Function: 应用模块的service
 */

var appDAL = appRequire('dal/backend/application/applicationdal');
var logModel = appRequire('model/backend/log/logmodel');
var moment = require('moment');
var config = appRequire('config/config');
var operationConfig = appRequire('config/operationconfig');
var logService = appRequire('service/backend/log/logservice');

logModel.ApplicationID = operationConfig.backendApp.applicationID;
logModel.ApplicationName = operationConfig.backendApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

//查询目前所有的应用
exports.queryAllApp = function (data, callback) {
    var formdata = {
        'ApplicationName': data.ApplicationName || '',
        'SelectType': data.SelectType || '',
        'ID': data.ID || '',
        'IsActive': data.IsActive || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount
    }
    if (formdata.ID !== '') {
        logModel.OperationName = operationConfig.backendApp.appManage.appSingleQuery.actionName;
        logModel.Action = operationConfig.backendApp.appManage.appSingleQuery.actionName;
        logModel.Identifier = operationConfig.backendApp.appManage.appSingleQuery.identifier;
    } else {
        logModel.OperationName = operationConfig.backendApp.appManage.appMultiQuery.actionName;
        logModel.Action = operationConfig.backendApp.appManage.appMultiQuery.actionName;
        logModel.Identifier = operationConfig.backendApp.appManage.appMultiQuery.identifier;
    }

    appDAL.queryAllApp(formdata, function (err, results) {
       if (err) {
           logModel.Type = 1;
           logModel.Memo = "应用新增失败 ";
           logModel.CreateUserID = data.OperateUserID || 1;
           logService.insertOperationLog(logModel, function (err, insertID) {
               if (err) {
                   logger.writeError("应用新增失败，生成操作日志失败 " + logModel.CreateTime);
               }
           })
           callback(true);
           return;
       }
       logModel.Type = 2;
       logModel.Memo = "应用新增成功";
       logModel.CreateUserID = data.OperateUserID || 1;
       logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("应用新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
       })
        return callback(false, results);
    });
};

exports.insert = function (data, callback) {
    var formdata = {
        'ApplicationCode': data.ApplicationCode,
        'ApplicationName': data.ApplicationName,
        'Memo': data.Memo,
        'IsActive': data.IsActive
    }
    logModel.OperationName = operationConfig.backendApp.appManage.appAdd.actionName;
    logModel.Action = operationConfig.backendApp.appManage.appAdd.actionName;
    logModel.Identifier = operationConfig.backendApp.appManage.appAdd.identifier;
    appDAL.insert(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "应用查询失败";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("应用查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "应用查询成功";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("应用查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        return callback(false, results);
    });
};

exports.countAllapps = function (data, callback) {
    var formdata = {
        'ApplicationName': data.ApplicationName || '',
        'ID': data.ID || '',
        'IsActive': data.IsActive || '',
    }
    appDAL.countAllapps(formdata, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        return callback(false, results);
    });
};

exports.update = function (data, callback) {
    var formdata = {
        'ID': data.ID,
        'ApplicationCode': data.ApplicationCode,
        'ApplicationName': data.ApplicationName,
        'Memo': data.Memo,
        'IsActive': data.IsActive
    }
    if (formdata.IsActive == 0) {
        logModel.OperationName = operationConfig.backendApp.appManage.appDel.actionName;
        logModel.Action = operationConfig.backendApp.appManage.appDel.actionName;
        logModel.Identifier = operationConfig.backendApp.appManage.appDel.identifier;
        logModel.Memo = '应用删除';
    } else {
        logModel.OperationName = operationConfig.backendApp.appManage.appUpd.actionName;
        logModel.Action = operationConfig.backendApp.appManage.appUpd.actionName;
        logModel.Identifier = operationConfig.backendApp.appManage.appUpd.identifier;
        logModel.Memo = '应用修改';
    }
    appDAL.update(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo += "失败 ";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("应用修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo += "成功 ";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("应用修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        return callback(false, results);
    });
};
