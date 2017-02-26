/**
 * @Author: bitzo
 * @Date: 2016/12/3 20:22
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/3 20:22
 * @Function: 财务管理模块
 */
var db_sfms = appRequire('db/db_sfms');
var KPIModel = appRequire('model/sfms/KPI/KPI');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');

//财务信息新增
exports.addFinance = function (data, callback) {
    var insert_sql = 'insert into jit_financeinfo set',
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
    logger.writeInfo('新增财务信息：' + insert_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(insert_sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '新增失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}

//财务编辑
exports.updateFinance = function (data, callback) {
    var update_sql = 'update jit_financeinfo set',
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        sql = '';

    data.CreateTime = time;

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'ID') {
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
    logger.writeInfo('修改财务信息：' + update_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(update_sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}

//财务查询数据量统计
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_financeinfo,jit_projectbaseinfo ' +
        'where 1=1 and jit_projectbaseinfo.ID = jit_financeinfo.projectID and jit_projectbaseinfo.IsActive = 1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (data[key] !== '' && key !== 'startTime' && key !== 'endTime') {
                if (data[key] == "已审核") sql += 'and ( ' + key + "= '通过' or " + key + " = '不通过' ) ";
                else sql += 'and ' + key + "= '" + data[key] + "' ";
            }
        }
    }
    if (data.startTime !== '') sql += "and jit_financeinfo.CreateTime > '" + data.startTime + "' ";
    if (data.endTime !== '') sql += "and jit_financeinfo.CreateTime < '" + data.endTime + "' ";

    logger.writeInfo('财务查询统计：' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '查询失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}

//财务查询
exports.queryFinance = function (data, callback) {
    var sql = 'select jit_financeinfo.ID,FIName,FIType,InOutType,FIPrice,ProjectId,ProjectName,UserID,UserName,' +
            'jit_financeinfo.CreateTime,jit_financeinfo.OperateUser,CheckTime,CheckUser,FIStatu,Remark,' +
            'jit_financeinfo.IsActive from jit_financeinfo,jit_projectbaseinfo ' +
            'where 1=1 and jit_projectbaseinfo.ID = jit_financeinfo.ProjectID and jit_projectbaseinfo.IsActive = 1 ',
        page = data.page || 1,
        num = data.pageNum;

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] !== '' && key !== 'startTime' && key !== 'endTime') {
                if (data[key] == "已审核") sql += 'and ( ' + key + "= '通过' or " + key + " = '不通过' ) ";
                else sql += 'and ' + key + "= '" + data[key] + "' ";
            }
        }
    }
    if (data.startTime !== '') sql += "and jit_financeinfo.CreateTime > '" + data.startTime + "' ";
    if (data.endTime !== '') sql += "and jit_financeinfo.CreateTime < '" + data.endTime + "' ";

    sql += " order by jit_financeinfo.IsActive desc,FIStatu LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询财务信息：" + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '查询失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}
//财务审核
exports.checkFinance = function (data, callback) {
    var time = moment().format('YYYY-MM-DD HH:mm:ss'),
        sql = 'update jit_financeinfo set',
        update_sql = '';

    for(var key in data) {
        if(key !== 'ID') {
            if(update_sql.length == 0) {
                update_sql += ' ' + key + " = '" + data[key] +"'";
            } else {
                update_sql += ", " + key + " = '" + data[key] +"'";
            }
        }
    }
    sql += update_sql + ", CheckTime = '" + time + "'";
    sql += ' where ID = ' + data.ID;

    logger.writeInfo('审核财务： ' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}

exports.delFinance = function (data, callback) {
    var sql = 'update jit_financeinfo set IsActive = 0 ';

    if (data.ID !== '') sql += ' where ID = ' + data.ID;
    if (data.ProjectID !== '') sql += ' where ProjectID = ' + data.ProjectID;

    logger.writeInfo('逻辑删除财务： ' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}

exports.financeCount = function (data, callback) {
    var sql = 'select FIType,InOutType,sum(FIPrice) as sum from jit_financeinfo,jit_projectbaseinfo ' +
        'where jit_projectbaseinfo.IsActive = 1 and jit_financeinfo.IsActive = 1 ' +
        "and FIStatu = '通过'";

    if (data.startTime !== '') sql += " and CheckTime > '" + data.startTime + "' ";
    if (data.endTime !== '') sql += " and CheckTime < '" + data.endTime + "' ";

    sql += ' group by InOutType,FIType ';

    logger.writeInfo('财务统计： ' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
}