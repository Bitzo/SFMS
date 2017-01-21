/**
 * @Author: Duncan
 * @Date: 2017/1/21 21:23
 * @Last Modified by: Duncan
 * @Last Modified time: 
 * @Function: 加入那个orderdelivery的表
 */
 
 var db_jinkebro = appRequire('db/db_jinkebro'),
 	 orderdelivery = appRequire('model/jinkebro/orderdelivery'),
	 logger = appRequire('util/loghelper').helper,
	 moment = require ('moment'); 
	 
/**
 * @param {Object} data
 * @param {function} callback
 * function: 订单的配送员分配
 */
 exports.insertOrderDelivery = function (data, callbcak) {
	 var sql = 'INSERT INTO jit_orderdelivery SET ';
	 for (var  key in data) {
		 sql += key + ' = ' + data.key + ' ';
	 }
	 
	 logger.writeInfo('[dal/jinkebro/orderdelivery]商品配送的员新增');
 }
 
	  
 	
 