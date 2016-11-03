var config = require('./config')
var app = require('./index')

var wetchatrouter=require('./wechatcheckroute');

//挂载一个新的路由模块，以后可以按功能划分路由模块，
app.use('/wechat',wetchatrouter);

app.use(require('./views/errors/404'))

// if (app.get('env') === 'development') {
//     app.use(function (err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

//记录错误日志
// app.use(function (err, req, res, next) {
//     /*
//     * 这边可以把error，存储到数据库或者文件中，以备查找
//     *一般企业会部署三套平台，（1）正式线上环境（2）线上测试环境（3）本地测试环境
//     */
    
//     //这里暂且直接打印出来
//     console.log(err.stack);
//     next(err);
// });

// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: err.stack//这里需要看下
//     });
// });

app.listen(config.port, config.host, function () {
    console.log(process);
    console.log('在端口:' + app.get('port') + '监听!');
});
          