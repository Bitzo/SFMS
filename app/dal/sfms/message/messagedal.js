/**
 * @Author: bitzo
 * @Date: 2017/3/30 16:07
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/3/30 16:07
 * @Function:
 */

var db_sfms = appRequire('db/db_sfms');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');

//通知新增
exports.addMessage = function (data, callback) {
    var insert_sql = 'insert into jit_message set',
        sql = '';

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
    logger.writeInfo('新增通知：' + insert_sql);

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
};

//通知修改
exports.updateMessage = function (data, callback) {
    var insert_sql = 'update jit_message set',
        sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if(data[key]!=='' && key !== 'ID') {
                if (sql.length == 0) {
                    sql += " " + key + " = '" + data[key] + "' ";
                } else {
                    sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    insert_sql += sql;

    insert_sql += "where ID = " + data['ID'];

    logger.writeInfo('修改通知：' + insert_sql);

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
                callback(true, '修改失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
};

//统计数据量
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_message where 1=1 ';

    if (data !== undefined) {
        for(var key in data) {
            if(data[key] !== '' && key !== 'startTime' && key !== 'endTime')
            {

                if(key == 'MessageTitle' || key == 'MessageContent'){
                    sql += 'and ' + key + " like '%" + data[key] + "%' ";
                }else{
                    sql += 'and ' + key + "= '" + data[key] + "' ";
                }
            }
        }
    }
    if (data.startTime !== '') sql += " and CreateTime > '" + data.startTime + "' ";
    if (data.endTime !== '') sql += " and CreateTime < '" + data.endTime + "' ";

    logger.writeInfo('项目信息数据统计：' + sql);

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
                callback(true, '失败');
                return;
            }
            callback(false, results);
            return;
        });
    });
};

exports.queryMessage = function (data, callback) {
    var sql = 'select ID,MessageTitle,MessageContent,CreateUserID,UserName,CreateTime,IsActive from jit_message where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' &&
                key !== 'startTime' && key !== 'endTime' && data[key]!=='') {

                if(key == 'MessageTitle' || key == 'MessageContent'){
                    sql += 'and ' + key + " like '%" + data[key] + "%' ";
                }else{
                    sql += 'and ' + key + "= '" + data[key] + "' ";
                }
            }
        }
    }

    if (data.startTime !== '') sql += " and CreateTime > '" + data.startTime + "' ";
    if (data.endTime !== '') sql += " and CreateTime < '" + data.endTime + "' ";

    var num = data.pageNum || config.pageCount; //每页显示的个数
    var page = data.page || 1;

    sql += " order by IsActive desc LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询通知信息：" + sql);

    db_sfms.mysqlPool.getConnection(function (err, connection) {
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