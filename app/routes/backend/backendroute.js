var express = require('express');
var router = express.Router();
//log4js日志中间件
var logger = appRequire("util/loghelper").helper;
var config = appRequire("config/config");
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

//菜单路由
var menuRouter = appRequire('routes/backend/menu/menurouter');
//通过userID查看菜单角色路由
var userMenuRoleRouter = appRequire('routes/backend/menu/usermenurolerouter');
//数据字典路由
var datadictionaryRouter = appRequire('routes/backend/datadictionary/datadictionaryrouter');


var userService = appRequire('service/backend/user/userservice');
var jwtHelper = appRequire('util/jwthelper');
var approuter = appRequire('routes/backend/application/approuter');
//验证码
var code = appRequire('service/backend/code/codeservice').generateCode;

//主应用主站点
router.get('/', function(req, res, next) {
  res.render('login', {
    title: 'JIT1320管理集成平台'
  });
});

router.get('/index', function(req, res, next) {
  res.render('backend/index', {
    title: 'JIT1320管理集成平台'
  });
});

router.get('/index', function(req, res, next) {
        res.render('backend/index', { title: 'Hi backend' });

});

router.get('/user', function(req, res, next) {
        res.render('backend/user', { title: 'Hi backend' });

});

router.get('/role', function(req, res, next) {
        res.render('backend/role', { title: 'Hi backend' });

});

router.get('/roleAdd', function(req, res, next) {
    res.render('backend/roleAdd', { title: 'Hi backend' });

});

router.get('/roleEdit', function(req, res, next) {
    res.render('backend/roleEdit', { title: 'Hi backend' });

});

router.get('/userinfo', function(req, res, next) {
        res.render('backend/userinfo', { title: 'Hi backend' });

});

router.get('/menu', function(req, res, next) {
        res.render('backend/menu', { title: 'Hi backend' });

});

router.get('/menuinfo', function(req, res, next) {
        res.render('backend/menuinfo', { title: 'Hi backend' });

});

router.get('/menuedit', function(req, res, next) {
        res.render('backend/menuedit', { title: 'Hi backend' });

});

router.get('/application', function(req, res, next) {
        res.render('backend/application', { title: 'Hi backend' });

});

router.get('/applicationinfo', function(req, res, next) {
        res.render('backend/applicationinfo', { title: 'Hi backend' });

});

//生成验证码
router.get('/generatecode', code);

//用户登录
router.post('/login', function(req, res) {
  var resultData = {
    "data": {
      "isSuccess": false,
      "accountId": -1,
      "msg": "登录失败，请刷新后重试!"
    }
  };

  var username = req.body.username || '';
  var password = req.body.password || '';
  var code = req.body.code || '';

  //验证码判断
  if (req.session.code.toString() !== req.body.code.toString()) {
    resultData.data.isSuccess = false;
    resultData.data.msg = "验证码输入不正确!";
    return res.json(resultData);
  }

  if (username == '' || password == '') {
    res.status(401);
    resultData.data.isSuccess = false;
    resultData.data.msg = "帐号密码不能为空!";
    return res.json(resultData);
  }

  var data = {
    "account": username,
    "password": password,
  };

  userService.querySingleUser(username, password, function(err, user) {
    if (err) {
      res.status(500);
      return res.json({
        "status": 500,
        "message": "应用程序异常!",
        "error": err
      });
    }

    if (!user || user.length == 0) {
      res.status(401);
      resultData.data.msg = "帐号密码不对,请重试!";
      return res.json(resultData);
    }

    if (user.length > 0 && user[0].AccountID > 0) {
      resultData.data.isSuccess = true;
      resultData.data.accountId = user[0].AccountID;
      resultData.data.msg = "登录成功";

      return res.json(jwtHelper.genToken(resultData.data));
    }

    return res.json(resultData);
  })
});


//菜单模块
router.use('/backmenu',menuRouter);
//通过userID获取相应的菜单和角色
router.use('/usermenurole',userMenuRoleRouter);
//数据字典
router.use('/datadict',datadictionaryRouter);
//角色模块
router.use('/backrole', roleroute);
//角色功能点模块
router.use('/rolefunc', rolefuncroute);
//管理功能点
router.use('/function', funcroute);
//用户的模块
router.use('/backuser', user);
//用户添加角色模块
router.use('/userrole', userRole);
//应用功能模块
router.use('/app', approuter);

module.exports = router;