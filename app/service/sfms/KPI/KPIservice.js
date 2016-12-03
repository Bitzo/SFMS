/**
 * @Author: bitzo
 * @Date: 2016/12/2 16:37
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/2 16:37
 * @Function: KPI 服务
 */

var KPIdal = appRequire('dal/sfms/KPI/KPIdal.js');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//KPI新增
exports.addKPI = function(data, callback) {
    KPIdal.addKPI(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        console.log('新增KPI');
        callback(false, results);
    })
}

//KPI基本信息修改
exports.updateKPI = function(data, callback) {
    KPIdal.updateKPI(data, function (err, results) {
        if (err) {
            callback(true, '修改失败');
            return;
        }
        console.log('修改KPI');
        callback(false, results);
    })
}

//KPI信息查询
exports.queryKPI = function (data, callback) {
    KPIdal.queryKPI(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        console.log('查询KPI信息');
        callback(false, results);
    })
}

//KPI查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'KPIName': data.KPIName,
        'KPIType': data.KPIType,
        'ProjectID': data.ProjectID,
        'UserName': data.UserName,
        'KPIStatus': data.KPIStatus,
    }
    KPIdal.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        console.log('统计KPI数据量');
        callback(false, results);
    })
}
