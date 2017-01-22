/**
 * @Author: Duncan
 * @Date: 2017/1/21 21:23
 * @Last Modified by: Duncan
 * @Last Modified time: 
 * @Function: 加入那个orderdelivery的表
 */

var db_jinkebro = appRequire('db/db_jinkebro'),
    orderdelivery = appRequire('model/jinkebro/orderdelivery/orderdeliverymodel'),
    logger = appRequire('util/loghelper').helper,
    moment = require('moment'); 
	 
/**
 * @param {Object} data
 * @param {function} callback
 * function: 订单的配送员分配
 */
exports.insertOrderDelivery = function (data, callback) {
    var sql = 'INSERT INTO jit_orderdelivery SET ';
    for (var key in data) {
        sql += key + ' = ' + data.key + ' ';
    }

    logger.writeInfo('[dal/jinkebro/orderdelivery]商品配送的员新增');

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError("[dal/jinkebro/customer/customerdal]数据库的链接失败");
            return;
        }
        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                logger.writeError("[dal/jinkebro/customer/customerdal]订单的配送员的插入的时候失败");
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });
}

/**
 * @function: 订单配送员表的查询工作
 */
exports.queryOrderDelivery = function (data, callback) {
    var sql = 'SELECT ID,RoleID,DeliveryUserID,DeliveryBeginTime,DeliveryEndTime FROM jit_orderdelivery where 1 = 1 ';

    for (var key in data) {
        if (key != 'num' && key != 'page')
            sql += 'and ' + key + ' = ' + data.key;
    }

    var num = data.num;
    var page = data.page;
    if (data.isPaging == 1) {
        sql += '　LIMIT　' 　+ (page - 1) * num + ',' + num + ';';
    }

    logger.writeInfo("[dal/jinkebro/orderdelivery]订单配送员查询:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });
}
	  
/**
 * function: 修改配送员
 */
exports.updateOrderDelivery = function (data, callback) {
    var upd_sql = 'UPDATE jit_orderdelivery set ';
    var i = 0;
    for (var key in data) {
        if (key != 'ID') {
            if (i == 0) {
                upd_sql += key + ' = ' + data[key] + ' ';
                i++;
            } else {
                upd_sql += ' , ' + key + ' = ' + data[key] + ' ';
            }
        }
    }

    upd_sql += 'WHERE ' + orderdelivery.PK + ' = ' + data[orderdelivery.PK] + ' ';
    console.log(upd_sql);
    logger.writeInfo('修改用户： ' + upd_sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(upd_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });
}