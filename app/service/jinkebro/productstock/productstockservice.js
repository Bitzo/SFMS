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
}

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
    proStockDAL.queryProStock(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        callback(false, results);
        return;
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
    console.log(productID);
    var getUrl = config.jinkebro.baseUrl + config.jinkebro.productstock + '?ProductID=' + productID;
    console.log("库存的获取数量的url" + getUrl);
    http.get(getUrl, function (res) {
        var datas = [];
        var size = 0;
        res.on('data', function (data) {
            datas.push(data);
            size += data.length;
        });
        res.on('end', function () {
            var buff = Buffer.concat(datas, size);
            var result = JSON.parse(buff);

            if (callback && typeof (callback) === 'function') {
                callback(result);
                console.log(result);
                return;
            }
        }).on('error', function (e) {
            logger.writeError()
            console.log("通过http.get来获取http失败");
            return;
        });
    });
    return;
}

//通过http put来修改商品的已减少的库存量
ProStock.prototype.updateStockInfo = function (data, callback) {
    console.log("数量为：" + data.TotalNum);
    var me = this;
    var putUrl = config.jinkebro.baseUrl + config.jinkebro.productstock;
    me.getStockInfo(data.ProductID, function (queryInfo) {
        queryInfo.data[0].TotalNum = data.TotalNum;
        var body = queryInfo.data[0];
        var bodyString = JSON.stringify(body);
            
        //头文件
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': bodyString.length
        };

        var options = {
            host: config.jinkebro.host,
            port: '80',
            path: putUrl,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(bodyString)
            }
        };
        var put_req = http.request(options, function (res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                callback(chunk);
                return;
            })
        });

        put_req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            callback(e.message);
            return;
        });

        put_req.write(bodyString);
        put_req.end();
        return;
    });

}
module.exports = new ProStock();