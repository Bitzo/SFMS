var orderdeliveryDAL = appRequire('dal/jinkebro/orderdelivery/orderdeliverydal'),
	moment = require('moment'),
	logService = appRequire('service/backend/log/logservice'),
	config = appRequire('config/config'),
	operationConfig = appRequire ('config/operationconfig'),
	logModel = appRequire('model/jinkebro/log/logmodel'),
    logger = appRequire('util/loghelper').helper;

logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

var OrderDelivery = function () {
	
};

//新增一个订单给配送员
OrderDelivery.prototype.insertOrderDelivery = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.identifier;

    var formdata = {
        "OrderID" : data.OrderID,
        "DeliveryUserID" : data.DeliveryUserID,
        "DeliveryBeginTime" : data.DeliveryBeginTime || '',
        "DeliveryEndTime" : data.DeliveryEndTime || ''
    }

	orderdeliveryDAL.insertOrderDelivery (formdata, function (err, insertResult) {
		if (err) {
			logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;//0为管理员的操作
            logModel.Memo = "订单配送员新增失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            return callback(true, '订单配送员新增失败');
		}
        
        //新增成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.CustomerID || 0;//0为管理员的操作
        logModel.Memo = "订单新增成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单新增成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单新增成功');
        callback(false, insertResult);
        return;
    });
}
	
//订单配送员的查询
OrderDelivery.prototype.queryOrderDelivery = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.identifier;

    var formdata = {
        "jit_orderdelivery.OrderID" : data.OrderID || '',
        "jit_orderdelivery.DeliveryUserID" : data.DeliveryUserID || '',
        "jit_orderdelivery.DeliveryBeginTime" : data.DeliveryBeginTime || '',
        "jit_orderdelivery.DeliveryEndTime" : data.DeliveryEndTime || '',
        pagedata : {
            page : data.page || 1,
            pageNum : data.pageNum || (config.pageCount),
            isPaging : (data.isPaging != undefined) ? (data.isPaging) : 0,
        }
    };

    orderdeliveryDAL.queryOrderDelivery (formdata, function (err, queryResult) {
		if (err) {
			logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;//0为管理员的操作
            logModel.Memo = "订单配送员查询失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单配送员查询失败');
            return;
		}
        //查询成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.CustomerID || 0;//0为管理员的操作
        logModel.Memo = "订单配送员查询成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单配送员查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单查询成功');

        var resultLength = queryResult.length;
        for (var i = 0; i < resultLength; i++) {
            queryResult[i].DeliveryBeginTime = (queryResult[i].DeliveryBeginTime == undefined) ? '' : moment(queryResult[i].DeliveryBeginTime).format('YYYY-MM-DD');
            queryResult[i].DeliveryEndTime = (queryResult[i].DeliveryEndTime == undefined) ? '' : moment(queryResult[i].DeliveryEndTime).format('YYYY-MM-DD');
        }

        return callback(false, queryResult);
    });
}

//订单配送员的计数
OrderDelivery.prototype.countOrderDelivery = function (data, callback) {
    var formdata = {
        "jit_orderdelivery.OrderID" : data.OrderID || '',
        "jit_orderdelivery.DeliveryUserID" : data.DeliveryUserID || '',
        "jit_orderdelivery.DeliveryBeginTime" : data.DeliveryBeginTime || '',
        "jit_orderdelivery.DeliveryEndTime" : data.DeliveryEndTime || '',
    };

    orderdeliveryDAL.countOrderDelivery (formdata, function (err, countResult) {
        if (err) {
            callback(true, '订单配送员查询失败！');
            return;
        }

        logger.writeInfo('订单配送员查询成功！');
        callback(false, countResult);
    });
}

//订单配送员的修改
OrderDelivery.prototype.updateOrderDelivery = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryUpd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryUpd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderDelivery.orderdeliveryUpd.identifier;

    var formdata = {
        "OrderID" : data.OrderID,
        "DeliveryUserID" : data.DeliveryUserID,
        "DeliveryBeginTime" : data.DeliveryBeginTime || '',
        "DeliveryEndTime" : data.DeliveryEndTime || ''
    };

	orderdeliveryDAL.updateOrderDelivery (formdata, function (err, insertResult) {
		if (err) {
			logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;//0为管理员的操作
            logModel.Memo = "订单配送单修改失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单配送单修改失败');
            return;
		}

        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.CustomerID || 0;//0为管理员的操作
        logModel.Memo = "订单配送单修改成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单修改成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单修改成功');
        return callback(false, insertResult);
    });
}
        
module.exports = new OrderDelivery();