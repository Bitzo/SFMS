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

//签到记录新增
exports.signLogInsert = function (data, callback) {
    var insert_sql = "insert into jit_signinfo set ",
        sql = '';
        // time = moment().format('YYYY-MM-DD HH:mm:ss');

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
    console.log("记录签到信息："+insert_sql);

    db_sfms.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function (err, result) {
            if (err) {
                console.log('err: '+ err);
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
    console.log(page);
    if (data !== undefined) {
        for (var key in data) {
            if(key !== 'page' && key !== 'pageNum' && data[key] !== undefined) {
                sql += "and " + key + " = '" + data[key] + "' ";
            }
        }
    }

    sql += " LIMIT " + (page-1)*num + "," + num;

    console.log("查询签到信息：" + sql);

    db_sfms.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                console.log('err: '+ err);
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
            if(data[key] !== undefined && key !== 'page' && key !== 'pageNum')
                sql += 'and ' + key + "= '" + data[key] + "' ";
        }
    }

    console.log('签到查询数据统计：' + sql);

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

    console.log('签到信息核实：' + sql);

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