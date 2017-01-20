/**
 * @Author: bitzo
 * @Date: 2016/11/13 14:34
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 14:34
 * @Function: 角色模块功能
 */

var roleDAL = appRequire('dal/backend/role/roledal.js');
var logger = appRequire("util/loghelper").helper;

//查询所有的角色
exports.queryAllRoles = function (data, callback) {
    roleDAL.queryAllRoles(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('queryAllRoles');
        callback(false, results);
    })
}

//查询对应项目的角色个数
exports.countAllRoles = function (data, callback) {
    roleDAL.countAllRoles(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('countAllRoles');
        callback(false, results);
    })
}

//新增角色信息
exports.addRole = function (data, callback) {

    //验证数据是否都已定义
    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                console.log(key);
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

    roleDAL.addRole(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('addRole');
        callback(false, results);
    })
}

//修改角色的基本信息
exports.updateRole = function (data, callback) {
    roleDAL.updateRole(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
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