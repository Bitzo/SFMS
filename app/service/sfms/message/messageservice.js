/**
 * @Author: bitzo
 * @Date: 2017/3/30 16:00
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/3/30 16:00
 * @Function:
 */


var messageDAL = appRequire('dal/sfms/message/messagedal.js'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config'),
    logModel = appRequire('model/backend/log/logmodel'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    moment = require('moment');

logModel.ApplicationID = operationConfig.sfmsApp.applicationID;
logModel.ApplicationName = operationConfig.sfmsApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

//通知基本信息新增
exports.addMessage = function(data, callback) {
    var formdata = {
        'MessageTitle': data.title,
        'MessageContent': data.content,
        'CreateTime': data.createTime,
        'CreateUserID': data.createUserID,
        'UserName': data.username,
        'IsActive': data.isActive
    };

    logModel.OperationName = operationConfig.sfmsApp.MessageManage.MessageAdd.actionName;
    logModel.Action = operationConfig.sfmsApp.MessageManage.MessageAdd.actionName;
    logModel.Identifier = operationConfig.sfmsApp.MessageManage.MessageAdd.identifier;

    messageDAL.addMessage(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.CreateUserID;
            logModel.Memo = "通知新增失败";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("通知新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })

            callback(true, '新增失败');
            return;
        }

        logModel.Type = 2;
        logModel.CreateUserID = data.CreateUserID;
        logModel.Memo = "通知新增成功";

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("通知新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('新增通知');
        callback(false, results);
    })
};

//通知基本信息编辑
exports.updateMessage = function(data, callback) {
    var formdata = {
        'ID': data.ID || '',
        'MessageTitle': data.title || '',
        'MessageContent': data.content || '',
        'CreateTime': data.createTime || '',
        'CreateUserID': data.createUserID || '',
        'UserName': data.username || '',
        'IsActive': data.IsActive===undefined? 1:data.IsActive
    };

    logModel.OperationName = operationConfig.sfmsApp.MessageManage.MessageEdit.actionName;
    logModel.Action = operationConfig.sfmsApp.MessageManage.MessageEdit.actionName;
    logModel.Identifier = operationConfig.sfmsApp.MessageManage.MessageEdit.identifier;

    messageDAL.updateMessage(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "通知修改失败";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("通知修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })

            callback(true, '修改失败');
            return;
        }

        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "通知修改成功";

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("通知修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('修改通知');
        callback(false, results);
    })
};


//通知查询-统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'ID': data.ID || '',
        'MessageTitle': data.title || '',
        'MessageContent': data.content || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'isActive': data.isActive || '',
    };

    messageDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }

        logger.writeInfo('统计数据量');
        callback(false, results);
    })
};

//通知信息查询
exports.queryMessage = function (data, callback) {
    data = {
        'ID': data.ID || '',
        'MessageTitle': data.title || '',
        'MessageContent': data.content || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'isActive': data.isActive || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount
    };

    logModel.OperationName = operationConfig.sfmsApp.MessageManage.MessageQuery.actionName;
    logModel.Action = operationConfig.sfmsApp.MessageManage.MessageQuery.actionName;
    logModel.Identifier = operationConfig.sfmsApp.MessageManage.MessageQuery.identifier;

    messageDAL.queryMessage(data, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "通知查询失败";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("通知查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            logModel.Type = 2;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "通知查询成功";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询成功，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, '查询失败');
            return;
        }

        logger.writeInfo('查询通知信息');
        callback(false, results);
    })
};