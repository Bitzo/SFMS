/**
 * @Author: bitzo
 * @Date: 2016/12/1 19:37
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/1 19:37
 * @Function: 项目用户服务
 */

var projectuserDAL = appRequire('dal/sfms/project/projectuserdal.js');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目用户基本信息新增
exports.addProjectUser = function(data, callback) {
    for (var i in data) {
        data[i].duty = data[i].duty || '';
    }
    projectuserDAL.addProjectUser(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        logger.writeInfo('新增项目用户');
        callback(false, results);
    })
}

//项目用户基本信息修改
exports.updateProjectUser = function(data, callback) {
    projectuserDAL.updateProjectUser(data, function (err, results) {
        if (err) {
            callback(true, '修改失败');
            return;
        }
        logger.writeInfo('修改项目用户');
        callback(false, results);
    })
}

//项目用户信息查询
exports.queryProjectUser = function (data, callback) {
    data.IsActive = 1;
    projectuserDAL.queryProjectUser(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询项目用户');
        callback(false, results);
    })
}

//项目用户信息查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'ProjectID': data.ProjectID,
        'UserName': data.UserName,
        'IsActive': 1
    }
    projectuserDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计数据量');
        callback(false, results);
    })
}

//根据用户ID，查找所在的项目
exports.queryProjectByUserID = function (data, callback) {
    projectuserDAL.queryProjectByUserID(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询用户所在项目');
        callback(false, results);
    })
}