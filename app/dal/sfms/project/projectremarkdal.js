/**
 * @Author: bitzo
 * @Date: 2016/12/18 13:01
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/18 13:01
 * @Function:
 */
var db_sfms = appRequire('db/db_sfms');
var projectremarkModel = appRequire('model/sfms/project/projectremark');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');

//项目用户备注新增
exports.addRemark = function (data, callback) {
    var sql = 'insert into jit_projectremark (ProjectID, ProjectName, UserID, UserName, Remark, CreateTime, EditTime) value ',
        time = moment().format("YYYY-MM-DD HH:mm:ss");

    if (data !== undefined) {
            sql += "( " + data.projectID +",'"+data.projectName+"',"+data.userID+",'"+data.userName+"','"+data.remark+"','"+time+"','"+time+"')";
    }

    logger.writeInfo('新增项目用户备注' + sql);
    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
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

//项目用户备注编辑
exports.updateRemark = function (data, callback) {
    var sql = 'update jit_projectremark set ',
        time = moment().format("YYYY-MM-DD HH:mm:ss"),
        update = '';

    if (data !== undefined) {
        for (var key in data) {
            if (key != 'ID') {
                if (update == '')
                    update += key + " = '" + data[key] + "'";
                else update += ' and ' + key + " = '" + data[key] + "'";
            }
        }
    }
    update += " and EditTime = '" + time + "'";
    sql += update + ' where ID = ' + data.ID;

    logger.writeInfo('编辑项目用户备注' + sql);
    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '编辑失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//项目用户备注查询
exports.queryRemark = function (data, callback) {
    var sql = 'select ID,ProjectID,ProjectName,UserID,UserName,Remark,CreateTime,EditTime from jit_projectremark where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
                sql += " and " + key + " = '" + data[key] + "' ";
        }
    }

    var num = data.pageNum || 20; //每页显示的个数
    var page = data.page || 1;

    sql += " LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("项目用户备注查询：" + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '编辑失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}


//计数，统计对应数据总个数
exports.countRemark = function (data, callback) {
    var sql =  'select count(1) AS num from jit_projectremark where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
                sql += " and " + key + " = '" + data[key] + "' ";
        }
    }

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
};

//删除用户备注的项目信息
exports.countRemark = function (data, callback) {
    var sql = 'delete from jit_projectremark where ID = ' + data.ID;

    logger.writeInfo("删除备注信息: " + sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('err: '+ err);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('err: '+ err);
                callback(true, '删除失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};
