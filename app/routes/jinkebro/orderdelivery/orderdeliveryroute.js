/**
 * @Author: Duncan
 * @Date: 2017/1/21 11:08
 * @Last Modified by: Duncan
 * @Last Modified time: 
 * @Function: 订单的配送员
 */
 
 var express = require('express'),
    router = express.Router(),
    url = require('url');
	
//订单配送员的逻辑组件
var orderDelivery = appRequire('service/jinkebro/orderdelivery/orderdeliveryservice'),
	orderDelieveryModel = appRequire('model/jinkebro/orderdelivery/orderdeliverymodel'),
	moment = require('moment');
	
router.post('/', function (req, res) {
	//接受前端的数据
	var formdata = req.body.formdata;
	
	var data =['OrderID', 'DeliveryUserID'];
	var err = 'require: ';
	for (var value in data) {
		if (!(data[value] in formdata)) {
			err += data[value] + ' ';
		}
	}
	
	if (err !== 'require: ') {
		logger.writeError(err); 
		res.status(400);
		return res.json({
			code: 400,
			isSuccess: false,
			msg: '存在未填写的必填的字段' + err
		});
	}
	
	var OrderID = formdata.OrderID,
		DeliveryUserID = formdata.UserID;
		
		//接收的数据进行object然后来插入
	var insertData = {
		'OrderID': OrderID,
		'DeliveryUserID': DeliveryUserID
	}	
	
	for (var key in insertData) {
        if (isNaN(insertData[key])) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + insertData[key] + '不是数字'
            });
        }
    }
	
	//执行插入操作
    orderDelivery.insertOrderDelivery(insertData, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                addProductResult: result,
                msg: '服务器出错，订单配送员新增操作失败'
            });
        }


        if (result !== undefined && result.affectedRows != 0) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                addProductResult: result,
                msg: '一条订单配送员记录添加成功'
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "订单配送员添加操作失败"
            });
        }
    });

});

module.exports = router;