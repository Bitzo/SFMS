/**
 * @Author: bitzo
 * @Date: 2016/12/1 19:37
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/1 19:37
 * @Function: 项目用户服务
 */

var projectuserDAL = appRequire('dal/sfms/project/projectuserdal.js'),
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

//项目用户基本信息新增
exports.addProjectUser = function(data, callback) {
    for (var i in data) {
        data[i].duty = data[i].duty || '';
    }

    projectuserDAL.addProjectUser(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }

        logger.writeInfo('新增项目用户');
        callback(false, results);
    })
};

//项目用户基本信息修改
exports.updateProjectUser = function(data, callback) {
    projectuserDAL.updateProjectUser(data, function (err, results) {
        if (err) {
            callback(true, '修改失败');
            return;
        }

        logger.writeInfo('修改项目用户');
        callback(false, results);
    })
};

//项目用户信息查询
exports.queryProjectUser = function (data, callback) {
    var formdata = {
        'ProjectID': data.ProjectID || '',
        'UserName': data.UserName || '',
        'jit_projectruser.IsActive': 1,
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount
    };

    logModel.OperationName = operationConfig.sfmsApp.projectManage.projectUserQuery.actionName;
    logModel.Action = operationConfig.sfmsApp.projectManage.projectUserQuery.actionName;
    logModel.Identifier = operationConfig.sfmsApp.projectManage.projectUserQuery.identifier;

    projectuserDAL.queryProjectUser(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.CreateUserID = data.OperateUserID;
            logModel.Memo = "项目用户查询失败";

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("项目用户查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true, '查询失败');
            return;
        }

        logModel.Type = 2;
        logModel.CreateUserID = data.OperateUserID;
        logModel.Memo = "项目用户查询成功";

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("项目用户查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('查询项目用户');
        callback(false, results);
    })
};

//项目用户信息查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'ProjectID': data.ProjectID || '',
        'UserName': data.UserName || '',
        'jit_projectruser.IsActive': 1
    };

    projectuserDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }

        logger.writeInfo('统计数据量');
        callback(false, results);
    })
};

//根据用户ID，查找所在的项目
exports.queryProjectByUserID = function (data, callback) {
    projectuserDAL.queryProjectByUserID(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }

        logger.writeInfo('查询用户所在项目');
        callback(false, results);
    })
};