/**
 * @Author: bitzo
 * @Date: 2016/11/13 14:34
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 14:34
 * @Function: 角色模块功能
 */

var roleDAL = appRequire('dal/backend/role/roledal.js');

//查询所有的角色
exports.queryAllRoles = function (data, callback) {

    roleDAL.queryAllRoles(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('queryAllRoles');
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
        console.log('countAllRoles');
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
        console.log('addRole');
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
        console.log("updateRole");
        callback(false, results);
    })
}