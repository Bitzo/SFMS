/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-20 13:44:38
 *  @Function: 功能点管理
 */

var logger = appRequire("util/loghelper").helper;
var db_backend = appRequire('db/db_backend');
var functionModel = appRequire('model/backend/function/functionmodel');

//得到所有功能点
exports.queryAllFunctions = function (data, callback) {
    var sql = 'select ApplicationID,FunctionID,FunctionLevel,ParentID,FunctionCode,FunctionName,Memo,IsActive from jit_function where IsActive=1';

    sql += " and ApplicationID = " + data['ApplicationID'];

    logger.writeInfo("得到所有功能点:" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('功能点连接：err' + err);
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
            logger.writeError('功能点新增连接：err' + err);
            callback(true);
            return;
        }
        logger.writeInfo('新增功能点' + insert_sql);
        connection.query(insert_sql, data, function (err, results) {
            if (err) {
                logger.writeError('新增功能点，出错信息：' + err)
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//修改功能点
exports.update = function (data, callback) {
    var upd_sql = 'update jit_function set ?';
    upd_sql += " WHERE " + functionModel.PK + " = " + data[functionModel.PK];

    logger.writeInfo("修改功能点: " + upd_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('功能点修改连接：err' + err);
            callback(true);
            return;
        }

        connection.query(upd_sql, data, function (err, results) {
            if (err) {
                logger.writeError('修改功能点，出错信息：' + err)
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//删除功能点
exports.delete = function (data, callback) {
    var del_sql = 'update  jit_function set IsActive=0 where FunctionID=';

    del_sql += data.FunctionID;

    logger.writeInfo("删除功能点: " + del_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
            return;
        }

        connection.query(del_sql, function (err, results) {
            if (err) {
                callback(true);
                logger.writeError('删除功能点，出错信息：' + err)
                connection.release();
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//根据FunctionID判断该功能点是否存在
exports.queryFuncByID = function (data, callback) {
    var sql = 'select count(*) as count from jit_function where IsActive=1';
    sql += " and ApplicationID= " + data['ApplicationID'] + " and (";
    var FunctionID = data.FunctionID;

    for (var i in FunctionID) {
        if (i == FunctionID.length-1) {
            sql += "FunctionID=" + FunctionID[i] + " )";
        } else {
            sql += "FunctionID=" + FunctionID[i] + " or ";
        }
    }
    logger.writeInfo("判断功能点是否存在:" + sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('功能点连接：err' + err);
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