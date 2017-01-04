/**
 * @Author: luozQ
 * @Date: 16-1-4 下午19:15
 * @Last Modified by: luozQ
 * @Last Modified time: 16-1-4 下午20:00
 * @Function: 库存查询，增，删，改
 */

var proStockDAL = appRequire('dal/jinkebro/productstock/productstockdal');
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    logModel = appRequire('model/jinkebro/log/logmodel');

var ProStock = function () {
    this.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
}

//查询库存信息
ProStock.prototype.queryProStock = function (data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '查询库存信息时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productStock.productStockQuery.actionName;
        logModel.Memo = '查询库存信息失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true);
    }
    proStockDAL.queryProStock(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//新增库存信息
ProStock.prototype.insert = function (data, callback) {
    data.CreateTime = this.createTime;
    if (!checkData(data)) {
        logModel.OperationName = '新增库存信息时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productStock.productStockAdd.actionName;
        logModel.Memo = '新增库存信息失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        callback(true);
        return;
    }

    proStockDAL.insert(data, function (err, results) {
        if (err) {
            logModel.OperationName = '新增库存信息失败';
            logModel.Action = operationConfig.jinkeBroApp.productStock.productStockAdd.actionName;
            logModel.Memo = '新增库存信息失败';
            logModel.Type = operationConfig.operationType.error;
            loggerWrite();
            return callback(true);
        }
        callback(false, results);
    });
};

//修改库存信息
ProStock.prototype.update = function (data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '修改库存信息时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productStock.productStockUpd.actionName;
        logModel.Memo = '修改库存信息失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true);
    }
    proStockDAL.update(data, function (err, results) {
        if (err) {
            logger.writeError('修改库存信息异常:' + this.createTime);
            console.log("修改库存信息异常");
            logModel.OperationName = '修改库存信息';
            logModel.Action = operationConfig.jinkeBroApp.productStock.productStockUpd.actionName;
            logModel.Memo = '修改库存信息失败';
            logModel.Type = operationConfig.operationType.error;
            loggerWrite();
            return callback(true);
        }
        callback(false, results);
    });
};

//删除库存信息
ProStock.prototype.delete = function (data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '删除库存信息时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productStock.productStockDel.actionName;
        logModel.Memo = '删除库存信息失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true);
    }
    proStockDAL.delete(data, function (err, results) {
        if (err) {
            logger.writeError('删除库存信息异常:' + this.createTime);
            logModel.OperationName = '删除库存信息';
            logModel.Action = operationConfig.jinkeBroApp.productStock.productStockDel.actionName;
            logModel.Memo = '删除库存信息失败';
            logModel.Type = operationConfig.operationType.error;
            callback(true);
            return;
        }
        logger.writeInfo('删除库存信息:' + results);
        callback(false, results);
    });
};

//验证数据是否都已定义
function checkData(data) {
    for (var key in data) {
        if (data[key] === undefined) {
            console.log('data' + key);
            return false;
        }
    }
    return true;
}

function loggerWrite() {
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateUserID = 1;
    logModel.CreateTime = this.createTime;
    logModel.PDate = moment().format('YYYY-MM-DD');

    logService.insertOperationLog(logModel, function (err, insertId) {
        if (err) {
            logger.writeError('生成操作日志异常' + new Date());
        }
    });
}
module.exports = new ProStock();