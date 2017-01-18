/**
 * @Author: snail
 * @Date:   2016-12-03 
 * @Last Modified by:   
 * @Last Modified time: 
 *  @Function: 操作日志
 */
var operationLogModel = appRequire('model/backend/log/logmodel');
var db_backend = appRequire('db/db_backend');

var logger = appRequire('util/loghelper').helper;

//插入一条操作日志
exports.insertBizLog = function(data, callback) {
    var insert_sql = 'insert into jit_operationlog set';

    var i = 0;
    for (var key in data) {
        if (i == 0) {
            insert_sql += " " + key + " = " + " '" + data[key] + "' ";
            i++;
        } else {
            insert_sql += ", " + key + " = " + " '" + data[key] + "' ";
        }
    }

    logger.writeInfo("新增日志:" + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                callback(true,results);
                return;
            }

            callback(false, results);
            connection.release();
        });
    });
};

//日志查询
exports.queryLog = function(data, callback) {
    var sql = 'select ID,ApplicationName,OperationName,OldValue,OperationUrl,NewValue,Action,Type,ObjName,' +
        'Identifier,CmdStr,Memo,CreateTime,CreateUserID,PDate from jit_operationlog where 1=1 ',
        sort = data.sort || 'ID',
        page = data.page > 0 ? data.page : 1,
        num = data.pageNum,
        sortDirection = data.sortDirection || 'asc';

    if (data !== undefined) {
        for (var key in data) {
            if(key !== 'page' && key !== 'pageNum' && key !== 'sort' && key !== 'sortDirection' && data[key] !== '' && key !== 'PDate' ) {
                sql += "and " + key + " = '" + data[key] + "' ";
            }
        }
    }

    if (data.PDate !== '') {
        sql += "and PDate = '" + data.PDate + "'";
    }

    sql += ' order by ' + sort + ' ' + sortDirection;
    sql += " LIMIT " + (page-1)*num + "," + num;
    logger.writeInfo("查询操作日志：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
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
};

//查询数据量统计
exports.countQuery = function (data, callback) {
    var sql = 'select count(1) as num from jit_operationlog where 1=1 ';

    if (data !== undefined) {
        for(var key in data) {
            if(data[key] !== '' && key !== 'page' && key !== 'pageNum' && key !== 'PDate' )
                sql += 'and ' + key + "= '" + data[key] + "' ";
        }
    }
    if (data.PDate !== '') {
        sql += "and PDate = '" + data.PDate + "'";
    }
    logger.writeInfo('操作日志查询数据统计：' + sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
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
};