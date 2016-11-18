/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-16 10:12:38
 *  @Function: 功能点管理
 */


var db_backend = appRequire('db/db_backend');
var functionModel = appRequire('model/backend/function/functionmodel');

//得到所有功能点
exports.queryAllFunctions = function (data, callback) {
    var sql = 'select ApplicationID,FunctionID,FunctionLevel,ParentID,FunctionCode,FunctionName,Memo,IsActive from jit_function where IsActive=1';
    var condition = '';

    sql += " and ApplicationID = " + data['appID'];

    console.log("得到所有功能点:" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            console.log('连接：err');
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
    var insert_sql = 'insert into `jit_function` set ?';

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql,data, function (err,results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false,results);
            connection.release();
        });
    });
};

//修改功能点
exports.update = function (data, callback) {
    var upd_sql = 'update jit_function set ?';
    upd_sql += " WHERE " + functionModel.PK + " = " + data[functionModel.PK];

    console.log("修改功能点: " + upd_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(upd_sql,data,function (err,results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false,results);
            connection.release();
        });
    });
};

//删除功能点
exports.delete = function (data, callback) {
    var del_sql = 'update  jit_function set IsActive=0 where FunctionID in ';
    del_sql += "(";
    del_sql += data.FunctionID.toString();
    del_sql += ")";

    console.log("删除功能点: " + del_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(del_sql, function (err,results) {
            if (err) {
                callback(true);
                connection.release();
                return;
            }
            callback(false,results);
            connection.release();
        });
    });
};