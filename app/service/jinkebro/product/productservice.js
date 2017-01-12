/**
 * @Author: Cecurio
 * @Date: 2016/12/14 20:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/14 20:23
 * @Function:
 */
var productDAL = appRequire('dal/jinkebro/product/productdal'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel'),
    config = appRequire('config/config'),
    operationConfig = appRequire('config/operationconfig');
var http = require('http');
var logger = appRequire('util/loghelper').helper;
var logService = appRequire('service/backend/log/logservice');
var logModel = appRequire('model/jinkebro/log/logmodel');
//日期组件
var moment = require('moment');

logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

var Product = function () {

}

//新增商品
Product.prototype.insertProduct = function (data, callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.jinkeBroApp.product.productAdd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productAdd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productAdd.identifier;
    productDAL.insertProduct(data, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.SupplierID || 0;  //0代表系统管理员操作
            logModel.Memo = "商品新增失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("商品新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'商品新增失败');
            return;
        }

        //新增成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.SupplierID || 0; //0代表系统管理员操作
        logModel.Memo = "商品新增成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品新增成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('商品新增成功');
        callback(false, result);
        return;
    });
}

//删除商品
Product.prototype.deleteProduct = function (data, callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.jinkeBroApp.product.productDel.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productDel.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productDel.identifier;
    productDAL.deleteProduct(data, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.SupplierID || 0;  //0代表系统管理员操作
            logModel.Memo = "商品删除失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("商品删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'商品删除失败');
            return;
        }

        //删除成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.SupplierID || 0; //0代表系统管理员操作
        logModel.Memo = "商品删除成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品删除成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('商品删除成功');
        callback(false, result);
        return;
    });
}

//编辑商品信息
Product.prototype.updateProduct = function (data, callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.jinkeBroApp.product.productUpd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productUpd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productUpd.identifier;
    productDAL.updateProduct(data, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.SupplierID || 0;  //0代表系统管理员操作
            logModel.Memo = "商品编辑失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("商品编辑失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'商品编辑失败');
            return;
        }

        //修改成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.SupplierID || 0; //0代表系统管理员操作
        logModel.Memo = "商品编辑成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品编辑成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('商品编辑成功');
        callback(false, result);
        return;
    });
}

//查询商品信息
Product.prototype.queryProducts = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.OperationName = operationConfig.jinkeBroApp.product.productQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productQuery.identifier;
    productDAL.queryProducts(data, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.SupplierID || 0;  //0代表系统管理员操作
            logModel.Memo = "商品查询失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("商品查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'商品查询失败');
            return;
        }

        //计算过期时间
        var tempTimeStamp, temp;
        var days = 60 * 60 * 24 * 1000;
        for (var i = 0; i < result.length; i++) {
            tempTimeStamp = (Date.parse(result[i].ExpireTime) - Date.parse(new Date())) / days;
            temp = Math.ceil(tempTimeStamp.toFixed(4));
            result[i]['remainTime'] = temp;
            result[i].ExpireTime = moment(result[i].ExpireTime).format('YYYY-MM-DD HH:mm:SS');
            result[i].ProducTime = moment(result[i].ProducTime).format('YYYY-MM-DD HH:mm:SS');
        }

        //查询成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.SupplierID || 0; //0代表系统管理员操作
        logModel.Memo = "商品查询成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('商品查询成功');
        callback(false, result);
        return;
    });
}

//查询商品信息
Product.prototype.CountProducts = function (data, callback) {

    productDAL.CountProducts(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
        return;
    });
}

//根据商品类型ID得到该商品类型下商品的个数
Product.prototype.getProCountByID = function (data, callback) {
    if (data == undefined || data.ID == '') {
        callback(true);
        return;
    }
    productDAL.getProCountByID(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, result);
        return;
    });
}

//通过http的get方法直接获取信息
Product.prototype.getProductInfoThroughHttpGet = function (callback) {
    var getUrl = config.jinkebro.baseUrl + config.jinkebro.productInfo;
    //var getUrl = '/jinkeBro/product';
    console.log(getUrl);
    http.get(getUrl, function (res) {
        var datas = [];
        var size = 0;
        res.on('data', function (data) {
            datas.push(data);
            size += data.length;
        });

        res.on("end", function () {
            var buff = Buffer.concat(datas, size);
            var result = JSON.parse(buff); //转码//var result = buff.toString();//不需要转编码,直接tostring  
            logService.insertOperationLog(logModel, function (err, insertId) {
                if (err) {
                    logger.writeError('获取微信商品信息成功，生成操作日志异常' + new Date());
                }
            });

            if (callback && typeof callback === 'function') {
                callback(result);
                return;
            }
        });

    }).on('error', function (e) {
        logger.writeError('获取微信商品信息时异常' + new Date());
        return;
    });

}
module.exports = new Product();