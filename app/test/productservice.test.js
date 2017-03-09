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

var data = {
        "SKU" : "unittestSKU1111",
        "ProductName": "香烟",
        "ProductDesc": '',
        "ProductImgPath": '',
        "ExpireTime": moment().format('YYYY-MM-DD HH:mm:ss'),
        "ProducTime": moment().format('YYYY-MM-DD HH:mm:ss'),
        "SupplierID": 13,
        "ProductPrice": 20,
        "OnSale": 1,
        "TotalNum" : 100,
        "StockAreaID" : 94,
        "CreateUserID" : 1,
        "CreateTime" : moment().format('YYYY-MM-DD HH:mm:ss'),
        "newProductTypeName" : "20支软盒装"
    },
    insertProductID = -1;

describe("商品单元测试", function () {

    it("商品新增", function (done) {
        productService.insertProduct(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertProductID = result.insertId;
            done();
        });
    });

    it("商品修改", function (done) {
        var updateData = {
            'SKU' : 'unittestSKU2222',
            'ProductName': '咖啡',
            'ProductDesc':'提神',
            'ProductImgPath':'',
            'ExpireTime': moment().format('YYYY-MM-DD HH:mm:ss'),
            'ProducTime': moment().format('YYYY-MM-DD HH:mm:ss'),
            'SupplierID':1,
            'ProductTypeID':14,
            'ProductPrice' : 13.5,
            'OnSale' : 1,
            'ProductID': insertProductID
        };

        productService.updateProduct(updateData, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("商品查询", function (done) {
        var queryData = {
            'jit_product.ProductID': insertProductID,
            'SKU' : '',
            'ProductName': '',
            'ProductDesc' : '',
            'ProductImgPath' : '',
            'ExpireTime' : '',
            'ProducTime' : '',
            'SupplierID' : '',
            'jit_product.ProductTypeID' : ''
        };

        productService.queryProducts(queryData, function (err, result) {
            if (err) return done(err);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("商品删除", function (done) {
        productService.deleteProduct({ProductID : insertProductID}, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
});