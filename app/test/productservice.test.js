/**
 * @Author: Cecurio
 * @Date: 2016/12/15 18:46
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/15 18:46
 * @Function:
 */
require('../global_bootstrap')
var should = require('should');
var productService = appRequire('service/jinkebro/product/productservice');
var moment = require('moment');

var data={
    'SKU' : 'pdt003',
    'ProductName': '香烟',
    'ProductDesc':'',
    'ProductImgPath':'',
    'ExpireTime': moment().format('YYYY-MM-DD HH:mm:ss'),
    'ProducTime': moment().format('YYYY-MM-DD HH:mm:ss'),
    'SupplierID':1,
    'ProductTypeID':1
    },
    insertProductID = -1;

describe("产品单元测试", function () {

    it("产品新增", function (done) {
        productService.insertProduct(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertProductID = result.insertId;
            done();
        });
    });

    it("产品修改", function (done) {
        var updateData = {
            'SKU' : 'pdt003',
            'ProductName': '香烟',
            'ProductDesc':'吸烟有害健康',
            'ProductImgPath':'',
            'ExpireTime': moment().format('YYYY-MM-DD HH:mm:ss'),
            'ProducTime': moment().format('YYYY-MM-DD HH:mm:ss'),
            'SupplierID':1,
            'ProductTypeID':1,
            'ProductID': insertProductID
        }
        productService.updateProduct(updateData, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            result.changedRows.should.be.above(0).and.should.be.a.Number;
            console.log(result);
            done();
        });
    });

    it("产品查询", function (done) {
        var queryData = {
            'ProductID': insertProductID,
            'SKU' : '',
            'ProductName': '',
            'ProductDesc' : '',
            'ProductImgPath' : '',
            'ExpireTime' : '',
            'ProducTime' : '',
            'SupplierID' : '',
            'ProductTypeID' : 1
        }
        productService.queryProducts(queryData, function (err, result) {
            if (err) return done(err);
            console.log(result);
            result.length.should.be.above(0).and.should.be.a.Number;

            done();
        });
    });

});