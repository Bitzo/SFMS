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
var config = appRequire('config/config');
var orderDAL = appRequire('dal/jinkebro/order/orderdal'),
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel');
var productStock = appRequire('service/jinkebro/productstock/productstockservice');    
//关于客户方面的service
var customer = appRequire("service/jinkebro/customer/customerservice");
//关于库存
var productstock = appRequire('service/jinkebro/productstock/productstockservice');
//记录日志
var wechat = appRequire("service/wechat/wechatservice");
var logger = appRequire("util/loghelper").helper;
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

//删除订单
Order.prototype.deleteOrder = function (data, callback) {
    orderDAL.deleteOrder(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//编辑订单信息
Order.prototype.updateOrder = function (data, callback) {
    orderDAL.updateOrder(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//查询订单信息
Order.prototype.queryOrders = function (data, callback) {

    orderDAL.queryOrders(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        for (var i = 0; i < result.length; i++) {
            result[i].OrderTime = moment(result[i].OrderTime).format('YYYY-MM-DD HH:mm:SS');
        }

        callback(false, result);
    });
}

//查询订单信息
Order.prototype.CountOrders = function (data, callback) {

    orderDAL.CountOrders(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//检查输入的
Order.prototype.checkInput = function (res, input, string) {
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
    //根据“1#3|2#2”的输入格式来分割字符串
    var productInfo = msg.split('|');
    var productIDArray = [];
    var productCountArray = [];
    
    /*********直接用callback没事，但只要用了底下的一个function，就会报错 */
    //return callback("[service/order/orderservice]" + "订单的消息");
    /******** */
    customer.query(queryCustomerInfo, function (err, queryInfo) {
        if (err) {
            console.log("查询失败");
            var errinfo = '在添加用户的时候查询失败';
            logger.writeError('在添加用户的时候查询失败');
            callback(true, errinfo);
            return;
        }

        if (queryInfo != undefined && queryInfo.length != 0) {
            var orderInfo = {
                "CustomerID": queryInfo[0].CustomerID
            }

            //将订单格式的1#3，商品号，和数量分别放在两个数组中
            for (var key in productInfo) {
                var eachProductInfoOfOrder = productInfo[key].split('#');
                productIDArray.push(eachProductInfoOfOrder[0]);
                productCountArray.push(eachProductInfoOfOrder[1]);
            }
            orderInfo.ProductIDs = productIDArray;
            orderInfo.ProductCounts = productCountArray;

            me.checkproductcount(orderInfo, function (isSussess, resultInfo) {
                if (isSussess) {
                    var order = JSON.parse(resultInfo);
                    var orderID = {
                        "OrderID": order.insertOrderID
                    };
                    me.getOrderInfo(orderID, function (resultInfo) {
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
                        logger.writeInfo("发送订单消息给用户");
                        return callback(orderinfo);
                    });
                }
                else {
                    var orderinfo = '对不起，您所需要的商品库存量不足';
                    logger.writeError("对不起，你所需要的商品库存量不足");
                    return callback(orderinfo);
                }
            });

        }
        else {
            console.log('查询失败');
            logger.writeError("当插入订单的时候查无此用户");
            callback("当插入订单的时候查无此用户")
            return;
        }
    });
}

/*待重构*/
//查找库存表来检查商品的库存量
Order.prototype.checkproductcount = function (productInfo, callback) {
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
                logger.writeInfo("在checkproductcount获取到了订单的消息");
                return callback(true, orderInfo);
            });
            productStock.updateStockInfo(resultInfo, function (resultInfo) {
                logger.writeInfo("更新库存,库存减少掉已经订购完的商品");
                return;
            });
        }
        else {
            logger.writeInfo("库存量不足");
            callback(false);
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
            logger.writeInfo("库存量足够");
            return callback(true, updateStockInfo);
        }
        else {
            logger.writeInfo("库存量不足");
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
                callback(result);
                return;
            }
        }).on('error', function (e) {
            console.log("通过http.get获取订单的信息出错");
        });
    });
}
module.exports = new Order();