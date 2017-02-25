/**
 * @Author: Cecurio
 * @Date: 2017/1/2 17:39
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 17:39
 * @Function:
 */

//调用http的模块
var http = require('http');
//调用config的数据
var config = appRequire('config/config'),
    operationConfig = appRequire('config/operationconfig');
var orderDAL = appRequire('dal/jinkebro/order/orderdal'),
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel'),
    logger = appRequire("util/loghelper").helper;

var productService = appRequire('service/jinkebro/product/productservice');
var productStock = appRequire('service/jinkebro/productstock/productstockservice');
//关于客户方面的service
var customer = appRequire("service/jinkebro/customer/customerservice");
//关于库存
var productstock = appRequire('service/jinkebro/productstock/productstockservice');
//记录日志
var wechat = appRequire("service/wechat/wechatservice");

logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

var Order = function () {
    this.OrderTime = moment().format("YYYY-MM-DD HH:mm:ss"); //创建的时间
}

//新增一个订单的全部信息
Order.prototype.insertOrderFull = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderAdd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderAdd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderAdd.identifier;

    var formdata = {
            "OrderTime": data.OrderTime,
            "PayMethod": data.PayMethod,
            "IsValid": data.IsValid,
            "IsActive": data.IsActive,
            "ProductIDs": data.ProductIDs,
            "ProductCounts": data.ProductCounts,
            "CustomerID": data.CustomerID,
            "OrderStatus": data.OrderStatus
        };

    //新增订单
    orderDAL.createOrder(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID;
            logModel.Memo = "订单新增失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单新增失败');
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
        callback(false, result);
    });
}

//删除订单
Order.prototype.deleteOrder = function (data, callback) {
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderDel.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderDel.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderDel.identifier;
    //删除订单
    orderDAL.deleteOrder(data, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;
            logModel.Memo = "订单删除失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单删除失败');
            return;
        }

        //删除成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.CustomerID || 0;
        logModel.Memo = "订单删除成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单删除成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单删除成功');
        callback(false, result);
    });
}

//编辑订单信息
Order.prototype.updateOrder = function (data, callback) {
    //日志： 要写入operationlog表的
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderUpd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderUpd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderUpd.identifier;
    var formdata = {
        order : {
            OrderID: data.OrderID,
            OrderTime: data.OrderTime || '',
            PayTime: data.PayTime || '',
            DeliveryTime: data.DeliveryTime || '',
            PayMethod: data.PayMethod || '',
            IsValid: data.IsValid || '',
            IsActive: data.IsActive || '',
            DeliveryUserID: data.DeliveryUserID || '',
            IsCancel: data.IsCancel || '',
            CancelTime: data.CancelTime || '',
            DiscountMoney: data.DiscountMoney || '',
            DiscountType: data.DiscountType || '',
            BizID: data.BizID || '',
            Memo: data.Memo || '',
            IsCheck: data.IsCheck || '',
            PDate: data.PDate || '',
            OrderStatus: data.OrderStatus || ''
        }
    };
    //修改订单
    orderDAL.updateOrder(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;
            logModel.Memo = "订单修改失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单修改失败');
            return;
        }

        //修改成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.CustomerID || 0;
        logModel.Memo = "订单修改成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单修改成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单修改成功');
        callback(false, result);
    });
}

//查询订单产品的信息
Order.prototype.queryOrders = function (data, callback) {
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQuery.identifier;

    var formdata = {
        pageManage : {
            page : data.page,
            pageNum : data.pageNum,
            isPaging : data.isPaging || 0
        },
        order : {
            "jit_order.OrderID" : data.OrderID,
            "jit_order.OrderStatus" : data.OrderStatus,
            "jit_order.IsActive" : data.IsActive
        }
    };

    orderDAL.queryOrders(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
            logModel.Memo = "订单查询失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单查询失败');
            return;
        }

        //查询成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
        logModel.Memo = "订单查询成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单查询成功');

        for (var i = 0; i < result.length; i++) {
            result[i].OrderTime = moment(result[i].OrderTime).format('YYYY-MM-DD HH:mm:SS');
            switch (result[i].OrderStatus) {
                case 1:
                    result[i]['OrderStatusDesc'] = '等待配送';
                    break;
                case 2:
                    result[i]['OrderStatusDesc'] = '配送中';
                    break;
                case 3:
                    result[i]['OrderStatusDesc'] = '配送成功';
                    break;
                case 4:
                    result[i]['OrderStatusDesc'] = '已确认';
                    break;
                case 5:
                    result[i]['OrderStatusDesc'] = '已取消';
                    break;
                default:
                    result[i]['OrderStatusDesc'] = '无此配送状态';
                    break;
            }
            switch (result[i].PayMethod) {
                case 1:
                    result[i]['PayMethodDesc'] = '现金支付';
                    break;
                case 2:
                    result[i]['PayMethodDesc'] = '微信支付';
                    break;
                default:
                    result[i]['PayMethodDesc'] = '无此支付方式';
                    break;
            }
            switch (result[i].IsActive) {
                case 0:
                    result[i]['IsActiveDesc'] = '无效';
                    break;
                case 1:
                    result[i]['IsActiveDesc'] = '有效';
                    break;
                default:
                    result[i]['IsActiveDesc'] = '无此状态';
                    break;
            }
        }

        callback(false, result);
    });
}

//计算满足相应条件的订单个数
Order.prototype.CountOrders = function (data, callback) {
    //满足相应条件的订单个数
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQueryCount.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQueryCount.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQueryCount.identifier;

    var formdata = {
        pageManage : {
            page : data.page,
            pageNum : data.pageNum,
            isPaging : data.isPaging
        },
        order : {
            "jit_order.OrderID" : data.OrderID,
            "jit_order.OrderStatus" : data.OrderStatus,
            "jit_order.IsActive" : data.IsActive
        }
    };

    orderDAL.CountOrders(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
            logModel.Memo = "计算满足相应条件的订单个数失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("计算满足相应条件的订单个数失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '计算满足相应条件的订单个数失败');
            return;
        }

        //查询成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
        logModel.Memo = "计算满足相应条件的订单个数成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("计算满足相应条件的订单个数成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('计算满足相应条件的订单个数成功');

        callback(false, result);
    });
}

//查询订单产品的信息
Order.prototype.queryOrderProduct = function (data, callback) {
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQuery.identifier;

    var formdata = {
        pageManage : {
            page : data.page || 1,
            pageNum : data.pageNum || 20,
            isPaging : data.isPaging || 0
        },
        orderProduct : {
            "jit_orderproduct.ProductID" : data.ProductID || [],
            "jit_orderproduct.ProductCount" : data.ProductCount || []
        },
        order : {
            "jit_ordercustomer.OrderID" : data.OrderID || '',
            "jit_customer.WechatUserCode" : data.WechatUserCode || '',
            "jit_customer.CustomerID" : data.CustomerID || '',
            "jit_order.OrderStatus" : data.OrderStatus || '',
            "jit_order.IsActive" : data.IsActive || ''
        }
    };

    orderDAL.queryOrderProduct(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
            logModel.Memo = "订单查询失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '订单查询失败');
            return;
        }

        //查询成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
        logModel.Memo = "订单查询成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单查询成功');

        for (var i = 0; i < result.length; i++) {
            result[i].OrderTime = moment(result[i].OrderTime).format('YYYY-MM-DD HH:mm:SS');
            switch (result[i].OrderStatus) {
                case 1:
                    result[i]['OrderStatusDesc'] = '等待配送';
                    break;
                case 2:
                    result[i]['OrderStatusDesc'] = '配送中';
                    break;
                case 3:
                    result[i]['OrderStatusDesc'] = '配送成功';
                    break;
                case 4:
                    result[i]['OrderStatusDesc'] = '已确认';
                    break;
                case 5:
                    result[i]['OrderStatusDesc'] = '已取消';
                    break;
                default:
                    result[i]['OrderStatusDesc'] = '无此状态';
                    break;
            }
        }

        callback(false, result);
    });
}


//计算满足相应条件的订单产品个数
Order.prototype.CountOrderProduct = function (data, callback) {
    //满足相应条件的订单个数
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQueryCount.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQueryCount.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQueryCount.identifier;

    var formdata = {
        pageManage : {
            page : data.page,
            pageNum : data.pageNum,
            isPaging : data.isPaging
        },
        orderProduct : {
            "jit_orderproduct.ProductID" : data.ProductID,
            "jit_orderproduct.ProductCount" : data.ProductCount
        },
        order : {
            "jit_ordercustomer.OrderID" : data.OrderID,
            "jit_customer.WechatUserCode" : data.WechatUserCode,
            "jit_customer.CustomerID" : data.CustomerID,
            "jit_order.OrderStatus" : data.OrderStatus,
            "jit_order.IsActive" : data.IsActive
        }
    };

    orderDAL.CountOrderProduct(formdata, function (err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
            logModel.Memo = "计算满足相应条件的订单个数失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("计算满足相应条件的订单个数失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true, '计算满足相应条件的订单个数失败');
            return;
        }

        //查询成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
        logModel.Memo = "计算满足相应条件的订单个数成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("计算满足相应条件的订单个数成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('计算满足相应条件的订单个数成功');

        callback(false, result);
    });
}


/**
 * 检查必填字段是否存在
 * @param res
 * @param input
 * @param string
 */
Order.prototype.checkInput = function (res, input, string) {
    if (input === undefined) {
        
        logger.writeError(string + ' is undefined');
        res.status(404);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: string + '没有输入'
        });
    }
}

//根据用户的信息来将订单的内容插入进数据库
Order.prototype.insertOrderInfo = function (msg, openid, callback) {
    var me = this;
    var wechatUserCode = openid;
    var queryCustomerInfo = {
        'WechatUserCode': wechatUserCode
    }

    
    //根据“1#3|2#2”的输入格式来分割字符串c
    var productInfo = msg.split('|');
    var productIDArray = [];
    var productCountArray = [];

    var p = new Promise(function (resolve, reject) {
        customer.query(queryCustomerInfo, function (err, customerInfo) {

            if (err) {
                reject(Error('没有数据'));
            }
                
            //该用户不存在
            if (customerInfo == undefined || customerInfo.length == 0) {
                console.log('查询用户失败');
                logger.writeError("[service/jinkebro/order/orderservice]当插入订单的时候查无此用户");
                callback(true, "当插入订单的时候查无此用户");
                return;
            }

            resolve(customerInfo);
        });
    });

    p.then(function (customerInfo) {
        var orderInfo = {
            "CustomerID": customerInfo[0].CustomerID
        }

        //将订单格式的1#3，商品号，和数量分别放在两个数组中
        for (var key in productInfo) {
            var eachProductInfoOfOrder = productInfo[key].split('#');
            productIDArray.push(eachProductInfoOfOrder[0]);
            productCountArray.push(eachProductInfoOfOrder[1]);
        }

        orderInfo.ProductIDs = productIDArray;
        orderInfo.ProductCounts = productCountArray;
        return orderInfo;

    }).then(function (orderInfo) {

        me.checkIsRepeatOrder(orderInfo, function (err, orderQueryInfo) {
            if (err) {
                console.log('查询订单的失败');
                return;
            }

            if (orderQueryInfo.length !== 0) {
                console.log('已存在订单，不需要重复的插入');
                return;
            }
            
            me.insertWechatOrder(orderInfo, function (err, orderInsertInfo) {
                if (err) {
                    console.log('插入订单的时候失败');
                    return;
                }
 
                /**
                 * 库存量不足
                 */
                if (orderInsertInfo.insertId === undefined) {
                    productService.queryProducts({
                        'jit_product.ProductID': orderInsertInfo
                    }, function (err, productInfo) {
                        if (err) {
                            console.log('查询商品的时候出错');
                            logger.writeError('[service/jinkebro/order/orderservice] 查询商品的时候出错');
                            return;
                        }
                        callback(false, productInfo[0].ProductName);
                        return;
                    });
                    return;
                }
                
                /**
                 * 库存量足的话，返回订单的信息
                 */
                me.getOrderInfo({
                    'OrderID': orderInsertInfo.insertId
                }, function (err, insertOrderInfo) {
                    if (err) {
                        console.log('查询订单');
                        return;
                    }

                    callback(false, insertOrderInfo);
                    return;
                });
            });
        });

    });
}

//从微信端获取数据插入到订单里面
Order.prototype.insertWechatOrder = function (productInfo, callback) {
    console.log("[service/jinkbro/orderservice]");
    console.log(productInfo);

    //这可以整个成一个订单的object
    var OrderTime = moment().format('YYYY-MM-DD HH:mm:ss'),
        PayMethod = 1,
        IsValid = 1,
        IsActive = 1,
        OrderStatus = 1,
        ProductIDs = productInfo.ProductIDs,//数组，表示ProductID的集合
        ProductCounts = productInfo.ProductCounts,
        CustomerID = productInfo.CustomerID || 1;

    var insertdata = {
        'OrderTime': OrderTime,
        'PayMethod': PayMethod,
        'IsValid': IsValid,
        'IsActive': IsActive,
        'OrderStatus': OrderStatus,
        'ProductIDs': ProductIDs,
        'ProductCounts': ProductCounts,
        'CustomerID': CustomerID
    };

    console.log(insertdata);
    this.insertOrderFull(insertdata, function (err, insertOrderInfo) {
        if (err) {
            console.log('增加产品出错');
            callback(true);
            return;
        }

        if (insertOrderInfo !== undefined && insertOrderInfo.insertId != undefined) {
            callback(false, {
                'insertId': insertOrderInfo.insertId,
                'insertOrderInfo': insertOrderInfo
            });
            return;
        }

        callback(false, insertOrderInfo);
        return;
    });



}

/**
 * function: 通过订单的Id来获取订单信息
 */
Order.prototype.getOrderInfo = function (orderID, callback) {
    console.log(orderID);
    //查询的条件
    // 传到dal的数据
    var sendData = {
        pageManage: {
            page: 1,
            pageNum: 10,
            isPaging: 1
        },
        orderProduct: {
            "jit_orderproduct.ProductID": '',
            "jit_orderproduct.ProductCount": ''
        },
        order: {
            "jit_ordercustomer.OrderID": orderID.OrderID,
            "jit_customer.WechatUserCode": '',
            "jit_customer.CustomerID": [],
            "jit_order.OrderStatus": '',
            "jit_order.IsActive": 1
        }
    };

    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQuery.identifier;

    orderDAL.queryOrderProductWechat(sendData, function (err, orderInfo) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = 0;
            logModel.Memo = "订单查询失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            logger.writeError('[service/jinkebro/order/orderservice] 查詢订单的时候失败');
            callback(true, '查询订单的时候失败');
        };

        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = 0;
        logModel.Memo = "订单查询成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单查询成功');
        callback(false, orderInfo);
        return;
    });
};

/**
 * method {get}
 * @param {int} CustomerID
 * @param {Array} ProductID
 * @param {Array} ProductCount
 * @param {int} OrderStatus 
 * function: 通过以上参数获取订单的内容，检查是否重复下单
 */
Order.prototype.checkIsRepeatOrder = function (data, callback) {

    var checkInfo = {
        pageManage: {
            page: 1,
            pageNum: 20,
            isPaging: 1
        },
        orderProduct: {
            "jit_orderproduct.ProductID": data.ProductIDs,
            "jit_orderproduct.ProductCount": data.ProductCounts
        },
        order: {
            "jit_ordercustomer.OrderID": '',
            "jit_customer.WechatUserCode": '',
            "jit_customer.CustomerID": data.CustomerID,
            "jit_order.OrderStatus": 1,
            "jit_order.IsActive": 1
        }
    }

    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQuery.identifier;

    orderDAL.checkIsReapte(checkInfo, function (err, queryInfo) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = 0;
            logModel.Memo = "订单查询失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单查询失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            logger.writeError('[service/jinkebro/order/service] 检查订单是否重复插入的时候出错');
            callback(true);
            return;
        }

        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = 0;
        logModel.Memo = "订单查询成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("订单查询成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('订单查询成功');
        
        //存取已查询到的ID以及商品的数量并进行比对
        var productIDs = new Array();
        var productCounts = new Array();
        for (var i = 0; i < queryInfo.length; ++i) {
               productCounts.push(queryInfo[i]['ProductCount']);
               productIDs.push(queryInfo[i]['ProductID']);
        }
        
        //统计与数据库中的商品的相同的个数
        var countSameProudct = 0;
        console.log(productIDs);
        for(var i=0; i < productIDs.length; ++i) {
            for (var j = 0; j < data.ProductIDs.length; ++j) {
                if (productIDs[i] == data.ProductIDs[j] && productCounts[i] == data.ProductCounts[j])
                    {
                        countSameProudct++;
                    }
            }
        }
        
        if (countSameProudct == productCounts.length) {
            callback(false, queryInfo);
        }
        else {
            callback(false, '');
        }
        return;
    });
}

module.exports = new Order();