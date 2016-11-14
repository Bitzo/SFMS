var express = require('express');
var router = express.Router();

var roleroute = require('./role/roleroute');
var rolefuncroute = require('./role/rolefuncroute');

var userService = appRequire('service/backend/userservice');
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

router.use('/role', roleroute);
router.use('/rolefunc', rolefuncroute);

module.exports = router;