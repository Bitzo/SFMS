/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:41
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:41
 * @Function: 角色对应功能点查询
 */

var rolefuncDAL = appRequire('dal/backend/role/rolefuncdal.js');

//查询所有的角色
exports.queryRoleFunc = function (data, callback) {
    rolefuncDAL.queryRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('queryRoleFunc');
        callback(false, results);
    })
}

//新增角色功能点
exports.addRoleFunc = function (data, callback) {
    rolefuncDAL.addRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('addRoleFunc');
        callback(false, results);
    })
}

//更改角色功能点
exports.updateRoleFunc = function (data, callback) {
    rolefuncDAL.updateRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('updataRoleFunc');
        callback(false, results);
    })
}

//删除角色功能点
exports.delRoleFunc = function (data, callback) {
    rolefuncDAL.delRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('deleteRoleFunc');
        callback(false, results);
    })
}