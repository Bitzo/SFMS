/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:41
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:41
 * @Function: 角色对应功能点查询
 */

var rolefuncDAL = appRequire('dal/backend/role/rolefuncdal.js');
var logger = appRequire("util/loghelper").helper;

//查询所有的角色功能点
exports.queryRoleFunc = function (data, callback) {
    rolefuncDAL.queryRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('queryRoleFunc');
        logger.writeInfo(results);
        callback(false, results);
    })
}

//新增角色功能点
exports.addRoleFunc = function (data, callback) {
    function checkData(data) {
        for (var key in data) {
            if (data[key] === undefined) {
                console.log("undefined:" + key);
                return false;
            }
        }
        return true;
    }

    if (!checkData(data)) {
        callback(true);
        return;
    }

    rolefuncDAL.addRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('addRoleFunc');
        callback(false, results);
    })
}

//更改角色功能点
exports.updateRoleFunc = function (data, callback) {
    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                logger.writeInfo("undefined:"+ key);
                return false;
            }
        }
        return true;
    }
    if(!checkData(data))
    {
        callback(true);
        return;
    }

    rolefuncDAL.addRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('addRoleFunc');
        callback(false, results);
    })
}

//删除角色的所有功能点
exports.delRoleFunc = function (data, callback) {
    var delData = {
        'RoleID': data['RoleID']
    };

    rolefuncDAL.delRoleFunc(delData, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo("已删除该用户所有的功能点");
        callback(false, results);
    })
}