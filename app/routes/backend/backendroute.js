var express = require('express');
var router = express.Router();

var roleroute = appRequire('routes/backend/role/roleroute');
var rolefuncroute = appRequire('routes/backend/role/rolefuncroute');

var userroute=appRequire('routes/backend/user/userroute')
var funcroute=appRequire('routes/backend/function/functionroute');
var userroleroute=appRequire('routes/backend/user/userroleroute')
//主应用主站点
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi JinkeBro' });
});
router.use('/role', roleroute);
router.use('/rolefunc', rolefuncroute);
router.use('/function',funcroute);
router.use('/user',userroute);
router.use('/userrole',userroleroute);
module.exports = router;
