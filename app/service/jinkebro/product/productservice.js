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

    var formdata = {
        "SKU": data.SKU,
        "ProductName": data.ProductName,
        "ProductDesc": data.ProductDesc || '',
        "ProductImgPath": data.ProductImgPath || '',
        "ExpireTime": data.ExpireTime,
        "ProducTime": data.ProducTime,
        "SupplierID": data.SupplierID,
        "ProductTypeID": data.ProductTypeID,
        "ProductPrice": data.ProductPrice,
        "OnSale": data.OnSale,
        "TotalNum" : data.TotalNum,
        "StockAreaID" : data. StockAreaID,
        "CreateUserID" : data.CreateUserID,
        "CreateTime" : data.CreateTime,
        "newProductTypeName" : data.newProductTypeName || ''
    };

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
            return callback(true,'商品新增失败');
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
        return callback(false, result);
    });
};

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
};

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
};

//查询商品信息
Product.prototype.queryProducts = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.OperationName = operationConfig.jinkeBroApp.product.productQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productQuery.identifier;

    var formdata = {
        page: data.page || 1,
        pageNum: data.pageNum || config.pageCount,
        SKU: data.SKU || '',
        "jit_product.ProductID" : data.ProductID || '',
        ProductName: data.ProductName || '',
        ExpireTime: data.ExpireTime || '',
        SupplierID: data.SupplierID || '',
        ProductTypeID: data.ProductTypeID || '',
        ProductPrice: data.ProductPrice || '',
        OnSale: data.OnSale || '',
        isPaging: data.isPaging || ''
    };

    productDAL.queryProducts(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.SupplierID || 0;  //0代表系统管理员操作
            logModel.Memo = "商品查询失败"+result;
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("商品查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            
            callback(true,'商品查询失败');
            return ;
        }

        //计算过期时间
        var tempTimeStamp, temp;
        var days = 60 * 60 * 24 * 1000;
        for (var i = 0; i < result.length; i++) {
            tempTimeStamp = (Date.parse(result[i].ExpireTime) - Date.parse(new Date())) / days;
            temp = Math.ceil(tempTimeStamp.toFixed(4));
            result[i]['remainTime'] = temp;
            result[i].ExpireTime = moment(result[i].ExpireTime).format('YYYY-MM-DD');
            result[i].ProducTime = moment(result[i].ProducTime).format('YYYY-MM-DD');
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

        callback(false, result);
    });
};

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
};

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
        return callback(false, result);
    });
};

Product.prototype.getMaxSKU = function (callback) {
    productDAL.getMaxSKU(function (err,result) {
        if (err) {
            callback(true);
            return;
        }
        return callback(false, result);
    });
};

Product.prototype.getMaxSKUNext = function (callback) {
    productDAL.getMaxSKU(function (err,result) {
        if (err) {
            callback(true);
            return;
        }
        var maxSKU = result[0].SKU;
        var rearStr = (parseInt(maxSKU.substr(10,5)) + 1).toString();
        result[0].SKU = maxSKU.substr(0,10) + rearStr;
        return callback(false, result);
    });
};


module.exports = new Product();