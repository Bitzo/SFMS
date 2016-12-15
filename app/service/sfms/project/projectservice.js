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

//项目基本信息新增
exports.addProject = function(data, callback) {
    projectDAL.addProject(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        logger.writeInfo('新增项目');
        callback(false, results);
    })
}

//项目基本信息修改
exports.updateProject = function(data, callback) {

    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                logger.writeInfo(key);
                return false;
            }
        }
        return true;
    }

    if(!checkData(data))
    {
        callback(true, '数据有误');
        return;
    }
    logger.writeInfo('修改项目');
    projectDAL.updateProject(data, function (err, results) {
        if (err) {
            callback(true, '修改失败');
            return;
        }
        logger.writeInfo('修改项目');
        callback(false, results);
    })
}

//项目信息查询-统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'ProjectName': data.ProjectName,
        'ProjectManageName': data.ProjectManageName,
        'CreateTime': data.CreateTime,
        'ProjectEndTime': data.ProjectEndTime,
    }
    projectDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计数据量');
        callback(false, results);
    })
}

//项目信息查询
exports.queryProject = function (data, callback) {
    data = {
        'ID': data.ID || '',
        'ProjectName': data.projectName || '',
        'ProjectManageName': data.projectManageName || '',
        'CreateTime': data.startTime || '',
        'ProjectEndTime': data.endTime || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || 20,
    }
    projectDAL.queryProject(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询项目信息');
        callback(false, results);
    })
}