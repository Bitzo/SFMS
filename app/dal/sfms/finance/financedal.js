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
    console.log('新增财务信息：' + insert_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                console.log('err: '+ err);
                callback(true, '新增失败');
                return;
            }
            callback(false, results);
            connection.release();
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
    console.log('修改财务信息：' + update_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(update_sql, function(err, results) {
            if (err) {
                console.log('err: '+ err);
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//财务查询数据量统计
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_financeinfo where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (data[key] !== undefined && key !== 'page' && key !== 'pageNum') {
                sql += 'and ' + key + "= '" + data[key] + "' ";
            }
        }
    }

    console.log('财务查询统计：' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                console.log('err: '+ err);
                callback(true, '查询失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//财务查询
exports.queryFinance = function (data, callback) {
    var sql = 'select ID,FIName,FIType,InOutType,FIPrice,ProjectId,UserID,UserName,CreateTime,OperateUser,CheckTime,CheckUser,FIStatu,Remark from jit_financeinfo where 1=1 ',
        page = data.page || 1,
        num = data.pageNum;

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] !== undefined)
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    sql += " LIMIT " + (page-1)*num + "," + num;

    console.log("查询财务信息：" + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                console.log('err: '+ err);
                callback(true, '查询失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}