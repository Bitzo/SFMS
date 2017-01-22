/**
 * @Author: Cecurio
 * @Date: 2017/1/17 16:21
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/17 16:21
 * @Function:
 */
require('../global_bootstrap')
var should = require('should');
var orderService = appRequire('service/jinkebro/order/orderservice');
var orderModel = appRequire('model/jinkebro/order/ordermodel');
var moment = require('moment');

var data = {
        "OrderTime": moment().format('YYYY-MM-DD HH:mm:ss'),
        "PayMethod": 1,
        "IsValid": 1,
        "IsActive": 1,
        "ProductIDs": [
            1,
            2,
            5
        ],
        "ProductCounts": [
            2,
            1,
            3
        ],
        "CustomerID": 1,
        "OrderStatus": 1
    },
    insertOrderID = -1;

describe("订单单元测试", function () {

    it("订单新增", function (done) {
        orderService.insertOrderFull(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertOrderID = result.insertId;
            done();
        });
    });

    it("订单修改", function (done) {
        var updateOrderData = {
            OrderID: insertOrderID,
            OrderTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            PayTime: '',
            DeliveryTime: '',
            PayMethod: 1,
            IsValid: 1,
            IsActive: '0',
            DeliveryUserID: '',
            IsCancel: '',
            CancelTime: '',
            DiscountMoney: '',
            DiscountType: '',
            BizID: '',
            Memo: '',
            IsCheck: '',
            PDate: '',
            OrderStatus: 3
        };
        orderService.updateOrder(updateOrderData, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("订单查询", function (done) {
        // data的格式如下
        var queryOrderData = {
            page : 1,
            pageNum : 20,
            isPaging : 0,
            ProductID : [],
            ProductCount : [],
            OrderID : insertOrderID,
            WechatUserCode : '',
            CustomerID : '',
            OrderStatus : '',
            IsActive : ''
        };

        orderService.queryOrders(queryOrderData, function (err, result) {
            if (err) return done(err);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

});