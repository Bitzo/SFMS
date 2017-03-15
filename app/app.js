require('./global_bootstrap')

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = appRequire('routes/routes');
var apiAuth = appRequire('util/validauth');
var config = appRequire('config/config');

var app = express();
//避免dot-hell
global.appRequire = function(path) {
  return require(path.resolve(__dirname, path));
}

// 设置VIEWS文件夹，__dirname是node.js里面的全局变量。取得执行js所在的路径
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//加载日志中间件，定义日志和输出级别
//app.use(logger('dev'));

//加载解析json的中间件,接受json请求 
app.use(bodyParser.json());

//加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({
  extended: false
}));

//加载解析cookie的中间件
app.use(cookieParser());

//加载session
app.use(session({
  secret: '1320Jinkbebro',
  name: 'JinKebro',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: true,
}));

//静态文件目录设置,设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.all('/*', [apiAuth]);

//路由入口
routes(app);

// 捕获404错误，并转发到错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境下的500错误处理器，将错误信息渲染error模版并显示到浏览器中
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

exports.logger = function(name) {
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
};

//端口号的设置
var  http=require('http');
http.createServer(app).listen(config.port, function () {
  console.log("Express server listening on port:"+config.port );

});

module.exports = app;