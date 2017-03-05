/**
 * @Author: bitzo
 * @Date: 2016/12/2 16:37
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/2 16:37
 * @Function: KPI 服务
 */

var KPIdal = appRequire('dal/sfms/KPI/KPIdal.js'),
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

//KPI新增
exports.addKPI = function(data, callback) {
    var formdata = {
        'KPIName': data.KPIName,
        'KPIType': data.KPIType,
        'KPIScore': data.KPIScore,
        'ProjectId': data.ProjectId,
        'UserID': data.UserID,
        'UserName': data.UserName,
        'OperateUser': data.OperateUser,
        'KPIStatus': data.KPIStatus,
        'Remark': data.Remark,
        'IsActive': data.IsActive
    };

    logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPIAdd.actionName;
    logModel.Action = operationConfig.sfmsApp.KPIManage.KPIAdd.actionName;
    logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPIAdd.identifier;
    logModel.CreateUserID = data.OperateUserID;

    KPIdal.addKPI(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "绩效新增失败";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("绩效新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, '新增失败');
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "绩效新增成功";

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("绩效新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('新增KPI');
        callback(false, results);
    })
};

//KPI基本信息修改
exports.updateKPI = function(data, callback) {
    var formdata = {
        'ID': data.ID,
        'KPIName': data.KPIName,
        'KPIType': data.KPIType,
        'KPIScore': data.KPIScore,
        'ProjectId': data.ProjectId || data.ProjectID,
        'UserID': data.UserID,
        'UserName': data.UserName,
        'OperateUser': data.OperateUser,
        'KPIStatus': data.KPIStatus,
        'Remark': data.Remark,
        'IsActive': data.IsActive
    };

    logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPIUpdete.actionName;
    logModel.Action = operationConfig.sfmsApp.KPIManage.KPIUpdete.actionName;
    logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPIUpdete.identifier;
    logModel.CreateUserID = data.OperateUserID;

    KPIdal.updateKPI(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "绩效修改失败";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("绩效修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, '修改失败');
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "绩效修改成功";

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("绩效修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('修改KPI');
        callback(false, results);
    })
};

//KPI信息查询
exports.queryKPI = function (data, callback) {
    var formdata = {
        'jit_kpiinfo.ID': data.ID || '',
        'ProjectID': data.ProjectID || '',
        'UserID': data.UserID || '',
        'KPIStatus': data.KPIStatus || '',
        'KPIType': data.KPIType || '',
        'KPIName': data.KPIName || '',
        'StartTime': data.StartTime || '',
        'EndTime': data.EndTime || '',
        'KPIType': data.KPIType || '',
        'jit_kpiinfo.IsActive': data.IsActive || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount,
    };

    if (data.ID!==''&&data.ID!==undefined) {
        logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPISingleQuery.actionName;
        logModel.Action = operationConfig.sfmsApp.KPIManage.KPISingleQuery.actionName;
        logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPISingleQuery.identifier;
    } else {
        logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPIMultiQuery.actionName;
        logModel.Action = operationConfig.sfmsApp.KPIManage.KPIMultiQuery.actionName;
        logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPIMultiQuery.identifier;
    }

    KPIdal.queryKPI(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "绩效查询失败";
            logModel.CreateUserID = data.OperateUserID;

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("绩效查询失败，生成操作日志失败 " + logModel.CreateTime);
                }

            });

            callback(true, '查询失败');
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "绩效查询成功";
        logModel.CreateUserID = data.OperateUserID;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("绩效查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('查询KPI信息');
        callback(false, results);
    })
};

//KPI查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'jit_kpiinfo.ID': data.ID || '',
        'ProjectID': data.ProjectID || '',
        'UserID': data.UserID || '',
        'KPIStatus': data.KPIStatus || '',
        'StartTime': data.StartTime || '',
        'EndTime': data.EndTime || '',
        'jit_kpiinfo.IsActive': data.IsActive || ''
    };

    KPIdal.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }

        logger.writeInfo('统计KPI数据量');
        callback(false, results);
    })
};

//KPI审核
exports.checkKPI = function (data, callback) {
    var formdata = {
        ID: data.ID,
        KPIStatus: data.KPIStatus,
        CheckUser: data.CheckUser,
        Remark: data.Remark
    };

    logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPICheck.actionName;
    logModel.Action = operationConfig.sfmsApp.KPIManage.KPICheck.actionName;
    logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPICheck.identifier;

    KPIdal.checkKPI(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "绩效审核失败";
            logModel.CreateUserID = data.CheckUser;

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("绩效审核失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, results);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "绩效审核成功";
        logModel.CreateUserID = data.CheckUser;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("绩效审核成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('审核KPI');
        callback(false, results);
    })
};

//KPI逻辑删除
exports.delKPI = function (data, callback) {
    var formdata = {
        'ID': data.ID || '',
        'ProjectID': data.ProjectID || ''
    };

    logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPIDelete.actionName;
    logModel.Action = operationConfig.sfmsApp.KPIManage.KPIDelete.actionName;
    logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPIDelete.identifier;

    KPIdal.delKPI(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "绩效逻辑删除失败";
            logModel.CreateUserID = data.OperateUserID;

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("绩效逻辑删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, results);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "绩效逻辑删除成功";
        logModel.CreateUserID = data.OperateUserID;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("绩效逻辑删除成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('逻辑删除KPI');
        callback(false, results);
    })
};

exports.countKPI = function (data, callback) {
    var formdata = {
        'userID': data.userID || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || ''
    };

    logModel.OperationName = operationConfig.sfmsApp.KPIManage.KPICount.actionName;
    logModel.Action = operationConfig.sfmsApp.KPIManage.KPICount.actionName;
    logModel.Identifier = operationConfig.sfmsApp.KPIManage.KPICount.identifier;

    KPIdal.countKPI(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "绩效统计失败";
            logModel.CreateUserID = data.OperateUserID;

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("绩效统计失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, results);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "绩效统计成功";
        logModel.CreateUserID = data.OperateUserID;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("绩效统计成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('逻辑删除KPI');
        callback(false, results);
    })
};