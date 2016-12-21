/**
 * @Author: bitzo
 * @Date: 2016/12/2 16:44
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/2 16:44
 * @Function: KPI 管理模块
 */
var db_sfms = appRequire('db/db_sfms');
var KPIModel = appRequire('model/sfms/KPI/KPI');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');

//KPI新增
exports.addKPI = function (data, callback) {
    var insert_sql = 'insert into jit_kpiinfo set',
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        sql = '';

    data.CreateTime = time;

    if (data !== undefined) {
        for (var key in data) {
            if (sql.length == 0) {
                sql += ' ' + key + " = '" + data[key] + "' ";
            } else {
                sql += ", " + key + " = '" + data[key] + "' ";
            }
        }
    }
    insert_sql += sql;

    logger.writeInfo('新增KPI：' + insert_sql);

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

//KPI编辑
exports.updateKPI = function (data, callback) {
    var update_sql = 'update jit_kpiinfo set',
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        sql = '';

    data.CreateTime = time;

    if (data !== undefined) {
        for (var key in data) {
            if (key != 'ID') {
                if (sql.length == 0) {
                    sql += ' ' + key + " = '" + data[key] + "' ";
                } else {
                    sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }
    update_sql += sql;
    update_sql += 'where ID = ' + data.ID;
    logger.writeInfo('修改KPI：' + update_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(update_sql, function(err, results) {
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

//KPI查询数据量统计
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_kpiinfo where 1=1 ';
    if (data !== undefined) {
        for (var key in data) {
            if (data[key] != '' && data[key] !== undefined && key != 'StartTime' && key != 'EndTime') {
                sql += 'and ' + key + "= '" + data[key] + "' ";
            }
        }
    }
    if (data.StartTime != '') sql += "and CreateTime > '" + data.StartTime + "' ";
    if (data.EndTime != '') sql += "and CreateTime < '" + data.EndTime + "' ";

    logger.writeInfo('KPI查询统计：' + sql);

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

//KPI查询
exports.queryKPI = function (data, callback) {
    var sql = 'select jit_kpiinfo.ID,KPIName,KPIType,KPIScore,ProjectID,projectName,UserID,UserName,jit_kpiinfo.CreateTime,jit_kpiinfo.OperateUser,CheckTime,CheckUser,KPIStatus,Remark from jit_kpiinfo,jit_projectbaseinfo where 1=1 and jit_kpiinfo.IsActive = 1 and jit_kpiinfo.projectID = jit_projectbaseinfo.ID ',
        page = data.page || 1,
        num = data.pageNum || config.pageCount;

    if (data !== undefined) {
        for (var key in data) {
            if ( key !== 'page' && key !== 'pageNum' && data[key] != '' && key != 'StartTime' && key != 'EndTime' )
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }
    console.log(data)

    if (data.StartTime != '') sql += "and jit_kpiinfo.CreateTime > '" + data.StartTime + "' ";
    if (data.EndTime != '') sql += "and jit_kpiinfo.CreateTime < '" + data.EndTime + "' ";

    sql += " LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询KPI信息：" + sql);

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

//KPI审核
exports.checkKPI = function (data, callback) {
    var time = moment().format('YYYY-MM-DD HH:mm:ss'),
        sql = '';

    for(var i in data) {
        sql += 'update jit_kpiinfo set';
        var update_sql = '';
        for(var key in data[i]) {
            if(key != 'ID') {
                if(update_sql.length == 0) {
                    update_sql += ' ' + key + " = '" + data[i][key] +"'";
                } else {
                    update_sql += ", " + key + " = '" + data[i][key] +"'";
                }
            }
        }
        sql += update_sql + ", CheckTime = '" + time + "'";
        sql += ' where ID = ' + data[i].ID;
        sql += ';'
    }

    logger.writeInfo('审核KPI： ' + sql);

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
            var status = [];
            logger.writeInfo(data);
            if (results.length > 1) {
                for(var i in results) {
                    status[i] = {};
                    status[i].ID = data[i].ID;
                    status[i].isSuccess = results[i].affectedRows?true:false;
                }
            } else {
                status[0] = {};
                status[0].ID = data[0].ID;
                status[0].isSuccess = results.affectedRows?true:false;
            }
            callback(false, status);
            connection.release();
        });
    });
}

exports.queryKPIForCheck = function (ID, callback) {
    var sql = 'select KPIStatus from jit_kpiinfo where 1=0'

    for (var i in ID) {
        sql += ' or ID = ' + ID[i];
    }

    logger.writeInfo('查询FOR绩效审核：'+ sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }
        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '修改失败 ');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}