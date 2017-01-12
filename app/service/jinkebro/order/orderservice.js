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

var Order = function() {
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
            callback(true,'订单新增失败');
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

Order.prototype.deleteOrder = function(data, callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderDel.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderDel.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderDel.identifier;
    //删除订单
    orderDAL.deleteOrder(data, function(err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;
            logModel.Memo = "订单删除失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'订单删除失败');
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
Order.prototype.updateOrder = function(data, callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderUpd.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderUpd.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderUpd.identifier;
    //修改订单
    orderDAL.updateOrder(data, function(err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.CustomerID || 0;
            logModel.Memo = "订单修改失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("订单修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'订单修改失败');
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

Order.prototype.queryOrders = function(data, callback) {
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
            callback(true,'订单查询失败');
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
                case 1 :
                    result[i]['OrderStatusDesc'] = '等待配送';
                    break;
                case 2 :
                    result[i]['OrderStatusDesc'] = '配送中';
                    break;
                case 3 :
                    result[i]['OrderStatusDesc'] = '配送成功';
                    break;
                case 4 :
                    result[i]['OrderStatusDesc'] = '已确认';
                    break;
                case 5 :
                    result[i]['OrderStatusDesc'] = '已取消';
                    break;
                default :
                    result[i]['OrderStatusDesc'] = '无此状态';
                    break;
            }
        }

        callback(false, result);
    });
}


//计算满足相应条件的订单个数
Order.prototype.CountOrders = function(data, callback) {
    //满足相应条件的订单个数
    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
    logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    logModel.PDate = moment().format('YYYY-MM-DD');
    logModel.OperationName = operationConfig.jinkeBroApp.orderManger.orderQueryCount.actionName;
    logModel.Action = operationConfig.jinkeBroApp.orderManger.orderQueryCount.actionName;
    logModel.Identifier = operationConfig.jinkeBroApp.orderManger.orderQueryCount.identifier;
    orderDAL.CountOrders(data, function(err, result) {
        if (err) {
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data['jit_customer.CustomerID'] || 0;
            logModel.Memo = "计算满足相应条件的订单个数失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("计算满足相应条件的订单个数失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'计算满足相应条件的订单个数失败');
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


//检查输入
Order.prototype.checkInput = function(res, input, string) {
    if (input === undefined) {
        console.log(string + ' is undefined');
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

    console.log('msg:' + msg + ',openid:' + openid);
    customer.query(queryCustomerInfo, function (err, customerInfo) {

        if (err) {
            var errinfo = '在添加用户的时候查询失败';
            logger.writeError('[service/jinkebro/order/orderservice-----152行]在添加用户的时候查询失败');
            return callback(true, errinfo);
        }

        console.log('customerInfo:' + JSON.stringify(customerInfo));
        
        //该用户不存在
        if (customerInfo == undefined || customerInfo.length == 0) {
            console.log('查询失败');
            logger.writeError("[service/jinkebro/order/orderservice-------158行]当插入订单的时候查无此用户");
            callback(true, "当插入订单的时候查无此用户");
            return;
        }

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
        me.checkProductCount(orderInfo, function (isSussess, resultInfo) {
            if (isSussess) {
                var order = JSON.parse(resultInfo);
                var orderID = {
                    "OrderID": order.insertOrderID
                };

                console.log('resultInfo:' + JSON.stringify(resultInfo));

                me.getOrderInfo(orderID, function (resultInfo) {

                    console.log('resultInfo1:' + JSON.stringify(resultInfo));

                    //拼凑所需要的订单消息
                    var getorderinfo = resultInfo.data;
                    var totalPrice = 0;
                    var orderinfo = '亲，你的订单号是：' + getorderinfo[0]['OrderID'] + ' ' + '\n' + '你所订购的商品为:' + '\n';
                    for (var key1 in getorderinfo) {
                        orderinfo += getorderinfo[key1].ProductName + ',数量为 ';
                        orderinfo += getorderinfo[key1].ProductCount + ' ;' + '\n';
                        totalPrice += getorderinfo[key1].ProductCount * getorderinfo[key1].ProductPrice;
                    }
                    orderinfo += "总共消费：" + totalPrice + '元  正在等待配送';
                    logger.writeInfo("[service/jinkebro/order/orderservice-------199行] 发送订单消息给用户");
                    return callback(false, orderinfo);
                });
            } else {
                var orderinfo = '对不起，您所需要的商品库存量不足';
                logger.writeError("service/jinkebro/order/orderservice-----204行]对不起，你所需要的商品库存量不足");
                return callback(false, orderinfo);
            }
        });
    });
}

/*待重构*/
//查找库存表来检查商品的库存量
Order.prototype.checkProductCount = function (productInfo, callback) {
    var me = this;
    console.log("商品的信息" + productInfo);
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
            me.linkOrderRoute(productInfo, function (orderInfo) {
                logger.writeInfo("[service/jinkebro/order/orderservice-----247行]在checkproductcount获取到了订单的消息");
                return callback(true, orderInfo);
            });
            productStock.updateStockInfo(resultInfo, function (resultInfo) {
                logger.writeInfo("[service/jinkebro/order/orderservice------248行]更新库存,库存减少掉已经订购完的商品");
                return;
            });
        } else {
            logger.writeInfo("[service/jinkebro/order/orderservice-----255行]库存量不足");
            callback(false, "库存量不足");
            return;
        }
    })

}

//查询库存，并返回正确的库存量
Order.prototype.queryCount = function (queryinfo, callback) {
    productStock.getStockInfo(queryinfo.ProductID, function (resultInfo) {
        console.log("查询货存的结果：" + resultInfo.data[0].TotalNum);
        //计算库存的剩余量
        var surplus = resultInfo.data[0].TotalNum - queryinfo.ProductCount;

        var updateStockInfo = {
            'ProductID': queryinfo.ProductID,
            'TotalNum': surplus
        }

        if (surplus >= 0) {
            logger.writeInfo("[service/jinkebro/order/orderservice -----274行]库存量足够");
            return callback(true, updateStockInfo);
        } else {
            logger.writeInfo("[service/jinkebro/order/orderservice -----277行]库存量不足");
            return callback(false, queryinfo.ProductID);
        }

    })
}
/*********************************************** */

//通过http的post将数据传送到order的后端接口
Order.prototype.linkOrderRoute = function (productInfo, callback) {
    var postUrl = config.jinkebro.baseUrl + config.jinkebro.order;
    var body = productInfo;
    var bodyString = JSON.stringify(body);

    //头文件
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': bodyString.length
    };

    var options = {
        host: config.jinkebro.host,
        port: '80',
        path: postUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(bodyString)
        }
    }

    var post_req = http.request(options, function (res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
            return;
        })
    });

    post_req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(e.message);
        return;
    });

    post_req.write(bodyString);
    post_req.end();
    return;
}

//通过http的形式来获取订单的信息，通过订单的ID
Order.prototype.getOrderInfo = function (orderID, callback) {
    console.log(orderID);
    var getUrl = config.jinkebro.baseUrl + config.jinkebro.order + "?OrderID=" + orderID.OrderID;
    console.log(getUrl);
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
                return callback(result);
            }
        }).on('error', function (e) {
            console.log("通过http.get获取订单的信息出错");
            logger.writeError('[service/jinkebro/order/orderservice-----352行] 通过http.get获取订单的信息失败');
        });
    });
    return;
}

//通过http.get的方法获取到用户的历史订单，通过用户的微信的唯一标示
Order.prototype.getHistoryOrderInfo = function (openid, callback) {
    logger.writeInfo("[service/jinkebro/order/orderservice-------------361行]获取某个用户的历史订单");
    var getUrl = config.jinkebro.baseUrl + config.jinkebro.order + "?WechatUserCode=" + openid;
    console.log("获取的url" + getUrl);
    http.get(getUrl, function (res) {
        var datas = [];
        var sizes = 0;
        res.on('data', function (data) {
            datas.push(data);
            sizes += data.length;
        });

        res.on('end', function () {
            var buff = Buffer.concat(datas, sizes);
            var result = JSON.parse(buff);

            if (callback && typeof (callback) === 'function') {
                
                return callback(result);
            }
        }).on('error', function (e) {
            console.log("通过http.get获取订单失败");
            logger.writeError('[service/jinkebro/order/orderservice------385行]通过http.get获取');
        });
    });
}

module.exports = new Order();