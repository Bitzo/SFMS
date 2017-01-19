/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:53
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:53
 * @Function: 项目新增
 */
var db_sfms = appRequire('db/db_sfms');
var projectModel = appRequire('model/sfms/project/projectbaseinfo');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');

//项目新增
exports.addProject = function (data, callback) {
    var insert_sql = 'insert into jit_projectbaseinfo set',
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        sql = '';

    data.EditTime = time;
    data.CreateTime = time;

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
    logger.writeInfo('新增项目：' + insert_sql);

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

//项目修改
exports.updateProject = function (data, callback) {
    var sql = 'update jit_projectbaseinfo set',
        update_sql = '';
    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'ID'&&data[key]!=='') {
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
    logger.writeInfo('更新项目基本信息：' + sql);

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

//统计数据量
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_projectbaseinfo where 1=1 ';

    if (data !== undefined) {
        for(var key in data) {
            if(data[key] !== '' && key !== 'CreateTime' && key !== 'ProjectEndTime')
                sql += 'and ' + key + "= '" + data[key] + "' ";
        }
    }
    if (data.CreateTime !== '') sql += " and CreateTime > '" + data.CreateTime + "' ";
    if (data.ProjectEndTime !== '') sql += " and ProjectEndTime < '" + data.ProjectEndTime + "' ";

    logger.writeInfo('项目信息数据统计：' + sql);

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
//查询项目信息
exports.queryProject = function (data, callback) {
    var sql = 'select ID,ProjectName,ProjectDesc,ProjectManageID,ProjectManageName,ProjectEndTime,' +
            'ProjectTimeLine,CreateTime,OperateUser,EditTime,EditUser,ProjectStatus,ProjectPrice,IsActive ' +
            'from jit_projectbaseinfo where 1=1 ',
        page = data.page || 1,
        num = data.pageNum || 20;

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] !== '' && key !== 'CreateTime' && key !== 'ProjectEndTime' && key !== 'SelectType')
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    if (data.CreateTime !== '') sql += " and CreateTime > '" + data.CreateTime + "' ";
    if (data.ProjectEndTime !== '') sql += " and ProjectEndTime < '" + data.ProjectEndTime + "' ";

    if (data.SelectType !== '' && data.SelectType === '1') sql += "order by IsActive desc";
    else sql += "order by IsActive desc LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询项目信息：" + sql);

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