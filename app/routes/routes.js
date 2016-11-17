/** 
 * @Author: snail
 * @Date:   2016-11-6 14:33:36
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-12 16:30
 * @Function 按项目划分子模块
 */
var indexRoute = appRequire('routes/index/indexroute');
var backendRoute = appRequire('routes/backend/backendroute');
var sfmsRoute = appRequire('routes/sfms/sfmsroute');
var jinkeBroRoute = appRequire('routes/jinkebro/jinkebroroute');
var aptRoute = appRequire('routes/api/apiroute');

module.exports = function(app) {

    app.use('/', backendRoute);

    //API相关
    app.use('/api', aptRoute);

    //后台首页
    app.use('/', indexRoute);

    // //实验室管理子系统
    app.use('/sfms', sfmsRoute);

    // //金科小哥子系统
    app.use('/jkbro', jinkeBroRoute);
};