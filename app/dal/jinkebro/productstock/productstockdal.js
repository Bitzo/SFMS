/**
 * @Author: luozQ
 * @Date: 16-1-4 下午18:35
 * @Last Modified by: luozQ
 * @Last Modified time: 16-1-4 下午18:28
 * @Function: 库存查询，增，删，改
 */

var logger = appRequire("util/loghelper").helper,
    db_jinkebro = appRequire('db/db_jinkebro'),
    ProStockModel = appRequire('model/jinkebro/productstock/productstockmodel');

//查询库存
exports.queryProStock= function (data, callback) {
    var sql  = "select a.ID,a.ProductID,a.TotalNum,a.StockAreaID,a.CreateUserID,c.UserName as CreateUserName,a.CreateTime,a.EditUserID,d.UserName as EditUserName,a.EditTime,b.ProductName,c.Account " +
    " from jit_productstock a " +
    " left join jit_product b on a.ProductID=b.ProductID left join " +
    " jit_backend.jit_user c on a.CreateUserID=c.AccountID " +
    " left join jit_backend.jit_user d on a.EditUserID = d.AccountID where 1=1 ";

    var queryData = {
        ProductID: data.ProductID || '',
        StockAreaID: data.StockAreaID || '',
        CreateUserID: data.CreateUserID || '',
        CreateTime: data.CreateTime || '',
        EditUserID: data.EditUserID || '',
        EditTime: data.EditTime || ''
    };

    for(var key in queryData) {
        if(queryData[key]!='')
            sql += " and a."+ key +" = '" + queryData[key]+"' ";
    }

    if (data.minTotalNum != '' && data.minTotalNum != undefined) {
        sql += " and a.TotalNum > " + data.minTotalNum + " ";
    }

    if (data.maxTotalNum != '' && data.maxTotalNum != undefined) {
        sql += " and a.TotalNum < " + data.maxTotalNum + " ";
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    sql += " LIMIT " + (page - 1) * num + "," + num + " ;";


    logger.writeInfo("根据条件查询库存:" + sql);
    console.log("根据条件查询库存:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('根据条件查询库存连接：err' + err);
            callback(true,'连接出错');
            return;
        }
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('根据条件查询库存，出错信息：' + err);
                callback(true,'系统内部错误');
                return;
            }
         
            return callback(false, results);
        });
    });
};

exports.countProStock = function (data,callback) {
    var sql = 'select count(1) as num from jit_productstock a'
        +' left join jit_product b on a.ProductID=b.ProductID'
        +' left join jit_backend.jit_user c on a.CreateUserID=c.AccountID where 1=1';

    var queryData = {
        ProductID: data.ProductID || '',
        StockAreaID: data.StockAreaID || '',
        CreateUserID: data.CreateUserID || '',
        CreateTime: data.CreateTime || '',
        EditUserID: data.EditUserID || '',
        EditTime: data.EditTime || ''
    };

    for(var key in queryData) {
        if(queryData[key]!='')
            sql += " and a."+key +" = '" + queryData[key]+"' ";
    }

    if (data.minTotalNum != '' && data.minTotalNum != undefined) {
        sql += " and a.TotalNum > " + data.minTotalNum + " ";
    }

    if (data.maxTotalNum != '' && data.maxTotalNum != undefined) {
        sql += " and a.TotalNum < " + data.maxTotalNum + " ";
    }

    logger.writeInfo("根据条件查询库存:" + sql);
    console.log('查询库存的个数:' + sql);
    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('根据条件查询库存连接：err' + err);
            callback(true,'连接出错');
            return;
        }
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('根据条件查询库存，出错信息：' + err);
                callback(true,'系统内部错误');
                return;
            }

            return callback(false, results);
        });
    });
};

//新增库存信息
exports.insert = function (data, callback) {
    var insert_sql = 'insert into `jit_productstock` set ?';

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('新增库存信息连接：err' + err);
            callback(true,'连接出错');
            return;
        }
        logger.writeInfo('新增库存信息' + insert_sql);
        connection.query(insert_sql, data, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('新增库存信息，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }

            callback(false, results);
            return;
        });
    });
};

//修改库存信息
exports.update = function (data, callback) {
    var updData = {
        'TotalNum': data.TotalNum,
        'StockAreaID': data.StockAreaID,
        'EditUserID': data.EditUserID,
        'EditTime': data.EditTime

    };

    var upd_sql = 'update jit_productstock set ';
    var sql = '';
    if (updData !== undefined) {
        for (var key in updData) {
            if (updData[key] != '' && key != undefined && updData[key] != undefined) {
                if (sql.length == 0) {
                    sql += " " + key + " = '" + updData[key] + "' ";
                } else {
                    sql += ", " + key + " = '" + updData[key] + "' ";
                }
            }
        }
    }
    upd_sql += sql;
    upd_sql += " WHERE ProductID = " + data['ProductID'];

    logger.writeInfo("修改库存信息: " + upd_sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('修改库存信息连接：err' + err);
            callback(true);
            return;
        }

        connection.query(upd_sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('修改库存信息，出错信息：' + err)
                callback(true);
                return;
            }

            callback(false, results);
            return;
        });
    });
};

//删除库存信息
exports.delete = function (data, callback) {
    var del_sql = 'delete from `jit_productstock` where ID=';

    del_sql += data.ID;

    logger.writeInfo("删除库存信息: " + del_sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(del_sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError('删除库存信息，出错信息：' + err)
                return;
            }

            callback(false, results);
            return ;
        });
    });
};