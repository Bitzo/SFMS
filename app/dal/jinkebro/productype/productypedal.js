/**
 * @Author: luozQ
 * @Date: 16-12-12 下午1:17
 * @Last Modified by: luozQ
 * @Last Modified time: 16-12-12 下午1:17
 * @Function: 产品类别模块增加,更新，删除
 */
var logger = appRequire("util/loghelper").helper,
    db_jinkebro = appRequire('db/db_jinkebro'),
    productypeModel = appRequire('model/jinkebro/productype/productypemodel');

//得到所有产品类别
exports.queryAllProType = function (data, callback) {
    var sql = 'select ID,ProductTypeName from `jit_productype`';

    logger.writeInfo("得到所有产品类别得到所有产品类别:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('产品类别连接：err' + err);
            callback(true,'系统内部错误');
            return;
        }
        connection.query(sql, function (err, results) {
            if (err) {
                logger.writeError('得到产品类别，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//新增产品类别
exports.insert = function (data, callback) {
    var insert_sql = 'insert into `jit_productype` set ?';

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('产品类别新增连接：err' + err);
            callback(true,'连接失败');
            return;
        }
        logger.writeInfo('新增产品类别' + insert_sql);
        connection.query(insert_sql, data, function (err, results) {
            if (err) {
                logger.writeError('新增产品类别，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//修改产品类别
exports.update = function (data, callback) {
    var upd_sql = 'update jit_productype set ?';
    upd_sql += " WHERE " + productypeModel.PK + " = " + data[productypeModel.PK];

    logger.writeInfo("修改产品类别: " + upd_sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('产品类别修改连接：err' + err);
            callback(true);
            return;
        }

        connection.query(upd_sql, data, function (err, results) {
            if (err) {
                logger.writeError('修改产品类别，出错信息：' + err)
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};

//删除产品类别
exports.delete = function (data, callback) {
    var del_sql = 'delete from `jit_productype` where ID=';

    del_sql += data.ID;

    logger.writeInfo("删除产品类别: " + del_sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true,'连接出错');
            connection.release();
            return;
        }

        connection.query(del_sql, function (err, results) {
            if (err) {
                callback(true,'系统内部错误');
                logger.writeError('删除产品类别，出错信息：' + err)
                connection.release();
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};