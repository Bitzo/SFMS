var orderdeliveryDAL = appRequire('dal/jinkebro/orderdelivery/orderdeliverydal'),
	moment = require('moment'),
	logService = appRequire('service/bankend/log/logservice'),
	config = appRequire('config/config'),
	operationConfig = appRequire ('config/operationconfig'),
	logModel = appRequire('model/jinkebro/log/logmodel');
var logger = appRequire('util/loghelper').helper;

logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;
var OrderDelivery = function () {
	
}

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
	
	orderdeliveryDAL.insertOrderDelivery (data, function (err, insertResult) {
		if (err) {
			logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID;
            logModel.Memo = "订单配送员新增失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单配送员新增失败');
            return;
		}
        
        //新增成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.CustomerID;
        logModel.Memo = "订单新增成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单新增成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单新增成功');
        callback(false, insertResult);
    });
}
	