/**
 * @Author: bitzo
 * @Date: 2016/11/13 17:07
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 17:07
 * @Function: 角色功能点模块
 */

var db_backend = appRequire('db/db_backend');
var roleFunctionModel = appRequire('model/backend/role/rolefunctionmodel');
var logger = appRequire("util/loghelper").helper;

//查询角色功能点
exports.queryRoleFunc = function (data, callback) {
    var sql = 'select distinct jit_rolefunction.FunctionID, FunctionName from jit_rolefunction,jit_function where 1=1 and jit_rolefunction.FunctionID = jit_function.FunctionID';

    if (data !==undefined) {
        for (var key in data) {
            sql += ' and RoleID' + " = '" + data['RoleID'] + "' ";
        }
    }
    sql += ' and jit_function.Isactive = 1'

    logger.writeInfo("查询角色功能点：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        })
    })
}

//新增角色功能点
exports.addRoleFunc = function (data, callback) {
    var insert_sql = 'insert into jit_rolefunction (RoleID,FunctionID) VALUES ';
    var sql = '';

    var roleID = data.RoleID;
    var funcID = data.data;

    for (var key in funcID) {
        sql += "( " + roleID + ", " + funcID[key].FunctionID + ")";
        if(key < funcID.length-1) sql += ", ";
    }

    insert_sql += sql;

    logger.writeInfo("新增角色功能点：" + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err, results) {
            connection.release();
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};

//更新角色功能点
exports.updateRoleFunc = function(data, callback) {
    var upd_sql = 'update jit_rolefunction set ';
    var sql = '';
    if (data !== undefined) {
        for (var key in data) {
            if (sql.length == 0) {
                sql += key + " = '" + data[key] + "' ";
            } else {
                sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }
    upd_sql += sql;
    upd_sql += " where " + roleFunctionModel.PK + " = " + data[roleFunctionModel.PK];

    logger.writeInfo("更新角色功能点: " + upd_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(upd_sql, function(err, results) {
            connection.release();
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};

//删除角色功能点
exports.delRoleFunc = function (data, callback) {
    var sql = 'delete from jit_rolefunction where 1=1 ';

    if (data !== undefined) {
        sql += 'and RoleID = ' + data['RoleID'];
    }

    logger.writeInfo("删除角色功能点：" + sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
}
