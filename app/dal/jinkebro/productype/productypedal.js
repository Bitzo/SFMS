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
exports.countAllProType = function (data, callback) {
    // data like this
    // { ID: '', ProductTypeName: '' }

    var sql = 'select count(1) as num from jit_productype where 1=1';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '' && key !== 'isPaging') {
                //判断data[key]是否是数值类型
                if (!isNaN(data[key])) {
                    sql += ' and ' + key + ' = ' + data[key] + ' ';
                } else {
                    sql += ' and ' + key + ' = "' + data[key] + '" ';
                }
            }
        }
    }

    logger.writeInfo("得到所有产品类别得到所有产品类别的个数:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('产品类别连接：err' + err);
            callback(true,'系统内部错误');
            return;
        }
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('得到产品类别，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }

            callback(false, results);
            return ;
        });
    });
};

//得到所有产品类别的个数
exports.queryAllProType = function (data, callback) {
    // data like this
    // { ID: '', ProductTypeName: '' }
    var queryData = {
        ID: data.ID,
        ProductTypeName: data.ProductTypeName,
    };

    var sql = 'select ID,ProductTypeName from jit_productype where 1=1 ';

    if (queryData !== undefined) {
        for (var key in queryData) {
            if (queryData[key] != '' && key != undefined) {
                //判断data[key]是否是数值类型
                if (!isNaN(queryData[key])) {
                    sql += ' and ' + key + ' = ' + queryData[key] + ' ';
                } else {
                    sql += ' and ' + key + ' = "' + queryData[key] + '" ';
                }
            }
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    sql += ' order by jit_productype.ID desc ';

    if (data['isPaging'] == 0) {
        sql += " LIMIT " + (page - 1) * num + "," + num + " ;";
    } else {
        sql += ';';
    }

    logger.writeInfo("得到所有产品类别得到所有产品类别:" + sql);
    console.log("得到所有产品类别得到所有产品类别:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('产品类别连接：err' + err);
            callback(true,'系统内部错误');
            return;
        }
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError('得到产品类别，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }

            callback(false, results);
            return ;
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
            connection.release();
            if (err) {
                logger.writeError('新增产品类别，出错信息：' + err)
                callback(true,'系统内部错误');
                return;
            }

            callback(false, results);
            return;
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
            connection.release();
            if (err) {
                logger.writeError('修改产品类别，出错信息：' + err)
                callback(true);
                return;
            }

            callback(false, results);
            return;
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
            return;
        }

        connection.query(del_sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true,'系统内部错误');
                logger.writeError('删除产品类别，出错信息：' + err)
                return;
            }
            callback(false, results);
            return ;
        });
    });
};