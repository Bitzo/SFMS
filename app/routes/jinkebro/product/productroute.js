/**
 * @Author: Cecurio
 * @Date: 2016/12/30 20:35
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/30 20:35
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url');

//产品业务逻辑组件
var productService = appRequire('service/jinkebro/product/productservice'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config'),
    moment = require('moment');

//产品的新增
router.post('/',function (req,res) {
    console.log(req.body.formdata);
    // 检查所需要的字段是否都存在
    var data = ['SKU','ProductName','ExpireTime','ProducTime','SupplierID','ProductTypeID'];
    var err = 'require: ';
    for (var value in data){
        if(!(data[value] in req.body.formdata)){
            err += data[value] + ' ';
        }
    }
    //如果要求的字段不在req的参数中
    if(err !== 'require: ') {
        logger.writeError(err);
        res.status(400);
        return res.json({
            code:404,
            isSuccess: false,
            msg: '存在未填写的必填字段' + err
        });
    }

    var SKU = req.body.formdata.SKU;
    var ProductName = req.body.formdata.ProductName;
    var ProductDesc = req.body.formdata.ProductDesc || '';
    var ProductImgPath = req.body.formdata.ProductImgPath || '';
    var ExpireTime = (req.body.formdata.ExpireTime) ? (req.body.formdata.ExpireTime) : moment().format('YYYY-MM-DD HH:mm:ss');
    var ProducTime = (req.body.formdata.ProducTime) ? (req.body.formdata.ProducTime) : moment().format('YYYY-MM-DD HH:mm:ss');
    var SupplierID = req.body.formdata.SupplierID;
    var ProductTypeID = req.body.formdata.ProductTypeID;

    // 存放接收的数据
    var insertdata = {
        "SKU" : SKU ,
        "ProductName" : ProductName,
        "ProductDesc" : ProductDesc,
        "ProductImgPath" : ProductImgPath,
        "ExpireTime" : ExpireTime,
        "ProducTime" : ProducTime,
        "SupplierID" :SupplierID,
        "ProductTypeID" : ProductTypeID
    };

    var intdata = {
        "SupplierID" :SupplierID,
        "ProductTypeID" : ProductTypeID
    };

    for (var key in intdata){
        if(isNaN(intdata[key])){
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + intdata[key] + '不是数字'
            });
        }
    }

    var requiredvalue = '缺少输入参数：';
    for(var key in insertdata){
        if(key != 'SupplierID' && key != 'ProductTypeID'){
            if(insertdata[key].length == 0){
                requiredvalue += key + ' ';
                logger.writeError(requiredvalue);
                res.status(404);
                return res.json({
                    code :404,
                    isSuccess : false,
                    msg : requiredvalue
                });
            }
        }

    }

    //执行插入操作
    productService.insertProduct(insertdata,function (err,result) {
        if(err){
            res.status(500);
            return res.json({
                code : 500,
                isSuccess : false,
                addMenuResult:result,
                msg : '服务器出错，产品新增操作失败'
            });
        }


        if(result !== undefined && result.affectedRows != 0){
            res.status(200);
            return res.json({
                code : 200,
                isSuccess : true,
                addMenuResult:result,
                msg : '一条产品记录添加成功'
            });
        }else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "产品添加操作失败"
            });
        }
    });

});
module.exports = router;