/**
 * @Author: bitzo
 * @Date:   2016-11-09 10:32:38
 * @Last Modified by:
 * @Last Modified time:
 */

var db_sfms = appRequire('db/db_sfms');
var signModel = appRequire('model/sfms/sign/signmodel');
var config = appRequire('config/config');
var moment = require('moment');
var logger = appRequire("util/loghelper").helper;

//签到记录新增
exports.signLogInsert = function (data, callback) {
    var insert_sql = "insert into jit_signinfo set ",
        sql = '';

    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                logger.writeInfo(key);
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
    logger.writeInfo("记录签到信息："+insert_sql);

    db_sfms.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function (err, result) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true);
                return;
            }
            result.time = data.CreateTime;

            callback(false, result);
            connection.release();
        })
    })
};

//签到记录查询
exports.querySign = function (data, callback) {
    var sql = 'select ID,UserID,UserAgent,Longitude,Latitude,CreateTime,Remark,IP,MAC,SignType from jit_signinfo where 1=1 ',
        page = data.page > 0?data.page:1,
        num = data.pageNum;
    if (data !== undefined) {
        for (var key in data) {
            if(key !== 'page' && key !== 'pageNum' && data[key] !== '' && key !== 'startTime' && key !== 'endTime') {
                sql += "and " + key + " = '" + data[key] + "' ";
            }
        }
    }

    if (data.startTime !== '') sql += "and CreateTime >= '" + data.startTime + "' ";
    if (data.endTime !== '') sql += "and CreateTime <= '" + data.endTime + "' ";

    sql += " LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询签到信息：" + sql);

    db_sfms.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '查询失败');
                return;
            }
            callback(false, result);
            connection.release();
        })
    })
}

//查询数据量统计
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_signinfo where 1=1 ';

    if (data !== undefined) {
        for(var key in data) {
            if(data[key] !== '' && key !== 'page' && key !== 'pageNum' && key !== 'startTime' && key !== 'endTime')
                sql += 'and ' + key + "= '" + data[key] + "' ";
        }
    }

    if (data.startTime !== '') sql += "and CreateTime >= '" + data.startTime + "' ";
    if (data.endTime !== '') sql += "and CreateTime <= '" + data.endTime + "' ";

    logger.writeInfo('签到查询数据统计：' + sql);

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

//签到信息验证查询
exports.signCheck = function (data, callback) {
    var sql = 'select ID,UserID,CreateTime,SignType from jit_signinfo where ID = ( select max(ID) from jit_signinfo where 1=1';

    if(data !== undefined) {
        sql += ' and UserID = ' + data.UserID + ')';
    }

    logger.writeInfo('签到信息核实：' + sql);

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
            logger.writeInfo("查询成功");
            callback(false, results);
            connection.release();
        });
    });
}

//签到信息统计
exports.signCount = function (data, callback) {
    var sql = 'select UserID,CreateTime,SignType from jit_signinfo where 1=1';

    if (data !== undefined) {
        if (data.userID !== '') {
            sql += ' and (';
            for (var i=0;i<data.userID.length;++i) {
                if (i==0) sql += ' UserID = ' + data.userID[i];
                else sql += ' or UserID = ' + data.userID[i];
            }
            sql += ' ) '
        }
        if (data.startTime !== '') sql += " and CreateTime >= '" + data.startTime + "'";
        if (data.endTime !== '') sql += " and CreateTime <= '" + data.endTime + "'";
    }

    sql += ' order by UserID,CreateTime';

    logger.writeInfo('签到信息统计：' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                console.log('err: '+ err);
                callback(true, '失败');
                return;
            }
            console.log("查询成功");
            callback(false, results);
            connection.release();
        });
    });
}