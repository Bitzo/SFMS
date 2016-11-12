/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-05 11:14:38
 */

var mysql = require('mysql');
var config = require('../config/config');

var stmsConfig=config.mysql;

stmsConfig.database = 'jit_stms';
var dbJinkeBroPool = mysql.createPool(stmsConfig);

exports.mysqlPool = dbJinkeBroPool;