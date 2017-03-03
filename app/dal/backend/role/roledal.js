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
    var sql = 'select RoleName,RoleID,ApplicationID,ApplicationName,RoleCode,jit_role.IsActive from jit_role,jit_application ' +
        'where 1=1 and jit_role.ApplicationID = jit_application.ID '

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && key !== 'SelectType' &&
                key !== 'RoleName_f' && key !== 'RoleCode_f' && data[key]!=='') {
                sql += ' and ' + key + " = '" + data[key] + "' ";
            }

            if (key === 'RoleName_f' && data[key] !== '') {
                sql += " and RoleName like '%" + data[key] + "%' ";
            }

            if (key === 'RoleCode_f' && data[key] !== '') {
                sql += " and RoleCode like '%" + data[key] + "%' ";
            }
        }
    }

    var num = data.pageNum || config.pageCount; //每页显示的个数
    var page = data.page || 1;

    if (data.SelectType !== '' && data.SelectType === '1') sql += " and jit_role.IsActive = 1 order by IsActive desc ";
    else  sql += " order by IsActive desc LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询角色信息：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            return;
        })
    })

};

//计数，统计对应数据总个数
exports.countAllRoles = function (data, callback) {
    var sql =  'select count(1) AS num from jit_role,jit_application where 1=1 and jit_role.ApplicationID = jit_application.ID';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] !== '' &&
                key !== 'RoleName_f' && key !== 'RoleCode_f' && key !== 'SelectType') {
                sql += " and " + key + " = '" + data[key] + "' ";
            }

            if (key === 'RoleName_f' && data[key] !== '') {
                sql += " and RoleName like '%" + data[key] + "%' ";
            }

            if (key === 'RoleCode_f' && data[key] !== '') {
                sql += " and RoleCode like '%" + data[key] + "%' ";
            }
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
            connection.release();
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            return;
        })
    })
};

//新增角色
exports.addRole = function (data, callback) {
    var insert_sql = 'insert into jit_role set';

    var sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (data[key]!=='')
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
            connection.release();
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            return;
        });
    });
};

//修改角色基本信息
exports.updateRole = function (data, callback) {
    var sql = 'update jit_role set ';
    var update_sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'RoleID' && data[key]!== '' && data[key]!==undefined) {
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
            connection.release();
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            return;
        });
    });
}

/**
 * 通过roleid来确定角色是否存在
 */
 
exports.queryRoleByID = function (data, callback) {
    var sql = 'select count(*) as count from jit_role where IsActive = 1';
    sql += ' and (';
    
    console.log(data);
    var RoleID = data.RoleID;
    
    for(var i in RoleID) {
        if (i == RoleID.length - 1) {
            sql += ' RoleID = ' + RoleID[i] + ' ) ';
        } else {
            sql += ' RoleID = ' + RoleID[i] + ' or ';
        }
    }
    
    logger.writeInfo('判断角色是否存在:' + sql);
    console.log(sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('角色连接：err' + err);
            callback(true);
            return;
        }
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('根据RoleID判断该功能点是否存在err:' + err);
                callback(true);
                return;
            }
            callback(false, results);
            return ;
        });
    });
}