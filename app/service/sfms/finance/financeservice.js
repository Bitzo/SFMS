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
    financeDAL.queryFinance(data, function (err, results) {
        if (err) {
            callback(true, '查询失败');
            return;
        }
        logger.writeInfo('查询KPI信息');
        callback(false, results);
    })
}

//财务查询数据量统计
exports.countQuery = function (data, callback) {
    var queryData = {
        'FiName': data.FiName,
        'InOutType': data.InOutType,
        'ProjectID': data.ProjectID,
        'UserName': data.UserName,
        'FiStatus': data.FiStatus
    }
    financeDAL.countQuery(queryData, function (err, results) {
        if (err) {
            callback(true, '失败');
            return;
        }
        logger.writeInfo('统计KPI数据量');
        callback(false, results);
    })
}

//财务审核
exports.checkFinance = function (data, callback) {
    financeDAL.checkFinance(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('审核财务');
        callback(false, results);
    })
}