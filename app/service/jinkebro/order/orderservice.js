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

//新增订单
Order.prototype.insertOrder = function (data, callback) {
    orderDAL.insertOrder(data, function (err, result) {

        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//新增订单产品表的一条记录
Order.prototype.insertOrderProduct = function (data, callback) {
    orderDAL.insertOrderProduct(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//新增订单用户表的一条记录
Order.prototype.insertOrderCustomer = function (data, callback) {
    orderDAL.insertOrderCustomer(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
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
    //新增订单
    orderDAL.insertOrderFull(data, function (err, result) {
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
    //修改订单
    orderDAL.updateOrder(data, function (err, result) {
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

//查询订单信息

Order.prototype.queryOrders = function (data, callback) {
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQuery.identifier;

    orderDAL.queryOrders(data, function (err, result) {
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
    
    orderDAL.CountOrders(data, function (err, result) {
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
        console.log(string + ' is undefined');
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

    console.log("[service/wechat/orderservice-------325行]" + msg);
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
                logger.writeError("[service/jinkebro/order/orderservice-----342行]当插入订单的时候查无此用户");
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

        me.checkProductCount(orderInfo, function (isSussess, resultInfo) {
            if (!isSussess) {
                var orderinfo = '对不起，您所需要的商品库存量不足';
                logger.writeError("service/jinkebro/order/orderservice----372行]对不起，你所需要的商品库存量不足");

                callback(false, orderinfo);
                return;
            };

            var orderID = {
                "OrderID": resultInfo
            };

            me.getOrderInfo(orderID, function (err, orderInfo) {
                if (err) {
                    console.log('[service/jinkebro/orderservice------384行]获取订单的消息失败');
                    return;
                }

                logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
                logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderAdd.actionName;
                logModel.Action = operationConfig.jinkeBroApp.orderManger.orderAdd.actionName;
                logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderAdd.identifier;
                logModel.Type = operationConfig.operationType.operation;
                logModel.CreateUserID = 0; 
                logModel.Memo = "订单插入成功";
                logService.insertOperationLog(logModel, function (err, logResult) {
                    if (err) {
                        logger.writeError("商品查询成功，生成操作日志失败" + logModel.CreateTime);
                    }
                });
                
                //拼凑所需要的订单消息
                var getorderinfo = orderInfo;
                var totalPrice = 0;
                var orderinfo = '亲，你的订单号是：' + getorderinfo[0]['OrderID'] + ' ' + '\n' + '你所订购的商品为:' + '\n';
                for (var key1 in getorderinfo) {
                    orderinfo += getorderinfo[key1].ProductName + ',数量为 ';
                    orderinfo += getorderinfo[key1].ProductCount + ' ;' + '\n';
                    totalPrice += getorderinfo[key1].ProductCount * getorderinfo[key1].ProductPrice;
                }
                orderinfo += "总共消费：" + totalPrice + '元  正在等待配送';
                logger.writeInfo("[service/jinkebro/order/orderservice---412行] 发送订单消息给用户");
                return callback(false, orderinfo);
            });
        });
    });
}

/*待重构*/
//查找库存表来检查商品的库存量
Order.prototype.checkProductCount = function (productInfo, callback) {
    var me = this;
    for (var key in productInfo)
        console.log("商品的信息" + key);
    var queryInfo = {
        'ProductID': '',
        'ProductCount': ''
    };
    //获取数量及订单
    var productIDs = productInfo.ProductIDs;
    var productCounts = productInfo.ProductCounts;

    /****************************************************** */
    //待重写，，暂时只能满足一个商品
    // for (var key in productIDs) {
    //     queryInfo.ProductID = productIDs[key];
    //     queryInfo.ProductCount = productCounts[key];
    //     me.queryCount(queryInfo,function (isEnough , resultcount)
    //         {
    //             if(isEnough)
    //             {
    //                 console.log("商品量充足");
    //             }
    //         });
    // }
    /****************************************************** */

    queryInfo.ProductID = productIDs[0];
    queryInfo.ProductCount = productCounts[0];
    me.queryCount(queryInfo, function (isEnough, resultInfo) {
        if (isEnough) {
            me.insertWechatOrder(productInfo, function (err, orderInfo) {
                logger.writeInfo("[service/jinkebro/order/orderservice---453行]在checkproductcount获取到了订单的消息");
                if (err) {
                    console.log('获取订单失败');
                    callback(true, orderInfo);
                    return;
                }
                
                logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
                logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
                logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQuery.actionName;
                logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQuery.identifier;
                logModel.Type = operationConfig.operationType.operation;
                logModel.CreateUserID = 0; 
                logModel.Memo = "订单查询成功";
                logService.insertOperationLog(logModel, function (err, logResult) {
                    if (err) {
                        logger.writeError("商品查询成功，生成操作日志失败" + logModel.CreateTime);
                    }
                });
                console.log(orderInfo);
                return callback(false, orderInfo);
            });
            
            //同时更新库存表里面的内容
            productStock.updateStockInfo(resultInfo, function (err, resultInfo) {
                if (err) {
                    callback(true, resultInfo);
                    return;
                }
                logger.writeInfo("[service/jinkebro/order/orderservice------483行]更新库存,库存减少掉已经订购完的商品");
                return;
            });
        } else {
            logger.writeInfo("[service/jinkebro/order/orderservice--------487行]库存量不足");
            callback(false, "库存量不足");
            return;
        }
    })

}

//查询库存，并返回正确的库存量
Order.prototype.queryCount = function (queryinfo, callback) {
    productStock.getStockInfo(queryinfo.ProductID, function (err, resultInfo) {
        if (err) {
            callback(true, '查询货存失败');
            return;
        }
    
        //计算库存的剩余量
        var surplus = resultInfo[0].TotalNum - queryinfo.ProductCount;

        var updateStockInfo = {
            'ProductID': queryinfo.ProductID,
            'TotalNum': surplus,
            'ID': resultInfo[0].ID
        }

        if (surplus >= 0) {
            logger.writeInfo("[service/jinkebro/order/orderservice -----513行]库存量足够");
            return callback(true, updateStockInfo);
        } else {
            logger.writeInfo("[service/jinkebro/order/orderservice -----516行]库存量不足");
            return callback(false, queryinfo.ProductID);
        }

    });
}
/*********************************************** */

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
        'OrderStatus': OrderStatus
    };

    orderDAL.insertOrder(insertdata, function (err, result) {
        if (err) {
            callback(true, "订单产品新增操作失败");
            return;
        };

        if (result == undefined && result.affectedRows == 0) {
            callback(true, '产品添加失败');
            return;
        }

        var InsertUserOrderData = {
            CustomerID: CustomerID,
            OrderID: result.insertId,
            IsActive: 1,
            CreateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        orderDAL.insertOrderCustomer(InsertUserOrderData, function (err, InsertUserOrderResult) {
            if (err) {
                callback(true, '服务器出错，产品新增失败');
                return;
            };
        });

        var orderprod = {
            OrderID: result.insertId,
            ProductID: ProductIDs,
            ProductCount: ProductCounts
        };

        var flag = 1;
        var temp;
        for (var i = 0; i < orderprod.ProductID.length; i++) {
            temp = {
                OrderID: result.insertId,
                ProductID: orderprod.ProductID[i],
                ProductCount: orderprod.ProductCount[i]
            }
            orderDAL.insertOrderProduct(temp, function (err, results) {
                if (err) {
                    callback(true, '产品新增失败');
                    return;
                };

                if (results !== undefined && results.affectedRows == 0) {
                    flag = 0;
                }
            });
        }
        if (flag == 1) {
            callback(true, result.insertId);
            return;
        }
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
    orderDAL.queryOrders(sendData, function (err, orderInfo) {
        if (err) {
            callback(true, '查询订单的时候失败');
        };
        callback(false, orderInfo);
    });
};

module.exports = new Order();