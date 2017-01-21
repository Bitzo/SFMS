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
 
	  
 	
 