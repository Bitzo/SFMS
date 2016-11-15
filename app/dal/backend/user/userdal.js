/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-05 11:14:38
 */

var db_backend = appRequire('db/db_backend');
var userModel = appRequire('model/backend/user/usermodel');

//查询目前所有用户
exports.queryAllUsers = function(data, callback) {
    var sql = 'select ApplicationID,AccountID,Account,UserName,Pwd,CollegeID,GradeYear,Phone,ClassID,Memo,CreateUserID,CreateTime,IsActive from jit_user where 1=1 ';
    var condition = '';

    if (data !== undefined) {
        for (var key in data) {
            sql += ' and ' + key + " = '" + data[key] + "' ";
        }
    }

    console.log("查询用户所有用户:" + sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//新增用户
exports.insert = function(data, callback) {
    var insert_sql = 'insert into jit_user set';
    if (data !== undefined) {
        for (var key in data) {
            if (insert_sql.length == 0) {
                insert_sql += key + " = '" + data[key] + "' ";
            } else {
                insert_sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }
    console.log("新增用户: " + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};

//修改用户
exports.update = function(data, callback) {
    var upd_sql = 'update jit_user set ';
    if (data !== undefined) {
        for (var key in data) {
            if (upd_sql.length == 0) {
                upd_sql += key + " = '" + data[key] + "' ";
            } else {
                upd_sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }
    upd_sql += " WHERE " + userModel.pk + " = " + data[userModel.pk];

    console.log("修改用户: " + upd_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(upd_sql, function(err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};

//删除用户
exports.delete = function(data, callback) {
    var del_sql = 'delete from jit_user where AccountID in ';
    del_sql += "(";
    del_sql += data.toString();
    del_sql += ")";

    console.log("删除用户: " + del_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(del_sql, function(err) {
            if (err) {
                callback(true);
                return;
            }
            callback(false);
            connection.release();
        });
    });
};