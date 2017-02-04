/**
 * @Author: bitzo
 * @Date: 2017/1/18 23:40
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/18 23:40
 * @Function:
 */

var db_backend = appRequire('db/db_backend');
var logger = appRequire('util/loghelper').helper;

exports.queryUserFunc = function (data, callback) {
    var sql = 'select ID,RoleID,jit_rolefunction.FunctionID,FunctionCode from jit_rolefunction,jit_function ' +
            'where jit_rolefunction.FunctionID = jit_function.FunctionID and jit_function.IsActive = 1 and (',
        query_sql = '',
        roleID = data.RoleID;

    if (roleID!== undefined) {
        for (var i in roleID) {
            if (query_sql.length == 0) {
                query_sql += ' RoleID = ' + roleID[i];
            } else {
                query_sql += ' or RoleID = ' + roleID[i];

            }
        }
    } else {
        return callback(true)
    }

    sql += query_sql + ')' ;

    logger.writeInfo('查询用户功能点信息' + sql);

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
            return;
        });
    });

}