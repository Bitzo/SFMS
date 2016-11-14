var express = require('express');
var router = express.Router();

var roleroute = require('./role/roleroute');
var rolefuncroute = require('./role/rolefuncroute');

//主应用主站点
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi JinkeBro' });
});

router.use('/role', roleroute);
router.use('/rolefunc', rolefuncroute);

module.exports = router;
