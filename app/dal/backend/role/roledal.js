/**
 * @Author: bitzo
 * @Date: 2016/11/13 14:17
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/13 14:17
 * @Function: 角色查询
 */

var db_backend = appRequire('db/db_backend');
var roleModel = appRequire('model/backend/role/rolemodel');
var config = appRequire('config/config');

//查询所有角色信息
exports.queryAllRoles = function (data, callback) {
    var sql = 'select ApplicationID, RoleID, RoleCode, RoleName, IsActive from jit_role where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && data[key] !== undefined)
            sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    var num = config.pageCount; //每页显示的个数

    sql += " LIMIT " + (data['page']-1)*num + "," + num;

    console.log("查询角色信息：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        console.log("连接成功");

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            console.log("查询成功");
            callback(false, results);
            connection.release();
        })
    })

};

//计数，统计对应数据总个数
exports.countAllRoles = function (data, callback) {
    var sql =  'select count(1) AS num from jit_role where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && data[key] !== undefined)
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        console.log("连接成功");
        console.log(sql);

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            console.log("查询成功");
            callback(false, results);
            connection.release();
        })
    })
};

//新增角色
exports.addRole = function (data, callback) {
    var insert_sql = 'insert into jit_role set';

    var sql = '';

    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                console.log(key);
                return false;
            }
        }
        return true;
    }
    if(!checkData(data))
    {
        callback(true);
        return;
    }

    if (data !== undefined) {
        for (var key in data) {
            if (sql.length == 0) {
                sql += " " + key + " = '" + data[key] + "' ";
            } else {
                sql += ", " + key + " = '" + data[key] + "' ";
            }
        }
    }

    insert_sql += sql;

    console.log("新增角色: " + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};