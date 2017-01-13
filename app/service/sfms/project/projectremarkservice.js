/**
 * @Author: bitzo
 * @Date: 2016/12/18 12:59
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/18 12:59
 * @Function:
 */

var projectremarkDAL = appRequire('dal/sfms/project/projectremarkdal.js');
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

//项目用户备注信息新增
exports.addRemark = function(data, callback) {
    var formdata = {
        'projectID': data.projectID,
        'projectName': data.projectName,
        'userID': data.userID,
        'userName': data.userName,
        'remark': data.remark
    }
    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectRemarkAdd.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectRemarkAdd.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectRemarkAdd.identifier;
    projectremarkDAL.addRemark(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目备注新增失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目备注新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '新增失败');
            return;
        }
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "项目备注新增成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目备注新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('新增项目用户备注');
        callback(false, results);
    })
}

//项目用户备注信息编辑
exports.updateRemark = function(data, callback) {
    var formdata = {
        'ID': data.ID,
        'projectID': data.projectID,
        'projectName': data.projectName,
        'userID': data.userID,
        'userName': data.userName,
        'remark': data.remark
    }
    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectRemarkUpdate.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectRemarkUpdate.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectRemarkUpdate.identifier;
    projectremarkDAL.updateRemark(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目备注修改失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目备注修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '编辑失败');
            return;
        }
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "项目备注修改成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目备注修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('编辑项目用户备注');
        callback(false, results);
    })
}

//项目用户备注信息查询
exports.queryRemark = function(data, callback) {
    var formdata = {
        'jit_projectremark.ID': data.ID || '',
        'projectID': data.projectID || '',
        'userID': data.userID || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount
    }
    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectRemarkQuery.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectRemarkQuery.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectRemarkQuery.identifier;
    projectremarkDAL.queryRemark(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目备注查询失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目备注查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true, '查询失败');
            return;
        }
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "项目备注查询成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目备注查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('查询项目用户备注');
        callback(false, results);
    })
}

//项目用户备注信息查询统计
exports.countRemark = function (data, callback) {
    var formdata = {
        'userID': data.userID || '',
        'jit_projectremark.ID': data.ID || '',
        'projectID': data.projectID || ''
    }
    projectremarkDAL.countRemark(formdata, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('查询项目用户备注数量');
        callback(false, results);
    })
}

//项目用户备注信息删除
exports.delRemark = function (data, callback) {
    var formdata = {
        ID: data.ID
    }
    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectRemarkDelete.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectRemarkDelete.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectRemarkDelete.identifier;
    projectremarkDAL.delRemark(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目备注删除失败";
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目备注删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            })
            callback(true);
            return;
        }
        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "项目备注删除成功";
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目备注删除成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        logger.writeInfo('查询项目用户备注删除');
        callback(false, results);
    })
}