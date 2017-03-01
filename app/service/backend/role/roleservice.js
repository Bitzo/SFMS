/**
 * @Author: bitzo
 * @Date: 2016/11/13 14:34
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 14:34
 * @Function: 角色模块功能
 */

var roleDAL = appRequire('dal/backend/role/roledal.js'),
    logger = appRequire("util/loghelper").helper,
    logModel = appRequire('model/backend/log/logmodel'),
    moment = require('moment'),
    config = appRequire('config/config'),
    operationConfig = appRequire('config/operationconfig'),
    logService = appRequire('service/backend/log/logservice');

logModel.ApplicationID = operationConfig.backendApp.applicationID;
logModel.ApplicationName = operationConfig.backendApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

//查询所有的角色
exports.queryAllRoles = function (data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'RoleID': data.RoleID || '',
        'RoleName': data.RoleName || '',
        'RoleCode': data.RoleCode || '',
        'SelectType': data.SelectType || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount,
        'RoleName': data.RoleName || '',
        'jit_role.IsActive': data.IsActive || ''
    };

    if (formdata.RoleCode !== '') {
        formdata.RoleCode = formdata.RoleCode.toLocaleUpperCase();
    }

    if (formdata.RoleID!=='') {
        logModel.OperationName = operationConfig.backendApp.roleManage.roleSingleQuery.actionName;
        logModel.Action = operationConfig.backendApp.roleManage.roleSingleQuery.actionName;
        logModel.Identifier = operationConfig.backendApp.roleManage.roleSingleQuery.identifier;
    } else {
        logModel.OperationName = operationConfig.backendApp.roleManage.roleMultiQuery.actionName;
        logModel.Action = operationConfig.backendApp.roleManage.roleMultiQuery.actionName;
        logModel.Identifier = operationConfig.backendApp.roleManage.roleMultiQuery.identifier;
    }

    roleDAL.queryAllRoles(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "角色查询失败 ";
            logModel.CreateUserID = data.OperateUserID;
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("角色查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "角色查询成功";
        logModel.CreateUserID = data.OperateUserID;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("角色查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('queryAllRoles');
        callback(false, results);
    })
};

//查询对应项目的角色个数
exports.countAllRoles = function (data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'RoleID': data.RoleID || '',
        'RoleName': data.RoleName || '',
        'RoleCode': data.RoleCode || '',
        'IsActive': data.IsActive || ''
    };

    if (formdata.RoleCode !== '') {
        formdata.RoleCode = formdata.RoleCode.toLocaleUpperCase();
    }

    roleDAL.countAllRoles(formdata, function (err, results) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo('countAllRoles');
        callback(false, results);
    })
};

//新增角色信息
exports.addRole = function (data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'RoleCode': data.RoleCode,
        'RoleName': data.RoleName,
        'IsActive': data.IsActive
    };

    logModel.OperationName = operationConfig.backendApp.roleManage.roleAdd.actionName;
    logModel.Action = operationConfig.backendApp.roleManage.roleAdd.actionName;
    logModel.Identifier = operationConfig.backendApp.roleManage.roleAdd.identifier;

    roleDAL.addRole(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "角色新增失败 ";
            logModel.CreateUserID = data.OperateUserID;

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("角色新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "角色新增成功";
        logModel.CreateUserID = data.OperateUserID;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("角色新增成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo('addRole');
        callback(false, results);
    })
};

//修改角色的基本信息
exports.updateRole = function (data, callback) {
    var formdata = {
        'ApplicationID': data.ApplicationID || '',
        'RoleID': data.RoleID || '',
        'RoleCode': data.RoleCode || '',
        'RoleName': data.RoleName || '',
        'IsActive': data.IsActive
    };

    if (formdata.IsActive === 0) {
        logModel.OperationName = operationConfig.backendApp.roleManage.roleDel.actionName;
        logModel.Action = operationConfig.backendApp.roleManage.roleDel.actionName;
        logModel.Identifier = operationConfig.backendApp.roleManage.roleDel.identifier;
    } else {
        logModel.OperationName = operationConfig.backendApp.roleManage.roleUpdate.actionName;
        logModel.Action = operationConfig.backendApp.roleManage.roleUpdate.actionName;
        logModel.Identifier = operationConfig.backendApp.roleManage.roleUpdate.identifier;
    }

    roleDAL.updateRole(formdata, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "角色修改失败 ";
            logModel.CreateUserID = data.OperateUserID;

            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("角色修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "角色修改成功";
        logModel.CreateUserID = data.OperateUserID;

        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("角色修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        });

        logger.writeInfo("updateRole");
        callback(false, results);
    })
}

/**
 * @param {array} RoleID:[]
 * function: 检验roleid是否存在
 */
 
 exports.queryRoleByID = function (data, callback) {
     if(!checkData (data)) {
         callback(true, '数据有误');
         return ;
     }
     
     roleDAL.queryRoleByID (data, function (err, results) {
        if(err) {
            callback(true, results);
            return ;
        }

        callback(false, results);
        return ;
     });
 }
 
 //验证数据是否都已定义
function checkData(data) {
    for (var key in data) {
        if (data[key] === undefined) {
            console.log('data' + key);
            return false;
        }
    }
    return true;
}