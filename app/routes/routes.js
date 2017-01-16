/** 
 * @Author: snail
 * @Date:   2016-11-6 14:33:36
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-12 16:30
 * @Function 按项目划分子模块
 */
var backendRoute = appRequire('routes/backend/backendroute');
var sfmsRoute = appRequire('routes/sfms/sfmsroute');
var jinkeBroRoute = appRequire('routes/jinkebro/jinkebroroute');
var apiRoute = appRequire('routes/api/apiroute');
//微信相关
var weChatRoute = appRequire('routes/api/wechatroute');

//用来测试添加那customer的详细信息
//var customerInfo = appRequire('views/jinkeBro/wechat/customer.html')

module.exports = function(app) {
    //主站
    app.use('/', backendRoute);
    //微信相关
    app.use('/wechat', weChatRoute);
    //API相关
    app.use('/api/v1/', apiRoute);
    //实验室管理子系统
    app.use('/sfms', sfmsRoute);
    //金科小哥子系统
    app.use('/jinkeBro', jinkeBroRoute);
};