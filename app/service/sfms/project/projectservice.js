/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:43
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:43
 * @Function: 项目服务
 */

var projectDAL = appRequire('dal/sfms/project/projectdal.js');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

exports.addProject = function(data, callback) {
    projectDAL.addProject(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        console.log('新增项目');
        callback(false, results);
    })
}