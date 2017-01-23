/**
 * @Author: Duncan
 * @Date: 2016/1/15 22:33
 * @Last Modified by: Duncan
 * @Last Modified time: 
 * @Function: 微信用户端的测试
 */
 
require('../global_bootstrap');
var should = require('should');
var moment = require('moment');
var customerService = appRequire('service/jinkebro/customer/customerservice');

var insertCustomerID = 0;
var data = {
	"WechatUserCode": 'test',
	'Phone': 13260906602,
	'CustomerAccount': '',
	'CustomerUserName': '测试',
	'AreaID': 1,
	'DormID': 1,
	'HouseNum': 'A417',
	'BalanceNum': 0,
	'CreditPoint': 0,
	'Sex': 1,
	'NickName': '测试',
	'MemberLevelID': 1,
	'Country': '',
	'IsActive': 1,
	'CreateTime': moment().format('YYYY-MM-DD HH:mm:ss'),
	'City': '',
	'Memo': '',
	'UpdateTime': moment().format('YYYY-MM-DD HH:mm:ss')
};

describe("微信客户的单元测试", function () {
	it("客户的新增" , function (done) {
		customerService.insert(data, function(err, result) {
			if(err) return done(err);
			result.insertId.should.be.above(0).and.should.be.a.Number;
			console.log("[test/customer.test.js---------------40行]" + result.insertId);
			insertCustomerID = result.insertId;
			done();
		});
	});
	
	it("客户的查询", function(done) {
		data.CustomerID = insertCustomerID;
		customerService.query({}, function(err, result) {
			if(err) {
				return done(err);
			}
			result[0].CustomerID.should.be.above(0).and.should.be.a.Number;
			done();
		});
	});
	
	it("客户的地址的更新", function(done) {
		data.Lon = 1111111;
		data.Lat = 1111111;
		customerService.update(data, function(err, result) {
			if(err) {
				return done(err);
			}
			result.affectedRows.should.be.above(0).and.should.be.a.Number;
			done();
		});
	});
	
	it("客户逻辑删除（将IsActive = 0 更新）", function(done) {
		data.CustomerID = insertCustomerID;
		data.IsActive = 0;
		customerService.update(data, function(err,  result) {
			if (err) {
				return done(err);
			}
			result.affectedRows.should.be.above(0).and.should.be.a.Number;
			done();
		});
	});
});

