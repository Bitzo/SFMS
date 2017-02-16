/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:41
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:41
 * @Function: 角色对应功能点查询
 */

var rolefuncDAL = appRequire('dal/backend/role/rolefuncdal.js');
var logger = appRequire("util/loghelper").helper;
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

//查询所有的角色功能点
exports.queryRoleFunc = function (data, callback) {
    var formdata = {
        'RoleID': data.RoleID || ''
    }
    logModel.OperationName = operationConfig.backendApp.roleManage.roleFuncQuery.actionName;
    logModel.Action = operationConfig.backendApp.roleManage.roleFuncQuery.actionName;
    logModel.Identifier = operationConfig.backendApp.roleManage.roleFuncQuery.identifier;
    rolefuncDAL.queryRoleFunc(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "角色功能点查询失败 ";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("角色功能点查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "角色功能点查询成功";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("角色功能点查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('queryRoleFunc');
        logger.writeInfo(results);
        callback(false, results);
    })
}

//新增角色功能点
exports.addRoleFunc = function (data, callback) {
    var formdata = {
        'RoleID': data.RoleID,
        'data': data.data,
    }
    logModel.OperationName = operationConfig.backendApp.roleManage.roleFuncAdd.actionName;
    logModel.Action = operationConfig.backendApp.roleManage.roleFuncAdd.actionName;
    logModel.Identifier = operationConfig.backendApp.roleManage.roleFuncAdd.identifier;
    rolefuncDAL.addRoleFunc(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "角色功能点新增失败 ";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("角色功能点新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "角色功能点新增成功";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("角色功能点新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('addRoleFunc');
        callback(false, results);
    })
}

//删除角色的所有功能点
exports.delRoleFunc = function (data, callback) {
    var delData = {
        'RoleID': data.RoleID
    };
    logModel.OperationName = operationConfig.backendApp.roleManage.roleFuncDel.actionName;
    logModel.Action = operationConfig.backendApp.roleManage.roleFuncDel.actionName;
    logModel.Identifier = operationConfig.backendApp.roleManage.roleFuncDel.identifier;
    rolefuncDAL.delRoleFunc(delData, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "角色功能点删除失败 ";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("角色功能点删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.Memo = "角色功能点删除成功";
        logModel.CreateUserID = data.OperateUserID;
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("角色功能点删除成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo("已删除该用户所有的功能点");
        callback(false, results);
    })
};