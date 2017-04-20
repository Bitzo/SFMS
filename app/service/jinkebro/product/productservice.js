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
    operationConfig = appRequire('config/operationconfig'),
    http = require('http'),
    logger = appRequire('util/loghelper').helper,
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel'),
    moment = require('moment'),
    validator = require('validator'),
    dataCheck = appRequire('util/dataverify');

logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

var Product = function () {

};

//新增商品
Product.prototype.insertProduct = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.product.productAdd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productAdd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productAdd.identifier;
    logModel.CreateUserID = data.OperateUserID || 0;  //0代表系统管理员操作
    // 接收router数据
    var formdata = {
        "SKU" : data.SKU,
        "ProductName": data.ProductName,
        "ProductDesc": data.ProductDesc,
        "ProductImgPath": data.ProductImgPath,
        "ExpireTime": data.ExpireTime,
        "ProducTime": data.ProducTime,
        "SupplierID": data.SupplierID,
        "ProductPrice": data.ProductPrice,
        "OnSale": data.OnSale,
        "TotalNum" : data.TotalNum,
        "StockAreaID" : data. StockAreaID,
        "CreateUserID" : data.CreateUserID,
        "CreateTime" : data.CreateTime,
        "newProductTypeName" : data.newProductTypeName
    };

    var returnResult = {
        "msg": "参数不能为空!"
    };

    var indispensableKeyArr = [
        formdata.ProductName,
        formdata.ProductDesc,
        formdata.ProductImgPath,
        formdata.ExpireTime,
        formdata.ProducTime,
        formdata.SupplierID,
        formdata.ProductPrice,
        formdata.OnSale,
        formdata.TotalNum,
        formdata.StockAreaID,
        formdata.newProductTypeName
    ];

    var indispensableValueArr = [
        '商品名称',
        '商品描述',
        '商品图片路径',
        '有效期',
        '生产日期',
        '供应商',
        '商品价格',
        '是否在售',
        '首次入库总数',
        '存储位置',
        '商品类别'
    ];

    var undefinedCheck = dataCheck.isUndefinedArray(indispensableKeyArr,indispensableValueArr);
    if (!(undefinedCheck.isRight)) {
        returnResult.msg = undefinedCheck.msg;
        return callback(false,returnResult);
    }

    var shouldBeNumericKeyArr = [
        formdata.SupplierID,
        formdata.OnSale,
        formdata.TotalNum,
        formdata.StockAreaID
    ];

    var shouldBeNumericValueArr = [
        '供应商',
        '是否在售',
        '首次入库总数',
        '存储位置'
    ];

    var shouldBeNumeric = dataCheck.isNumericArray(shouldBeNumericKeyArr,shouldBeNumericValueArr);
    if (!(shouldBeNumeric.isRight)) {
        returnResult.msg = shouldBeNumeric.msg;
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.ProductName),{min:1,max:50}))) {
        returnResult.msg = '商品名长度应该小于50位！';
        return callback(false,returnResult);
    }

    if (moment(formdata.ExpireTime).isBefore(formdata.ProducTime)) {
        returnResult.msg = '有效期不能比生产日期早!';
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.ProductDesc),{min:1,max:200})) && (formdata.ProductDesc != '')) {
        returnResult.msg = '商品描述长度应该小于200位！';
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.ProductImgPath),{min:1,max:200})) && (formdata.ProductImgPath != '')) {
        returnResult.msg = '商品图片路径长度应该小于200位！';
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.TotalNum.toString()),{min:1,max:11}))) {
        returnResult.msg = '首次入库总数应该小于11位！';
        return callback(false,returnResult);
    }

    if (formdata.TotalNum < 0) {
        returnResult.msg = '首次入库总数不能为负数！';
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.newProductTypeName),{min:1,max:50}))) {
        returnResult.msg = '商品类型长度应该小于50位！';
        return callback(false,returnResult);
    }

    if (!(validator.isDecimal((formdata.ProductPrice).toString()))) {
        returnResult.msg = '商品价格应该是合法的整数或者小数！';
        return callback(false,returnResult);
    }

    if (formdata.ProductPrice < 0) {
        returnResult.msg = '商品价格不能为负数！';
        return callback(false,returnResult);
    }
    if (!(dataCheck.isUndefined(formdata.ExpireTime))) {
        if (validator.isDate(formdata.ExpireTime.toString())) {
            formdata.ExpireTime = moment(formdata.ExpireTime).format("YYYY-MM-DD");
        } else {
            returnResult.msg = '时间格式有误！';
            return callback(false,returnResult);
        }
    } else {
        returnResult.msg = '商品过期时间必须设置！';
        return callback(false,returnResult);
    }

    if (!(dataCheck.isUndefined(formdata.ProducTime))) {
        if (validator.isDate(formdata.ProducTime.toString())) {
            formdata.ProducTime = moment(formdata.ProducTime).format("YYYY-MM-DD");
        } else {
            returnResult.msg = '时间格式有误！';
            return callback(false,returnResult);
        }
    } else {
        returnResult.msg = '商品生产日期必须设置！';
        return callback(false,returnResult);
    }

    productDAL.insertProduct(formdata, function (err, result) {
        if (err) {

            logModel.Type = operationConfig.operationType.error;
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
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.product.productDel.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productDel.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productDel.identifier;
    logModel.CreateUserID = data.OperateUserID || 0;  //0代表系统管理员操作

    var formdata = {
        "ProductID": data.ProductID
    };

    var returnResult = {
        "msg": "参数不能为空!"
    };

    if (dataCheck.isUndefined(formdata.ProductID)) {
        returnResult.msg = '产品ID必须，请检查！';
        return callback(false,returnResult);
    }

    if (!(dataCheck.isNumeric(formdata.ProductID))) {
        returnResult.msg = '产品ID必须为数字，请检查！';
        return callback(false,returnResult);
    }

    productDAL.deleteProduct(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
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
        logModel.Memo = "商品删除成功";

        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品删除成功，生成操作日志失败" + logModel.CreateTime);
            }
        });

        logger.writeInfo('商品删除成功');

        return callback(false, result);
    });
};

//编辑商品信息
Product.prototype.updateProduct = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.product.productUpd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productUpd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productUpd.identifier;
    logModel.CreateUserID = data.OperateUserID || 0;  //0代表系统管理员操作

    // start data check
    var formdata = {
        "SKU" : data.SKU,
        "ProductID" : data.ProductID,
        "ProductName" : data.ProductName,
        "ProductDesc" : data.ProductDesc,
        "ProductImgPath" : data.ProductImgPath,
        "ExpireTime" : data.ExpireTime,
        "ProducTime" : data.ProducTime,
        "SupplierID" : data.SupplierID,
        "ProductTypeID" : data.ProductTypeID,
        "ProductPrice" : data.ProductPrice,
        "OnSale" : data.OnSale
    };

    var returnResult = {
        "msg": "参数不能为空!"
    };

    var indispensableKeyArr = [
        formdata.SKU,
        formdata.ProductID,
        formdata.ProductName,
        formdata.ProductDesc,
        formdata.ProductImgPath,
        formdata.ExpireTime,
        formdata.ProducTime,
        formdata.SupplierID,
        formdata.ProductTypeID,
        formdata.ProductPrice,
        formdata.OnSale
    ];

    var indispensableValueArr = [
        '仓储量单位',
        '商品ID',
        '商品名称',
        '商品描述',
        '商品图片路径',
        '有效期',
        '生产日期',
        '供应商',
        '商品类别',
        '商品价格',
        '是否在售'
    ];

    var undefinedCheck = dataCheck.isUndefinedArray(indispensableKeyArr,indispensableValueArr);
    if (!(undefinedCheck.isRight)) {
        returnResult.msg = undefinedCheck.msg;
        return callback(false,returnResult);
    }

    var shouldBeNumericKeyArr = [
        formdata.ProductID,
        formdata.SupplierID,
        formdata.ProductTypeID,
        formdata.OnSale,
    ];

    var shouldBeNumericValueArr = [
        '商品ID',
        '供应商',
        '商品类别',
        '是否在售',
    ];

    var shouldBeNumeric = dataCheck.isNumericArray(shouldBeNumericKeyArr,shouldBeNumericValueArr);
    if (!(shouldBeNumeric.isRight)) {
        returnResult.msg = shouldBeNumeric.msg;
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.ProductName),{min:1,max:50}))) {
        returnResult.msg = '商品名长度应该小于50位！';
        return callback(false,returnResult);
    }

    if ((formdata.SKU).toString().length != 15) {
        returnResult.msg = '仓储量单位长度应该等于15位！';
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.ProductDesc),{min:1,max:200})) && (formdata.ProductDesc != '')) {
        returnResult.msg = '商品描述长度应该小于200位！';
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.ProductImgPath),{min:1,max:200})) && (formdata.ProductImgPath != '')) {
        returnResult.msg = '商品图片路径长度应该小于200位！';
        return callback(false,returnResult);
    }

    if (!(validator.isDecimal((formdata.ProductPrice).toString()))) {
        returnResult.msg = '商品价格应该是合法的整数或者小数！';
        return callback(false,returnResult);
    }

    if (!(dataCheck.isUndefined(formdata.ExpireTime))) {
        if (validator.isDate(formdata.ExpireTime.toString())) {
            formdata.ExpireTime = moment(formdata.ExpireTime).format("YYYY-MM-DD");
        } else {
            returnResult.msg = '时间格式有误！';
            return callback(false,returnResult);
        }
    } else {
        returnResult.msg = '商品过期时间必须设置！';
        return callback(false,returnResult);
    }

    if (!(dataCheck.isUndefined(formdata.ProducTime))) {
        if (validator.isDate(formdata.ProducTime.toString())) {
            formdata.ProducTime = moment(formdata.ProducTime).format("YYYY-MM-DD");
        } else {
            returnResult.msg = '时间格式有误！';
            return callback(false,returnResult);
        }
    } else {
        returnResult.msg = '商品生产日期必须设置！';
        return callback(false,returnResult);
    }
    
    if(formdata.ExpireTime && formdata.ProducTime){
        if (moment(formdata.ExpireTime).isBefore(formdata.ProducTime)) {
            returnResult.msg = '有效期不能比生产日期早!';
            return callback(false,returnResult);
        }
    }
    
    productDAL.updateProduct(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
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
        logModel.Memo = "商品编辑成功";

        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品编辑成功，生成操作日志失败" + logModel.CreateTime);
            }
        });

        logger.writeInfo('商品编辑成功');

        return callback(false, result);
    });
};

//查询商品信息
Product.prototype.queryProducts = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.product.productQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.product.productQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.product.productQuery.identifier;
    logModel.CreateUserID = data.OperateUserID || 0;  //0代表系统管理员操作

    var formdata = {
        page: data.page || 1,
        pageNum: data.pageNum || config.pageCount,
        SKU: data.SKU || '',
        ProductID : data.ProductID || '',
        ProductName: data.ProductName || '',
        ExpireTime: data.ExpireTime || '',
        SupplierID: data.SupplierID || '',
        ProductTypeID: data.ProductTypeID || '',
        ProductPrice: data.ProductPrice || '',
        OnSale: data.OnSale || '',
        isPaging: data.isPaging || 0,
        minProductPrice : data.minProductPrice || '',
        maxProductPrice : data.maxProductPrice || '',
        earlyExpireTime : data.earlyExpireTime || '',
        lateExpireTime : data.lateExpireTime || ''
    };

    productDAL.queryProducts(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.Memo = "商品查询失败" + result;

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
        logModel.Memo = "商品查询成功";
        
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("商品查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });

        logger.writeInfo("商品查询成功，生成操作日志成功！" + logModel.CreateTime);

        callback(false, result);
    });
};

//查询商品信息
Product.prototype.CountProducts = function (data, callback) {
    var formdata = {
        SKU: data.SKU || '',
        "jit_product.ProductID" : data.ProductID || '',
        ProductName: data.ProductName || '',
        ExpireTime: data.ExpireTime || '',
        SupplierID: data.SupplierID || '',
        ProductTypeID: data.ProductTypeID || '',
        ProductPrice: data.ProductPrice || '',
        OnSale: data.OnSale || '',
        minProductPrice : data.minProductPrice || '',
        maxProductPrice : data.maxProductPrice || '',
        earlyExpireTime : data.earlyExpireTime || '',
        lateExpireTime : data.lateExpireTime || ''
    };

    productDAL.CountProducts(formdata, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        return callback(false, result);
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

        if (result != undefined && result.length != 0 && result.length != undefined) {
            var maxSKU = result[0].SKU;
            var rearStr = (parseInt(maxSKU.substr(10,5)) + 1).toString();
            result[0].SKU = maxSKU.substr(0,10) + rearStr;
        } else {
            result = [{
                SKU : 'JK1320025220001'
            }];
        }

        return callback(false, result);
    });
};


module.exports = new Product();