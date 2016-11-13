var express = require('express');
var router = express.Router();

//主应用主站点
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi JinkeBro' });
});

module.exports = router;
