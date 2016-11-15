var express = require('express');
var router = express.Router();

var addMenu = appRequire('routes/backend/menu/addmenu');
var queryAllMenus = appRequire('routes/backend/menu/queryallmenus');
var updateMenu = appRequire('routes/backend/menu/updatemenu');

var roleroute = require('./role/roleroute');
var rolefuncroute = require('./role/rolefuncroute');

var userroute=require('./user/userroute')
var funcroute=require('./function/functionroute');
var userroleroute=require('./user/userroleroute')

var userService = appRequire('service/backend/user/userservice');
var jwtHelper=appRequire('util/jwthelper');

//主应用主站点
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Hi JinkeBro'
  });
});

//用户登录
router.post('/login', function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';
  console.log("username:" + username);
  console.log("password:" + password);
  if (username == '' || password == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }

  var data = {
    "username": username,
    "password": password
  };

  userService.login(data, function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        "status": 500,
        "message": "应用程序异常!",
        "error": err
      });
      return;
    }

    if (!user) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    if (user) {
      res.json(jwtHelper.genToken(user));
    }

  })
});




router.use('/addmenu',addMenu);
router.use('/queryallmenus',queryAllMenus);
router.use('/updatemenu',updateMenu);



// router.get('/addmenu',function(req,res,next) {
// 	res.json({
// 		title : 'zengjiacaidanjiemian'
// 	});
// });
module.exports = router;

router.use('/role', roleroute);
router.use('/rolefunc', rolefuncroute);
router.use('/function',funcroute);
router.use('/user',userroute);
router.use('/userrole',userroleroute);
module.exports = router;

