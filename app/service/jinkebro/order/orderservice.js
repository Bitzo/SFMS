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

<<<<<<< HEAD
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
=======
Order.prototype.checkInput = function (res,input,string) {
    if(input === undefined){
        console.log(string + ' is undefined');
        res.status(404);
        return res.json({
            code : 404,
            isSuccess :false,
            msg : string + '没有输入'
        });
    }
}

>>>>>>> 3919b358e109d2b081b9ecdac98ed9429c81ebce
module.exports = new Order();