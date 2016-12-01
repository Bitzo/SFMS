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

//项目新增
exports.addProject = function (data, callback) {
    var insert_sql = 'insert into jit_projectbaseinfo set',
        time = new Date().toLocaleString(),
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
    console.log('新增项目' + insert_sql);

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

//项目修改
exports.updateProject = function (data, callback) {
    var sql = 'update jit_projectbaseinfo set',
        update_sql = '';

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
    console.log('更新项目基本信息' + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
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