/**
 * @Author: bitzo
 * @Date: 2016/12/3 20:19
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/3 20:19
 * @Function: 财务服务
 */

var financeDAL = appRequire('dal/sfms/finance/financedal');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//财务新增
exports.addFinance = function(data, callback) {
    financeDAL.addFinance(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        logger.writeInfo('新增财务信息');
        callback(false, results);
    })
}

//财务信息修改
exports.updateFinance = function(data, callback) {
    financeDAL.updateFinance(data, function (err, results) {
        if (err) {
            callback(true, '修改失败');
            return;
        }
        logger.writeInfo('修改财务信息');
        callback(false, results);
    })
}

//财务信息查询
exports.queryFinance = function (data, callback) {
    var queryData = {
        'jit_financeinfo.ID': data.ID || '',
        'Username': data.Username || '',
        'InOutType': data.InOutType || '',
        'FIType': data.FIType || '',
        'FIStatu': data.FIStatus || '',
        'FIName': data.FIName || '',
        'ProjectID': data.projectID || '',
        'startTime': data.startTime || '',
        'endTime': data.endTime || '',
        'page': data.page || 1,
        'pageNum': data.pageNum || 20,
    }
    financeDAL.queryFinance(queryData, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询财务信息');
        callback(false, results);
    })
}

//财务查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'jit_financeinfo.ID': data.ID,
        'Username': data.Username,
        'InOutType': data.InOutType,
        'FIType': data.FIType,
        'FIName': data.FIName,
        'FIStatu': data.FIStatus,
        'startTime': data.startTime,
        'endTime': data.endTime,
        'jit_financeinfo.IsActive': 1
    }
    financeDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计财务信息数据量');
        callback(false, results);
    })
}

//财务审核
exports.checkFinance = function (data, callback) {
    data = {
        ID: data.ID,
        FIStatu: data.FIStatu,
        CheckUser: data.CheckUser,
        Remark: data.Remark
    }
    financeDAL.checkFinance(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('审核财务');
        callback(false, results);
    })
}

//多财务查询信息
exports.queryFinanceForCheck = function (ID, callback) {
    if (ID.length == 0) callback(true, '数据有误');
    for (var i in ID) {
        if (ID[i] <= 0) callback(true, '数据有误');
    }
    financeDAL.queryFinanceForCheck(ID, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('查询财务状态');
        if (results!==undefined && results.length>0 && results.length == ID.length) {
            var t = 0;
            for (var i in results) {
                if (results[i].FIStatu == '待审核') ++t;
            }
            if (t == results.length) callback(false, true);
            else callback(false, '有财务已被审核，无需再次审核');
        } else {
            callback(false, '未查询到相关的财务信息');
        }
    })
}