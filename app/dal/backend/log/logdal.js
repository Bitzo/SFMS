/**
 * @Author: snail
 * @Date:   2016-12-03 
 * @Last Modified by:   
 * @Last Modified time: 
 *  @Function: 操作日志
 */
var operationLogModel = appRequire('model/backend/log/logmodel');
var db_backend = appRequire('db/db_backend');

var logger = appRequire('util/loghelper').helper;

//插入一条操作日志
exports.insertBizLog = function(data, callback) {
    var insert_sql = 'insert into jit_operationlog set';

    var i = 0;
    for (var key in data) {
        if (i == 0) {
            insert_sql += " " + key + " = " + " '" + data[key] + "' ";
            i++;
        } else {
            insert_sql += ", " + key + " = " + " '" + data[key] + "' ";
        }
    }

    logger.writeInfo("新增日志:" + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                callback(true,results);
                return;
            }

            callback(false, results);
            connection.release();
        });
    });
};