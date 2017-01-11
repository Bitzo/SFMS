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
    var sql = 'select a.ID,a.ProductID,a.TotalNum,a.StockAreaID,a.CreateUserID,a.CreateTime,a.EditUserID,a.EditTime ,b.ProductName ,c.Account ,c.UserName from jit_productstock a'
              +' left join jit_product b on a.ProductID=b.ProductID'
              +' left join jit_backend.jit_user c on a.CreateUserID=c.AccountID where 1=1';

    for(var key in data)
    {
        if(data[key]!='')
            sql += " and a."+key +" = '" + data[key]+"' ";
    }

    logger.writeInfo("根据条件查询库存:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('根据条件查询库存连接：err' + err);
            callback(true,'连接出错');
            return;
        }
        connection.query(sql, function (err, results) {
            if (err) {
                logger.writeError('根据条件查询库存，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }
            callback(false, results);
            connection.release();
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
            if (err) {
                logger.writeError('新增库存信息，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//修改库存信息
exports.update = function (data, callback) {
    var upd_sql = 'update jit_productstock set ?';
    upd_sql += " WHERE " + ProStockModel.PK + " = " + data[ProStockModel.PK];

    logger.writeInfo("修改库存信息: " + upd_sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('修改库存信息连接：err' + err);
            callback(true);
            return;
        }

        connection.query(upd_sql, data, function (err, results) {
            if (err) {
                logger.writeError('修改库存信息，出错信息：' + err)
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
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
            connection.release();
            return;
        }

        connection.query(del_sql, function (err, results) {
            if (err) {
                callback(true);
                logger.writeError('删除库存信息，出错信息：' + err)
                connection.release();
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};