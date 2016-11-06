var index=require('./index');

var wechat=require('./wechat');

module.exports = function (app) {
    app.use('/', index);
    app.use('/wechat', wechat);
};
