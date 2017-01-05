/**
 * @Author: Cecurio
 * @Date: 2017/1/2 17:39
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 17:39
 * @Function:
 */
var orderDAL = appRequire('dal/jinkebro/order/orderdal'),
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel');
    

var Order = function () {

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

//新增订单
Order.prototype.insertOrderProduct = function (data, callback) {
    orderDAL.insertOrderProduct(data, function (err, result) {
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

        for(var i=0;i<result.length; i++){
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

//根据用户的信息来将订单的内容插入进数据库
Order.prototype.insertOrderInfo = function(msg)
{
    var productInfo= msg.split('|');
    for(var eachProduct in productInfo)
    {
       var eachOrderInfo = eachProduct.split('#');
       var orderInfo = {
           'ProductID' : eachOrderInfo[0],
           'Num'  : eachOrderInfo[1]
       }
    }
}
module.exports = new Order();