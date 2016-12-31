/**
 * @Author: Cecurio
 * @Date: 2016/12/14 20:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/14 20:23
 * @Function:
 */
var productDAL = appRequire('dal/jinkebro/product/productdal'),
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel');

var Product = function () {

}

//新增商品
Product.prototype.insertProduct = function (data, callback) {
    productDAL.insertProduct(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//编辑商品信息
Product.prototype.updateProduct = function (data, callback) {
    productDAL.updateProduct(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//查询商品信息
Product.prototype.queryProducts = function (data, callback) {

    var formData = {
        ProductID: data.ProductID,
        SKU: data.SKU,
        ProductName: data.ProductName,
        ProductDesc: data.ProductDesc,
        ProductImgPath: data.ProductImgPath,
        ExpireTime: data.ExpireTime,
        ProducTime: data.ProducTime,
        SupplierID: data.SupplierID,
        ProductTypeID: data.ProductTypeID

    };

    productDAL.queryProducts(formData, function (err, result) {
        if (err) {
            callback(true);
            return;
        }

        callback(false, result);
    });
}

//根据商品类型ID得到该商品类型下商品的个数
Product.prototype.getProCountByID = function (data, callback) {
    if (data == undefined || data.ID == '') {
        callback(true);
        return;
    }
    productDAL.getProCountByID(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, result);
    });
}

module.exports = new Product();