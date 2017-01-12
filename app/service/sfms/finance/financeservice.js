/**
 * @Author: bitzo
 * @Date: 2016/12/3 20:19
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/3 20:19
 * @Function: 财务服务
 */

var financeDAL = appRequire('dal/sfms/finance/financedal');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;
var logService = appRequire('service/backend/log/logservice');
var config = appRequire('config/config');
var logModel = appRequire('model/backend/log/logmodel');
var operationConfig = appRequire('config/operationconfig');
var moment = require('moment');

logModel.ApplicationID = operationConfig.sfmsApp.applicationID;
logModel.ApplicationName = operationConfig.sfmsApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

//财务新增
exports.addFinance = function(data, callback) {
    var formdata = {
        'FIName': data.FIName,
        'FIType': data.FIType,
        'InOutType': data.InOutType,
        'FIPrice': data.FIPrice,
        'projectID': data.projectID,
        'UserID': data.UserID,
        'UserName': data.UserName,
        'OperateUser': data.OperateUser,
        'FIStatu': data.FIStatu,
        'Remark': data.Remark,
        'IsActive': data.IsActive
    }
    financeDAL.addFinance(formdata, function (err, results) {
        if (err) {
            logModel.OperationName = operationConfig.sfmsApp.financeManage.financeAdd.actionName;
            logModel.Action = operationConfig.sfmsApp.financeManage.financeAdd.actionName;
            logModel.Type = 1;
            logModel.Identifier = operationConfig.sfmsApp.financeManage.financeAdd.identifier;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "财务新增失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '新增失败');
            return;
        }
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeAdd.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeAdd.actionName;
        logModel.Type = 2;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeAdd.identifier;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "财务新增成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务信息新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('新增财务信息');
        callback(false, results);
    })
}

//财务信息修改
exports.updateFinance = function(data, callback) {
    var formdata = {
        'ID': data.ID,
        'FIName': data.FIName,
        'FIType': data.FIType,
        'InOutType': data.InOutType,
        'FIPrice': data.FIPrice,
        'ProjectID': data.ProjectID,
        'UserID': data.UserID,
        'UserName': data.UserName,
        'OperateUser': data.OperateUser,
        'FIStatu': data.FIStatu,
        'Remark': data.Remark,
        'IsActive': data.IsActive
    }
    financeDAL.updateFinance(formdata, function (err, results) {
        if (err) {
            logModel.OperationName = operationConfig.sfmsApp.financeManage.financeUpdete.actionName;
            logModel.Action = operationConfig.sfmsApp.financeManage.financeUpdete.actionName;
            logModel.Type = 1;
            logModel.Identifier = operationConfig.sfmsApp.financeManage.financeUpdete.identifier;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "财务信息修改失败";
            if (formdata.IsActive == 0) {
                logModel.OperationName = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
                logModel.Action = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
                logModel.Identifier = operationConfig.sfmsApp.financeManage.financeDelete.identifier;
                logModel.Memo = "财务信息逻辑删除失败";
            }
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '修改失败');
            return;
        }
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeUpdete.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeUpdete.actionName;
        logModel.Type = 2;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeUpdete.identifier;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "财务信息修改成功";
        if (formdata.IsActive == 0) {
            logModel.OperationName = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
            logModel.Action = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
            logModel.Identifier = operationConfig.sfmsApp.financeManage.financeDelete.identifier;
            logModel.Memo = "财务信息逻辑删除成功";
        }
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务信息修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('修改财务信息');
        callback(false, results);
    })
}

//财务信息查询
exports.queryFinance = function (data, callback) {
    var queryData = {
        'jit_financeinfo.ID': data.ID || '',
        'Username': data.Username || '',
        'InOutType': data.InOutType || '',
        'FIType': data.FIType || '',
        'FIStatu': data.FIStatus || '',
        'FIName': data.FIName || '',
        'ProjectID': data.projectID || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount,
    }
    financeDAL.queryFinance(queryData, function (err, results) {
        if (err) {
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "财务信息查询失败";
            logModel.Type = 1;
            if (data.ID != '' && data.ID !== undefined) {
                logModel.OperationName = operationConfig.sfmsApp.financeManage.financeSingleQuery.actionName;
                logModel.Action = operationConfig.sfmsApp.financeManage.financeSingleQuery.actionName;
                logModel.Identifier = operationConfig.sfmsApp.financeManage.financeSingleQuery.identifier;
            } else {
                logModel.OperationName = operationConfig.sfmsApp.financeManage.financeMultiQuery.actionName;
                logModel.Action = operationConfig.sfmsApp.financeManage.financeMultiQuery.actionName;
                logModel.Identifier = operationConfig.sfmsApp.financeManage.financeMultiQuery.identifier;
            }
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息信息查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '查询失败');
            return;
        }
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "财务信息查询成功";
        logModel.Type = 2;
        if (data.ID != '' && data.ID !== undefined) {
            logModel.OperationName = operationConfig.sfmsApp.financeManage.financeSingleQuery.actionName;
            logModel.Action = operationConfig.sfmsApp.financeManage.financeSingleQuery.actionName;
            logModel.Identifier = operationConfig.sfmsApp.financeManage.financeSingleQuery.identifier;
        } else {
            logModel.OperationName = operationConfig.sfmsApp.financeManage.financeMultiQuery.actionName;
            logModel.Action = operationConfig.sfmsApp.financeManage.financeMultiQuery.actionName;
            logModel.Identifier = operationConfig.sfmsApp.financeManage.financeMultiQuery.identifier;
        }
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务信息信息查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('查询财务信息');
        callback(false, results);
    })
}

//财务查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'jit_financeinfo.ID': data.ID || '',
        'Username': data.Username || '',
        'InOutType': data.InOutType || '',
        'FIType': data.FIType || '',
        'FIName': data.FIName || '',
        'FIStatu': data.FIStatus || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'jit_financeinfo.IsActive': 1
    }
    financeDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计财务信息数据量');
        callback(false, results);
    })
}

//财务审核
exports.checkFinance = function (data, callback) {
    var formdata = {
        ID: data.ID,
        FIStatu: data.FIStatu,
        CheckUser: data.CheckUser,
        Remark: data.Remark
    }
    financeDAL.checkFinance(formdata, function (err, results) {
        if (err) {
            logModel.OperationName = operationConfig.sfmsApp.financeManage.financeCheck.actionName;
            logModel.Action = operationConfig.sfmsApp.financeManage.financeCheck.actionName;
            logModel.Type = 1;
            logModel.Identifier = operationConfig.sfmsApp.financeManage.financeCheck.identifier;
            logModel.CreateUserID = data.CheckUser;
            logModel.Memo = "财务信息审核失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息信息审核失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, results);
            return;
        }
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeCheck.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeCheck.actionName;
        logModel.Type = 2;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeCheck.identifier;
        logModel.CreateUserID = data.CheckUser;
        logModel.Memo = "财务信息审核成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务信息信息审核成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('审核财务');
        callback(false, results);
    })
}