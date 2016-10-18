var logger = require('morgan');
var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var accessLog = fs.createWriteStream('access.log', { flags: 'a' });

app.set('port', process.env.PORT || 80);

//模板引擎Jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(logger({ stream: accessLog }));

//用req.body.xx去解析form表单中字段
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
}));


//静态资源文件
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
