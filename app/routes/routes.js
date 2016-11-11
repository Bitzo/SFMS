/** 
 * @Author: snail
 * @Date:   2016-11-6 14:33:36
 * @Last Modified by:   
 * @Last Modified time: 
 */
var index=require('./index');

var weChat=require('./wechat');

var userApi=require('../api/userbiz');

var login=require('../api/login');
var sign=require('../api/sign');

module.exports = function (app) {
    app.use('/', index);
    app.use('/wechat', weChat);

    //API相关
    app.use('/api/user',userApi);
    app.use('/api/login',login);
    app.use('/api/sign',sign);
};
