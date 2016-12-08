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
var logger = appRequire("util/loghelper").helper;

//查询所有角色信息
exports.queryAllRoles = function (data, callback) {
    var sql = 'select ApplicationID, RoleID, RoleCode, RoleName, IsActive from jit_role where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
            sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    sql += " LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询角色信息：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
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
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");
        logger.writeInfo(sql);

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            connection.release();
        })
    })
};

//新增角色
exports.addRole = function (data, callback) {
    var insert_sql = 'insert into jit_role set';

    var sql = '';

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

    logger.writeInfo("新增角色: " + insert_sql);

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

//修改角色基本信息
exports.updateRole = function (data, callback) {
    var sql = 'update jit_role set ';
    var update_sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (key != 'RoleID') {
                if(update_sql.length == 0) {
                    update_sql += key + " = '" + data[key] +"' ";
                } else {
                    update_sql += ", " + key + " = '" + data[key] +"' ";
                }
            }
        }
    }
    update_sql += "where RoleID = " + data['RoleID'];

    sql += update_sql;

    logger.writeInfo("修改角色: " + sql);

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
}