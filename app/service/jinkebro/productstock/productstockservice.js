/**
 * @Author: luozQ
 * @Date: 16-1-4 下午19:15
 * @Last Modified by: luozQ
 * @Last Modified time: 16-1-4 下午20:00
 * @Function: 库存查询，增，删，改
 */

var proStockDAL = appRequire('dal/jinkebro/productstock/productstockdal');
var moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    logModel = appRequire('model/jinkebro/log/logmodel');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;
var http = require('http');
var ProStock = function () {
    this.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
};

//查询库存信息
ProStock.prototype.queryProStock = function (data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '查询库存信息时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productStock.productStockQuery.actionName;
        logModel.Memo = '查询库存信息失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true, logModel.OperationName);
    }
    var formdata = {
        page : data.page,
        pageNum : data.pageNum,
        ProductID: data.ProductID || '',
        TotalNum : data.TotalNum || '',
        StockAreaID: data.StockAreaID || '',
        CreateUserID: data.CreateUserID || '',
        CreateTime: data.CreateTime || '',
        EditUserID: data.EditUserID || '',
        EditTime: data.EditTime || '',
        minTotalNum : data.minTotalNum || '',
        maxTotalNum : data.maxTotalNum || ''
    };

    proStockDAL.queryProStock(formdata, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }

        for (var i=0;i<results.length;i++) {
            if(results[i].CreateTime != undefined && results[i].CreateTime != '') {
                results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm:ss');
            }

            if(results[i].EditTime != undefined && results[i].EditTime != '') {
                results[i].EditTime = moment(results[i].EditTime).format('YYYY-MM-DD HH:mm:ss');
            }
        }
        callback(false, results);
        return;
    });
};

//查询库存信息
ProStock.prototype.countProStock = function (data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '查询库存信息时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productStock.productStockQuery.actionName;
        logModel.Memo = '查询库存信息失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true, logModel.OperationName);
    }
    var formdata = {
        ProductID: data.ProductID || '',
        StockAreaID: data.StockAreaID || '',
        TotalNum : data.TotalNum || '',
        CreateUserID: data.CreateUserID || '',
        CreateTime: data.CreateTime || '',
        EditUserID: data.EditUserID || '',
        EditTime: data.EditTime || '',
        minTotalNum : data.minTotalNum || '',
        maxTotalNum : data.maxTotalNum || ''
    };

    proStockDAL.countProStock(formdata, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }

        return callback(false, results);
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
        callback(true, logModel.OperationName);
        return;
    }

    proStockDAL.insert(data, function (err, results) {
        if (err) {
            logModel.OperationName = '新增库存信息失败';
            logModel.Action = operationConfig.jinkeBroApp.productStock.productStockAdd.actionName;
            logModel.Memo = '新增库存信息失败';
            logModel.Type = operationConfig.operationType.error;
            loggerWrite();
            return callback(true, logModel.OperationName);
        }
        callback(false, results);
        return;
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
        return callback(true, logModel.OperationName);
    }

    var formdata = {
        'ProductID': data.ProductID,
        'TotalNum': data.TotalNum,
        'StockAreaID': data.StockAreaID,
        'EditUserID': data.EditUserID,
        'EditTime': data.EditTime
    };

    proStockDAL.update(data, function (err, results) {
        if (err) {
            logger.writeError('修改库存信息异常:' + this.createTime);
            console.log("修改库存信息异常");
            logModel.OperationName = '修改库存信息';
            logModel.Action = operationConfig.jinkeBroApp.productStock.productStockUpd.actionName;
            logModel.Memo = '修改库存信息失败';
            logModel.Type = operationConfig.operationType.error;
            loggerWrite();
            return callback(true, logModel.OperationName);
        }
        callback(false, results);
        return;
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
        return callback(true, logModel.OperationName);
    }
    proStockDAL.delete(data, function (err, results) {
        if (err) {
            logger.writeError('删除库存信息异常:' + this.createTime);
            logModel.OperationName = '删除库存信息';
            logModel.Action = operationConfig.jinkeBroApp.productStock.productStockDel.actionName;
            logModel.Memo = '删除库存信息失败';
            logModel.Type = operationConfig.operationType.error;
            callback(true, logModel.OperationName);
            return;
        }
        logger.writeInfo('删除库存信息:' + results);
        callback(false, results);
        return;
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

//通过http get的方法来获取库存的数据,通过商品的ID来查库存
ProStock.prototype.getStockInfo = function (productID, callback) {
    
    proStockDAL.queryProStock({
        'ProductID': productID,
        'StockAreaID': '',
        'CreateUserID': '',
        'CreateTime': '',
        'EditUserID': '',
        'EditTime': ''
    }, function (err, stockInfo) {
        {
            if(err) {
                callback(true, '查询库存量失败');
                return ;
            }
            
            logger.writeInfo('[service/productstockservice -------162行]' + stockInfo);
            callback(false, stockInfo);
            return ;
        }
    });

}

/**
 * function:订单结束改变库存的量
 */
ProStock.prototype.updateStockInfo = function (data, callback) {
   proStockDAL.update(data, function (err, updateInfo) {
       if (err) {
           callback(true);
           logger.writeError('[service/jinkebro/productstockservice -----181行]' + '改变库存的时候失败')
           return ;
       }
       
       logger.writeInfo('[service/jinkebro/productstockservice-----181行 改变库存量成功]');
       callback(false, updateInfo);
   });

}
module.exports = new ProStock();