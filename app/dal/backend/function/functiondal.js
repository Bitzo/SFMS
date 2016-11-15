/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-15 00:12:38
 */


var db_backend = appRequire('db/db_backend');
var functionModel = appRequire('model/backend/function/functionmodel');

//得到功能点
exports.queryAllFunctions = function (data, callback) {
    var sql = 'select ApplicationID,FunctionID,FunctionLevel,ParentID,FunctionCode,FunctionName,Memo,IsActive from jit_function where 1=1 ';
    var condition = '';

    if (data['appID'] !== undefined) {
        sql += " and ApplicationID = '" + data['appID'] + "' ";
    }

    console.log("查询功能点:" + sql);

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
        });
    });
};


//新增功能点
exports.insert = function (data, callback) {
    var insert_sql = 'insert into jit_function set';
    if (data !== undefined) {
        for (var key in data) {
            if (insert_sql.length == 0) {
                sql += key + " = '" + data[key] + "' ";
            } else {
                sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }
    console.log("新增功能点: " + insert_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function (err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};

//修改功能点
exports.update = function (data, callback) {
    var upd_sql = 'update jit_function set ';
    if (data !== undefined) {
        for (var key in data) {
            if (upd_sql.length == 0) {
                sql += key + " = '" + data[key] + "' ";
            } else {
                sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }
    upd_sql += " WHERE " + functionModel.pk + " = " + data[functionModel.pk];

    console.log("修改功能点: " + upd_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(sql, function (err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};

//删除功能点
exports.delete = function (data, callback) {
    var del_sql = 'update  jit_function set IsActive=1 where FunctionID in ';
    del_sql += "(";
    del_sql += data.toString();
    del_sql += ")";

    console.log("删除功能点: " + del_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(sql, function (err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};