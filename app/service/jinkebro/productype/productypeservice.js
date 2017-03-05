/**
 * @Author: luozQ
 * @Date:   2016-12-13 上午10:17
 * @Last Modified by:luozQ
 * @Last Modified time: 2016-12-13 上午10:17
 * @Function :产品类别增，删，改
 */

var productypeDAL = appRequire('dal/jinkebro/productype/productypedal');
moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel'),
    productServ = appRequire('service/jinkebro/product/productservice');

var Productype = function() {
    this.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
}

//查询所有产品类别
Productype.prototype.queryAllProType = function(data, callback) {
    var formdata = {
        ID: data.ID || '',
        ProductTypeName: data.ProductTypeName || '',
        page: data.page || 1,
        pageNum: data.pageNum || (config.pageCount),
        isPaging: data.isPaging || 0
    };

    productypeDAL.queryAllProType(formdata, function(err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        callback(false, results);
    });
};

//查询所有产品类别
Productype.prototype.countAllProType = function(data, callback) {
    var formdata = {
        ID: data.ID || '',
        ProductTypeName: data.ProductTypeName || '',
    };

    productypeDAL.countAllProType(formdata, function(err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        callback(false, results);
    });
};


//产品类别的插入
Productype.prototype.insert = function(data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '产品类别的插入时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productType.productTypeQuery.actionName;
        logModel.Memo = '产品类别的插入失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true, logModel.OperationName);
    }

    productypeDAL.insert(data, function(err, results) {
        if (err) {
            logModel.OperationName = '产品类别的插入失败';
            logModel.Action = operationConfig.jinkeBroApp.productType.productStockAdd.actionName;
            logModel.Memo = '产品类别的插入失败';
            logModel.Type = operationConfig.operationType.error;
            loggerWrite();
            return callback(true, logModel.OperationName);
        }
        callback(false, results);
    });
};

//修改产品类别
Productype.prototype.update = function(data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '修改产品类别时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productType.productTypeUpd.actionName;
        logModel.Memo = '修改产品类别失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true, logModel.OperationName);
    }

    productypeDAL.update(data, function(err, results) {
        if (err) {
            logger.writeErr('修改产品类别异常:' + this.createTime);
            console.log("修改产品类别异常");
            logModel.OperationName = '修改产品类别';
            logModel.Action = operationConfig.jinkeBroApp.productType.productTypeUpd.actionName;
            logModel.Memo = '修改产品类别失败';
            logModel.Type = operationConfig.operationType.error;
            loggerWrite();
            return callback(true, logModel.OperationName);
        }
        callback(false, results);
    });
};

//删除产品类别
Productype.prototype.delete = function(data, callback) {
    if (!checkData(data)) {
        logModel.OperationName = '删除产品类别时,库存信息为undefined';
        logModel.Action = operationConfig.jinkeBroApp.productType.productTypeDel.actionName;
        logModel.Memo = '删除产品类别失败';
        logModel.Type = operationConfig.operationType.operation;
        loggerWrite();
        return callback(true, logModel.OperationName);
    }

    productServ.getProCountByID(data, function(err, results) {
        if (err) {
            logger.writeError('根据ID得到产品数量异常:' + this.createTime);
            logModel.OperationName = '根据ID得到产品数量异常';
            logModel.Action = operationConfig.jinkeBroApp.productType.productTypeDel.actionName;
            logModel.Memo = '根据ID得到产品数量异常失败';
            logModel.Type = operationConfig.operationType.error;
            return callback(true, logModel.OperationName);
        }
        var count = results[0]['count'];
        console.log('count:' + count)
        if (count > 0) {
            callback(true, count);
        } else {
            productypeDAL.delete(data, function(err, results) {
                if (err) {
                    logger.writeError('删除产品类别异常:' + this.createTime);
                    logModel.OperationName = '删除库存信息失败';
                    logModel.Action = operationConfig.jinkeBroApp.productType.productTypeDel.actionName;
                    logModel.Memo = '删除库存信息失败';
                    logModel.Type = operationConfig.operationType.error;
                    callback(true, logModel.OperationName);
                    return;
                }
                logger.writeInfo('删除产品类别的:' + results);
                callback(false, results);
            });
        }
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
//写入日志
function loggerWrite() {
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateUserID = 1;
    logModel.CreateTime = this.createTime;
    logModel.PDate = moment().format('YYYY-MM-DD');

    logService.insertOperationLog(logModel, function(err, insertId) {
        if (err) {
            logger.writeError('生成操作日志异常' + new Date() + "\n\r" + JSON.stringify(err));
        }
    });
}
module.exports = new Productype();