/**
 * @Author: bitzo
 * @Date: 2016/12/1 19:38
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/1 19:38
 * @Function:
 */
var db_sfms = appRequire('db/db_sfms');
var projectModel = appRequire('model/sfms/project/projectuser');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');

//项目用户新增
exports.addProjectUser = function (data, callback) {
    var insert_sql = 'insert into jit_projectruser set ',
        sql = '',
        time = moment().format('YYYY-MM-DD HH:mm:ss');

    data.CreateTime = time;
    data.EditTime = time;

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
    logger.writeInfo('新增项目用户' + insert_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '新增失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//项目用户信息修改
exports.updateProjectUser = function (data, callback) {
    var sql = 'update jit_projectruser set',
        update_sql = '',
        time = moment().format('YYYY-MM-DD HH:mm:ss');

    data.EditTime = time;

    if (data !== undefined) {
        for (var key in data) {
            if (key != 'ID') {
                if(update_sql.length == 0) {
                    update_sql += ' ' + key + " = '" + data[key] +"'";
                } else {
                    update_sql += ", " + key + " = '" + data[key] +"'";
                }
            }
        }
    }
    sql += update_sql;
    sql += ' where ID = ' + data.ID;
    logger.writeInfo('更新项目基本信息' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//项目用户信息查询
exports.queryProjectUser = function (data, callback) {
    var sql = 'select ID,ProjectName,ProjectID,UserID,UserName,CreateTime,OperateUser,EditTime,EditName,Duty,IsActive from jit_projectruser where 1=1 ',
        page = data.page,
        num = data.pageNum;

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] !== undefined) {
                sql += "and " + key + "= '" + data[key] + "' ";
            }
        }
    }
    sql += " limit " + (page-1)*num + "," + num;

    logger.writeInfo("查询项目用户信息： " + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '查询失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//项目用户信息统计
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_projectruser where 1=1 ';

    if (data !== undefined) {
        for(var key in data) {
            if(data[key] !== undefined && key !== 'page' && key !== 'pageNum')
                sql += 'and ' + key + "= '" + data[key] + "' ";
        }
    }

    logger.writeInfo('项目用户信息数据统计：' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}