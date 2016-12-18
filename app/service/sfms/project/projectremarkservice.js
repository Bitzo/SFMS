/**
 * @Author: bitzo
 * @Date: 2016/12/18 12:59
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/18 12:59
 * @Function:
 */

var projectremarkDAL = appRequire('dal/sfms/project/projectremarkdal.js');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目用户备注信息新增
exports.addRemark = function(data, callback) {
    projectremarkDAL.addRemark(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        logger.writeInfo('新增项目用户备注');
        callback(false, results);
    })
}

//项目用户备注信息编辑
exports.updateRemark = function(data, callback) {
    projectremarkDAL.updateRemark(data, function (err, results) {
        if (err) {
            callback(true, '编辑失败');
            return;
        }
        logger.writeInfo('编辑项目用户备注');
        callback(false, results);
    })
}

