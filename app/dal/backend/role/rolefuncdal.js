/**
 * @Author: bitzo
 * @Date: 2016/11/13 17:07
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 17:07
 * @Function: 角色功能点模块
 */

var db_backend = appRequire('db/db_backend');
var roleFunctionModel = appRequire('model/backend/role/rolefunctionmodel');

//查询角色功能点
exports.queryRoleFunc = function (data, callback) {
    var sql = 'select ID, RoleID, FunctionID from jit_rolefunction where 1=1';

    if (data !==undefined) {
        for (var key in data) {
            sql += ' and ' + key + " = '" + data[key] + "' ";
        }
    }

    console.log("查询角色功能点：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        })
    })
}

//新增角色功能点
exports.addRoleFunc = function (data, callback) {
    var insert_sql = 'insert into jit_rolefunction (RoleID,FunctionID) VALUES ';
    var sql = '';

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

    var roleID = data.RoleID;
    var funcID = data.FunctionID;

    for (var key in funcID) {
        sql += "( " + roleID + ", " + funcID[key].FunctionID + ")";
        if(key < funcID.length-1) sql += ", ";
    }

    insert_sql += sql;

    console.log("新增角色功能点：" + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });

}