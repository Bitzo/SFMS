/**
 * @Author: Duncan
 * @Date: 2016/1/21 13:16
 * @Last Modified by: Duncan
 * @Last Modified time: 
 * @Function: 订单配送员的单元功能点的测试
 */

require('../global_bootstrap');
var should = require('should');
var orderDliveryService = appRequire('service/jinkebro/orderdelivery/orderdeliveryservice');

var data = {
	'OrderID': 0,
	'DeliveryUserID': 1,
}

console.log(typeof(orderDliveryService));
var insertID = -1;
describe('订单的配送员的单元', function () {
	it('订单配送员的新增', function (done) {
		orderDliveryService.insertOrderDelivery(data, function (err, insertInfo) {
			if (err) {
				return done(err);
			}

			insertInfo.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = insertInfo.insertId;
            done();
		});
	});

	it('订单配送员部分的查询', function (done) {
		data.ID = insertID;
		orderDliveryService.queryOrderDelivery(data, function (err, result) {
			if (err) return done(err);
            result[0].ID.should.be.above(0).and.should.be.a.Number;
            done();
		});
	});

	it('订单配送员的修改', function (done) {
		data.ID = insertID;
		orderDliveryService.updateOrderDelivery(data, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
	});
});