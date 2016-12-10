/**
 * @Author: Spring
 * @Date: 16-12-9 下午1:17
 * @Last Modified by: Spring
 * @Last Modified time: 16-12-9 下午1:17
 * @Function: 消费者模块增加
 */

var db_jinkebro = appRequire('db/db_jinkebro'),
    customer = appRequire('model/jinkebro/customer/customermodel');

exports.insert = function (data, callback) {
    var insert_sql = 'insert into jit_customer set ',
        insert_sql_length = insert_sql.length;
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
            callback(false, results);
            connection.release();
        });
    });
}