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
        logger.writeInfo('新增KPI');
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
        logger.writeInfo('修改KPI');
        callback(false, results);
    })
}

//KPI信息查询
exports.queryKPI = function (data, callback) {
    data = {
        'ID': data.ID || '',
        'ProjectID': data.ProjectID || '',
        'UserID': data.UserID || '',
        'KPIStatus': data.KPIStatus || '',
        'StartTime': data.StartTime || '',
        'EndTime': data.EndTime || '',
        'KPIType': data.KPIType || '',
        'page': data.page,
        'pageNum': data.pageNum,
        'IsActive': 1
    }
    KPIdal.queryKPI(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询KPI信息');
        callback(false, results);
    })
}

//KPI查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'ProjectID': data.ProjectID,
        'UserID': data.UserID,
        'KPIStatus': data.KPIStatus,
        'StartTime': data.StartTime,
        'EndTime': data.EndTime,
        'IsActive': 1
    }
    console.log(queryData);
    KPIdal.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计KPI数据量');
        callback(false, results);
    })
}

//KPI审核
exports.checkKPI = function (data, callback) {
    KPIdal.checkKPI(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('审核KPI');
        callback(false, results);
    })
}

//多绩效查询
exports.queryKPIForCheck = function (ID, callback) {
    if (ID.length == 0) callback(true, '数据有误');
    for (var i in ID) {
        if (ID[i] <= 0) callback(true, '数据有误');
    }
    KPIdal.queryKPIForCheck(ID, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('查询KPI审核状态');
        console.log(results)
        if (results!==undefined && results.length>0 && results.length == ID.length) {
            var t = 0;
            for (var i in results) {
                if (results[i].KPIStatus == '待审核') ++t;
            }
            if (t == results.length) callback(false, true);
            else callback(false, '有绩效信息已被审核，无需再次审核');
        } else {
            callback(false, '未查询到相关的绩效信息');
        }
    })
}