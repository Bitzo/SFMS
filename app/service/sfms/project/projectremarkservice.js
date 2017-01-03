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
var config = appRequire('config/config');

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

//项目用户备注信息查询
exports.queryRemark = function(data, callback) {
    data = {
        'jit_projectremark.ID': data.ID || '',
        'projectID': data.projectID || '',
        'userID': data.userID || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || config.pageCount
    }
    projectremarkDAL.queryRemark(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询项目用户备注');
        callback(false, results);
    })
}

//项目用户备注信息查询统计
exports.countRemark = function (data, callback) {
    data = {
        'userID': data.userID || '',
        'jit_projectremark.ID': data.ID || '',
        'projectID': data.projectID || ''
    }
    projectremarkDAL.countRemark(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('查询项目用户备注数量');
        callback(false, results);
    })
}

//项目用户备注信息删除
exports.delRemark = function (data, callback) {
    projectremarkDAL.delRemark(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('查询项目用户备注删除');
        callback(false, results);
    })
}