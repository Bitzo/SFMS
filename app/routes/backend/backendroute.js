var express = require('express');
var router = express.Router();
//log4js日志中间件
var logger = appRequire("util/loghelper").helper;
//角色模块路由
var roleroute = appRequire('routes/backend/role/roleroute');
//角色功能点路由
var rolefuncroute = appRequire('routes/backend/role/rolefuncroute');

//用户的添加以及修改的路由

var user = appRequire('routes/backend/user/userroute')
//功能点
var funcroute = appRequire('routes/backend/function/functionroute');
//用户的角色添加以及修改的路由
var userRole = appRequire('routes/backend/user/userroleroute')
//菜单新增
var addMenu = appRequire('routes/backend/menu/addmenu');
//查询所有菜单
var queryAllMenus = appRequire('routes/backend/menu/queryallmenus');
//菜单编辑
var updateMenu = appRequire('routes/backend/menu/updatemenu');
//删除菜单
var deleteMenu = appRequire('routes/backend/menu/deletemenu');
//通过UserID查询菜单
var queryMenuByUserID = appRequire('routes/backend/menu/querymenubyuserid');
//通过UserID查询角色
var queryRoleByUserID = appRequire('routes/backend/menu/queryrolebyuserid');

var userService = appRequire('service/backend/user/userservice');
var jwtHelper = appRequire('util/jwthelper');

var addapp = appRequire('routes/backend/application/addapp');
var updateapp = appRequire('routes/backend/application/updateapp');
var showapp = appRequire('routes/backend/application/showapp');
//验证码
var code = appRequire('service/backend/code/codeservice').generateCode;
//主应用主站点
router.get('/', function (req, res, next) {
  logger.writeInfo("首页记录");
  res.render('login', {
    title: 'JIT1320管理集成平台'
  });
});

//生成验证码
router.get('/generatecode', code);

//用户登录
router.post('/login', function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';
  var code = req.body.code || '';
  console.log("username:" + username);
  console.log("password:" + password);
  console.log("code:" + code);
  console.log("session下的验证码" + req.session.code);
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
    "password": password,
    "code":code
  };

  userService.login(data, function (err, user) {
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


//菜单新增
router.use('/addmenu', addMenu);
//查询所有菜单
router.use('/querymenus', queryAllMenus);
//菜单编辑
router.use('/updatemenu', updateMenu);
//删除菜单
router.use('/deletemenu', deleteMenu);
//通过UserID查询菜单
router.use('/querymenubyuserid', queryMenuByUserID);
//通过UserID查询角色
router.use('/queryrolebyuserid', queryRoleByUserID);

//角色模块
router.use('/role', roleroute);
//角色功能点模块
router.use('/rolefunc', rolefuncroute);
//管理功能点
router.use('/function', funcroute);
router.use('/user', user1);
router.use('/userrole', userRole);
router.use('/app', addapp);
router.use('/app', updateapp);
router.use('/app', showapp);

module.exports = router;