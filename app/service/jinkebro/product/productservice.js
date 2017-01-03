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
    logModel = appRequire('model/jinkebro/log/logmodel'),
    config = appRequire('config/config');
var http =require('http');
var logger = appRequire('util/loghelper').helper;
var logService = appRequire('service/backend/log/logservice');
var logModel = appRequire('model/jinkebro/log/logmodel');
//日期组件
var moment = require('moment');
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

//删除商品
Product.prototype.deleteProduct = function (data, callback) {
    productDAL.deleteProduct(data, function (err, result) {
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

    productDAL.queryProducts(data, function (err, result) {
        if (err) {
            callback(true);
            return;
        }
        var tempTimeStamp,temp;
        var days = 60*60*24*1000;
        for(var i=0;i<result.length; i++){
            tempTimeStamp = (Date.parse(result[i].ExpireTime) - Date.parse(new Date())) / days;
            temp = Math.ceil(tempTimeStamp.toFixed(4));
            result[i]['remainTime'] = temp;
            result[i].ExpireTime = moment(result[i].ExpireTime).format('YYYY-MM-DD HH:mm:SS');
            result[i].ProducTime = moment(result[i].ProducTime).format('YYYY-MM-DD HH:mm:SS');
        }
        for(var i=0;i<result.length; i++){

        }
        callback(false, result);
    });
}

//查询商品信息
Product.prototype.CountProducts = function (data, callback) {

    productDAL.CountProducts(data, function (err, result) {
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

//通过http的get方法直接获取信息
Product.prototype.getProductInfoThroughHttpGet  = function(callback) 
{
    
    var getUrl = config.jinkebro.baseUrl + config.jinkebro.productInfo;
    //var getUrl = '/jinkeBro/product';
    console.log(getUrl);
   http.get(getUrl, function (res) {
        var datas = [];
        var size = 0;
        res.on('data', function (data) {
            datas.push(data);
            size += data.length;
        });

        res.on("end", function () {
            var buff = Buffer.concat(datas, size);
            var result =JSON.parse(buff); //转码//var result = buff.toString();//不需要转编码,直接tostring  
            logService.insertOperationLog(logModel, function (err, insertId) {
                if (err) {
                    logger.writeError('获取微信商品信息成功，生成操作日志异常' + new Date());
                }
            });
            
            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });

    }).on('error', function (e) {
        logger.writeError('获取微信商品信息时异常' + new Date());
    });
}
module.exports = new Product();