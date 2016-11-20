/**
 * @Author: Spring
 * @Date:   2016-11-14 18:42:38
 * @Last Modified by:
 * @Last Modified time:
 */

var db_backend= appRequire('db/db_backend');
var applicationMode = appRequire('model/backend/application/applicationmodel');

//查询目前所有应用
exports.queryAllApp = function (data, callback) {
    var query_sql = 'select ID,ApplicationCode,ApplicationName,Memo,IsActive from jit_application where 1=1';
    var connection = '';

    if (data !== undefined) {
        for (var key in data) {
            query_sql += ' and ' + key + " = '" + data[key] + "' ";
        }
    }

    console.log("查询所有应用" + query_sql);


    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(query_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//新增应用
exports.insert = function(data, callback) {
    var insert_sql = 'insert into jit_application set ';
    var insert_sql_length = insert_sql.length;
    if (data !== undefined) {
        for (var key in data) {
            if (insert_sql.length == insert_sql_length) {
                insert_sql += key + " = '" + data[key] + "' ";
            } else {
                insert_sql += ", " + key + " = '" + data[key] + "' ";
            }
        }
    }
    console.log("新增应用: " + insert_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(insert_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};

//编辑应用
exports.update = function (data, callback) {
    var upd_sql = 'update jit_application set ';
    var upd_sql_length = upd_sql.length;
    if (data !== undefined) {
        for (var key in data) {
            if (upd_sql.length == upd_sql_length) {
                upd_sql += key + " = '" + data[key] + "' ";
            } else {
                upd_sql += ", " + key + " = '" + data[key] + "' ";
            }
        }
    }
    console.log("编辑应用: " + upd_sql);

    upd_sql += " WHERE " + applicationMode.PK + " = '" + data[applicationMode.PK] + "'";

    console.log("修改用户: " + upd_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(upd_sql, function (err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};

//删除应用
exports.delete = function (data, callback) {
    var del_sql = 'delete from jit_application where ID in ';
    del_sql += "(";
    del_sql += data.toString();
    del_sql += ")";

    console.log("删除用户" + del_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(del_sql, function (err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};