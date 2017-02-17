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
        'projectID': data.ProjectID,
        'UserID': data.UserID,
        'UserName': data.UserName,
        'OperateUser': data.OperateUser,
        'FIStatu': data.FIStatu,
        'Remark': data.Remark,
        'IsActive': data.IsActive
    }
    logModel.OperationName = operationConfig.sfmsApp.financeManage.financeAdd.actionName;
    logModel.Action = operationConfig.sfmsApp.financeManage.financeAdd.actionName;
    logModel.Identifier = operationConfig.sfmsApp.financeManage.financeAdd.identifier;
    financeDAL.addFinance(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "财务新增失败: " + data.FIName;
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '新增失败');
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "财务新增成功: " + data.FIName;
        logModel.CreateUserID = data.OperateUserID;
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
    if (formdata.IsActive === 0) {
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeDelete.identifier;
    } else {
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeUpdete.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeUpdete.actionName;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeUpdete.identifier;
    }

    financeDAL.updateFinance(formdata, function (err, results) {
        if (err) {
            logModel.CreateUserID = data.OperateUserID;
            logModel.Type = 1;
            logModel.Memo = "财务信息修改失败";
            if (formdata.IsActive === 0) {
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
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "财务信息修改成功";
        if (formdata.IsActive === 0) {
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
        'ProjectID': data.ProjectID || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'jit_financeinfo.IsActive': data.IsActive || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount,
    };

    if (data.ID !== '' && data.ID !== undefined) {
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeSingleQuery.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeSingleQuery.actionName;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeSingleQuery.identifier;
    } else {
        logModel.OperationName = operationConfig.sfmsApp.financeManage.financeMultiQuery.actionName;
        logModel.Action = operationConfig.sfmsApp.financeManage.financeMultiQuery.actionName;
        logModel.Identifier = operationConfig.sfmsApp.financeManage.financeMultiQuery.identifier;
    }

    financeDAL.queryFinance(queryData, function (err, results) {
        if (err) {
            logModel.Memo = "财务信息查询失败";
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息信息查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '查询失败');
            return;
        }
        logModel.Memo = "财务信息查询成功";
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
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
        'jit_financeinfo.IsActive': data.IsActive || ''
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

    logModel.OperationName = operationConfig.sfmsApp.financeManage.financeCheck.actionName;
    logModel.Action = operationConfig.sfmsApp.financeManage.financeCheck.actionName;
    logModel.Identifier = operationConfig.sfmsApp.financeManage.financeCheck.identifier;

    financeDAL.checkFinance(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "财务信息审核失败";
            logModel.CreateUserID = data.CheckUser;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务信息信息审核失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, results);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "财务信息审核成功";
        logModel.CreateUserID = data.CheckUser;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务信息信息审核成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('审核财务');
        callback(false, results);
    })
}

//财务逻辑删除
exports.delFinance = function (data, callback) {
    var formdata = {
        'ID': data.ID || '',
        'ProjectID': data.ProjectID || ''
    }
    logModel.OperationName = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
    logModel.Action = operationConfig.sfmsApp.financeManage.financeDelete.actionName;
    logModel.Identifier = operationConfig.sfmsApp.financeManage.financeDelete.identifier;
    financeDAL.delFinance(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "财务逻辑删除失败";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务逻辑删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, results);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "财务逻辑删除成功";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务逻辑删除成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('逻辑删除财务');
        callback(false, results);
    })
}

//财务统计
exports.financeCount = function (data, callback) {
    var formdata = {
        'startTime': data.startTime || '',
        'endTime': data.endTime || ''
    }
    logModel.OperationName = operationConfig.sfmsApp.financeManage.financeCount.actionName;
    logModel.Action = operationConfig.sfmsApp.financeManage.financeCount.actionName;
    logModel.Identifier = operationConfig.sfmsApp.financeManage.financeCount.identifier;
    financeDAL.financeCount(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "财务统计失败";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("财务统计失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, results);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "财务统计成功";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("财务统计成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('统计财务');
        callback(false, results);
    })
}