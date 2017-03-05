/**
 * @Author: luozQ
 * @Date: 16-1-4 下午19:15
 * @Last Modified by: luozQ
 * @Last Modified time: 16-1-4 下午20:00
 * @Function: 库存查询，增，删，改
 */

var proStockDAL = appRequire('dal/jinkebro/productstock/productstockdal'),
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    logModel = appRequire('model/jinkebro/log/logmodel'),
    config = appRequire('config/config'),
    logger = appRequire("util/loghelper").helper,
    http = require('http'),
    validator = require('validator'),
    dataCheck = appRequire('util/dataverify');

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
        isPaging : data.isPaging || 0,
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

        return callback(false, results);
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
            return callback(true, results);
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

        return callback(false, results);
    });
};

//修改库存信息
ProStock.prototype.update = function (data, callback) {
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.productStock.productStockUpd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.productStock.productStockUpd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.productStock.productStockUpd.identifier;
    logModel.CreateUserID = data.EditUserID || 0;  //0代表系统管理员操作

    var formdata = {
        'ProductID': data.ProductID,
        'TotalNum': data.TotalNum,
        'StockAreaID': data.StockAreaID,
        'EditUserID': data.EditUserID,
        'EditTime': data.EditTime
    };

    var returnResult = {
        "msg": "参数不能为空!"
    };

    var indispensableKeyArr = [
        formdata.ProductID,
        formdata.TotalNum,
        formdata.StockAreaID
    ];

    var indispensableValueArr = [
        '商品编号',
        '库存数量',
        '库存区域编号'
    ];

    var undefinedCheck = dataCheck.isUndefinedArray(indispensableKeyArr,indispensableValueArr);
    if (!(undefinedCheck.isRight)) {
        returnResult.msg = undefinedCheck.msg;
        return callback(false,returnResult);
    }

    var shouldBeNumericKeyArr = [
        formdata.ProductID,
        formdata.TotalNum,
        formdata.StockAreaID
    ];

    var shouldBeNumericValueArr = [
        '商品编号',
        '库存数量',
        '库存区域编号'
    ];

    var shouldBeNumeric = dataCheck.isNumericArray(shouldBeNumericKeyArr,shouldBeNumericValueArr);
    if (!(shouldBeNumeric.isRight)) {
        returnResult.msg = shouldBeNumeric.msg;
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.TotalNum).toString(),{min:1,max:11}))) {
        returnResult.msg = '商品库存长度应该小于12位！';
        return callback(false,returnResult);
    }

    proStockDAL.update(data, function (err, results) {
        if (err) {

            logModel.Type = operationConfig.operationType.error;
            logModel.Memo = "库存修改失败";

            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("库存修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            return callback(true,'服务器内部错误，库存修改失败');
        }

        logModel.Type = operationConfig.operationType.operation;
        logModel.Memo = "库存修改成功";

        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("库存修改成功，生成操作日志失败" + logModel.CreateTime);
            }
        });

        logger.writeInfo('库存修改成功');

        return callback(false, results);
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
            logger.writeError('生成操作日志异常' + new Date()+"\n\r"+JSON.stringify(err));
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