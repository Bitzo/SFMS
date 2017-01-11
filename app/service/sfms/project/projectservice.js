/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:43
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:43
 * @Function: 项目服务
 */

var projectDAL = appRequire('dal/sfms/project/projectdal.js');
//引入日志中间件
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

//项目基本信息新增
exports.addProject = function(data, callback) {
    var formdata = {
        'ProjectName': data.ProjectName,
        'ProjectDesc': data.ProjectDesc,
        'ProjectManageID': data.ProjectManageID,
        'ProjectManageName': data.ProjectManageName,
        'ProjectEndTime': data.ProjectEndTime,
        'ProjectTimeLine': data.ProjectTimeLine,
        'ProjectStatus': data.ProjectStatus,
        'ProjectPrice': data.ProjectPrice,
        'OperateUser': data.OperateUser,
        'EditUser': data.EditUser,
        'IsActive': data.IsActive,
        'EditTime': data.EditTime,
        'CreateTime': data.CreateTime
    }
    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectAdd.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectAdd.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectAdd.identifier;
    projectDAL.addProject(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目新增失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '新增失败');
            return;
        }
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "项目新增成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('新增项目');
        callback(false, results);
    })
}

//项目基本信息修改
exports.updateProject = function(data, callback) {
    var isActive = 1;
    if (data.IsActive === 0) {
        isActive = 0;
    }
    var formdata = {
        'ID': data.ID || '',
        'ProjectDesc': data.ProjectDesc || '',
        'ProjectName': data.ProjectName || '',
        'ProjectManageID': data.ProjectManageID || '',
        'ProjectManageName': data.ProjectManageName || '',
        'ProjectEndTime': data.ProjectEndTime || '',
        'ProjectTimeLine': data.ProjectTimeLine || '',
        'ProjectStatus': data.ProjectStatus || '',
        'ProjectPrice': data.ProjectPrice || '',
        'OperateUser': data.OperateUser || '',
        'EditUser': data.EditUser || '',
        'EditTime': data.EditTime || '',
        'IsActive': isActive,
    }
    if (formdata.IsActive == 1) {
        logModel.OperationName = operationConfig.sfmsApp.projectManage.projectUpdete.actionName;
        logModel.Action = operationConfig.sfmsApp.projectManage.projectUpdete.actionName;
        logModel.Identifier = operationConfig.sfmsApp.projectManage.projectUpdete.identifier;
    } else {
        logModel.OperationName = operationConfig.sfmsApp.projectManage.projectDelete.actionName;
        logModel.Action = operationConfig.sfmsApp.projectManage.projectDelete.actionName;
        logModel.Identifier = operationConfig.sfmsApp.projectManage.projectDelete.identifier;
    }
    projectDAL.updateProject(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            if (formdata.IsActive == 1) {
                logModel.Memo = "项目修改失败";
            } else {
                logModel.Memo = "项目逻辑删除失败";
            }
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '修改失败');
            return;
        }
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        if (formdata.IsActive == 1) {
            logModel.Memo = "项目修改成功";
        } else {
            logModel.Memo = "项目逻辑删除成功";
        }
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('修改项目');
        callback(false, results);
    })
}

//项目信息查询-统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'ID': data.ID,
        'ProjectManageID': data.ProjectManageID,
        'CreateTime': data.CreateTime,
        'ProjectEndTime': data.ProjectEndTime,
    }
    projectDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计数据量');
        callback(false, results);
    })
}

//项目信息查询
exports.queryProject = function (data, callback) {
    data = {
        'ID': data.ID || '',
        'ProjectManageID': data.ProjectManageID || '',
        'ProjectName': data.projectName || '',
        'CreateTime': data.CreateTime || '',
        'ProjectEndTime': data.ProjectEndTime || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount,
    }
    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectQuery.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectQuery.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectQuery.identifier;

    projectDAL.queryProject(data, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目查询失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            logModel.Type = 2;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目查询成功";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询成功，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询项目信息');
        callback(false, results);
    })
}