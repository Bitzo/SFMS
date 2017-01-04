/**
 * @Author: luozQ
 * @Date: 2017/1/4 20:40
 * @Last Modified by: luozQ
 * @Last Modified time:  2017/1/4 20:50
 * @Function: 库存单元测试
 */
require('../global_bootstrap')
var should = require('should');
var proStockService = appRequire('service/jinkebro/productstock/productstockservice');
var moment = require('moment');

var data = {
    'ProductID': 1,
    'TotalNum': 1,
    'StockAreaID': 11,
    'CreateUserID': 1,
    'CreateTime': moment().format('YYYY-MM-DD HH:mm:ss')
},
    insertProStockID = -1;
describe("库存单元测试", function () {

    it("库存新增", function (done) {
        proStockService.insert(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertProStockID = result.insertId;
            done();
        });
    });

    it("库存修改", function (done) {
        var updateData = {
            'ID':insertProStockID,
            'ProductID': 1,
            'TotalNum': 2,
            'StockAreaID': 22,
            'EditUserID': 2,
            EditTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        proStockService.update(updateData, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            result.changedRows.should.be.above(0).and.should.be.a.Number;
            console.log(result);
            done();
        });
    });

    it("库存查询", function (done) {
        var queryData = {
            'ID': insertProStockID,
            'ProductID': '',
            'TotalNum': '',
            'StockAreaID': '',
            'EditUserID': '',
        }
        proStockService.queryProStock(queryData, function (err, result) {
            if (err) return done(err);
            console.log(result);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("库存删除", function (done) {
        var data = {
            'ID': insertProStockID
        }
        proStockService.delete(data, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
});