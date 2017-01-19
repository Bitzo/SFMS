/**
 * @Author: Spring
 * @Date:   2016-11-14 18:42:38
 * @Last Modified by:
 * @Last Modified time:
 * @Function: 应用模块
 */

var db_backend= appRequire('db/db_backend');
var applicationMode = appRequire('model/backend/application/applicationmodel');
var logger = appRequire('util/loghelper').helper;
var config = appRequire('config/config');

//查询目前所有应用
exports.queryAllApp = function (data, callback) {
    var query_sql = 'select ID,ApplicationCode,ApplicationName,Memo,IsActive from jit_application where 1=1';

    if (data !== undefined) {
        for (var key in data) {
            if (key != 'page' && key != 'pageNum' && data[key] != '' && key != 'SelectType') {
                query_sql += ' and ' + key + " = '" + data[key] + "' ";
            }
        }
    }

    var num = data.pageNum || config.pageCount,
        page = data.page || 1;
    if (data.SelectType !== '' && data.SelectType === '1') query_sql += " order by IsActive desc ";
        else  query_sql += " order by IsActive desc limit " + (page-1)*num + " , " + num;
    logger.writeInfo("查询所有应用" + query_sql);

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
            return ;
        });
    });
};

//计数
exports.countAllapps = function (data, callback) {
    var sql =  'select count(1) AS num from jit_application where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && key != 'SelectType' && data[key] != '')
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };

            callback(false, results);
            connection.release();
            return ;
        })
    })
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
    logger.writeInfo("新增应用: " + insert_sql)

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
            callback(false, results);
            connection.release();
            return ;
        });
    });
};

//编辑应用
exports.update = function (data, callback) {
    var upd_sql = 'update jit_application set ';
    var upd_sql_length = upd_sql.length;
    if (data !== undefined) {
        for (var key in data) {
            if (key != 'ID') {
                if (upd_sql.length == upd_sql_length) {
                    upd_sql += key + " = '" + data[key] + "' ";
                } else {
                    upd_sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    upd_sql += " WHERE " + applicationMode.PK + " = '" + data[applicationMode.PK] + "'";

    logger.writeInfo("修改应用: " + upd_sql)

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(upd_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return ;
        });
    });
};

//删除应用
exports.delete = function (data, callback) {
    var del_sql = 'delete from jit_application where 1=1 ';
    if (data !== undefined) {
        del_sql += 'and ID = ' + data['ID'];
    }

    logger.writeInfo("删除用户" + del_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(del_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return ;
        });
    });
};