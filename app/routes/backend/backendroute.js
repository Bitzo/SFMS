var express = require('express');
var router = express.Router();

var roleroute = require('./role/roleroute');
var rolefuncroute = require('./role/rolefuncroute');

var funcroute=require('./function/functionroute');
//主应用主站点
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi JinkeBro' });
});

router.use('/role', roleroute);
router.use('/rolefunc', rolefuncroute);

router.use('/function',funcroute);
module.exports = router;
