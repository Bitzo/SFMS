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
