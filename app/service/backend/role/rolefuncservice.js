/**
 * @Author: bitzo
 * @Date: 2016/11/13 20:41
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 20:41
 * @Function: 角色对应功能点查询
 */

var rolefuncDAL = appRequire('dal/backend/role/rolefuncdal.js');

//查询所有的角色功能点
exports.queryRoleFunc = function (data, callback) {
    rolefuncDAL.queryRoleFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log('queryRoleFunc');
        console.log(results);
        callback(false, results);
    })
}

//新增角色功能点
exports.addRoleFunc = function (data, callback) {
    var delData = {
        'RoleID': data['RoleID']
    };

    rolefuncDAL.delRoleFunc(delData,function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log("已删除该用户所有的功能点");

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
            console.log('addRoleFunc');
            callback(false, results);
        })
    })
}

//更改角色功能点
exports.updateRoleFunc = function (data, callback) {
    var delData = {
        'RoleID': data['RoleID']
    };

    rolefuncDAL.delRoleFunc(delData,function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log("已删除该用户所有的功能点");

        function checkData(data) {
            for (var key in data) {
                if(data[key] === undefined) {
                    console.log("undefined:"+ key);
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
            console.log('addRoleFunc');
            callback(false, results);
        })
    })
}

exports.delRoleFunc = function (data, callback) {
    var delData = {
        'RoleID': data['RoleID']
    };

    rolefuncDAL.delRoleFunc(delData, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        console.log("已删除该用户所有的功能点");
        callback(false, results);
    })
}