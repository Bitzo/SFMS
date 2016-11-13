/**
 * @Author: bitzo
 * @Date:   2016-11-12 09:44:26
 * @Last Modified by:
 * @Last Modified time:
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json({
        title: '这里是API的所有路由入口'
    });
});

module.exports = router;