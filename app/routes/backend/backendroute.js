var express = require('express');
var router = express.Router();

var roleroute = appRequire('routes/backend/role/roleroute');
var rolefuncroute = appRequire('routes/backend/role/rolefuncroute');
var userroute=appRequire('routes/backend/user/userroute')
var funcroute=appRequire('routes/backend/function/functionroute');
var userroleroute=appRequire('routes/backend/user/userroleroute')
var addMenu = appRequire('routes/backend/menu/addmenu');
var queryAllMenus = appRequire('routes/backend/menu/queryallmenus');
var updateMenu = appRequire('routes/backend/menu/updatemenu');

var queryMenuByUserID = appRequire('routes/backend/menu/querymenubyuserid');
var queryRoleByUserID = appRequire('routes/backend/menu/queryrolebyuserid');

var userService = appRequire('service/backend/user/userservice');
var jwtHelper=appRequire('util/jwthelper');

var addapp = appRequire('routes/backend/application/addapp');
var updateapp = appRequire('routes/backend/application/updateapp');
var showapp = appRequire('routes/backend/application/showapp');


//主应用主站点
router.get('/', function(req, res, next) {

  res.render('login', { title: 'Hi login' });

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
router.use('/querymenus',queryAllMenus);
router.use('/updatemenu',updateMenu);

router.use('/querymenubyuserid',queryMenuByUserID);
router.use('/queryrolebyuserid',queryRoleByUserID);

router.use('/role', roleroute);
router.use('/rolefunc', rolefuncroute);
router.use('/function',funcroute);
router.use('/user',userroute);
router.use('/userrole',userroleroute);
router.use('/app', addapp);
router.use('/app', updateapp);
router.use('/app', showapp);

module.exports = router;

