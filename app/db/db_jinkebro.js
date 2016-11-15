/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-05 11:14:38
 */

var mysql = require('mysql');
var config = appRequire('config/config');

var jinkeConfig=config.mysql;

jinkeConfig.database = 'jit_jinkebro';
var dbJinkeBroPool = mysql.createPool(jinkeConfig);

exports.mysqlPool = dbJinkeBroPool;