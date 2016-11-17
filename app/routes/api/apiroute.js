/**
 * @Author: bitzo
 * @Date:   2016-11-12 09:44:26
 * @Last Modified by:
 * @Last Modified time:
 */

var express = require('express');
var router = express.Router();
var login = appRequire('api/login');
var sign = appRequire('api/sign');

router.get('/', function(req, res, next) {
    res.json({
        title: '这里是API的所有路由入口'
    });
});

router.use('/login',login);
router.use('/sign', sign);

module.exports = router;