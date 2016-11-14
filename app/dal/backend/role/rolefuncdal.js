/**
 * @Author: bitzo
 * @Date: 2016/11/13 17:07
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 17:07
 * @Function:
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