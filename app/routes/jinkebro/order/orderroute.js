/**
 * @Author: Cecurio
 * @Date: 2017/1/2 17:36
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 17:36
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url');

//订单业务逻辑组件
var orderService = appRequire('service/jinkebro/order/orderservice'),
    moment = require('moment');

router.get('/',function (req,res) {
    var query = JSON.parse(req.query.f);
    var page = (req.query.pageindex || query.pageindex) ? (req.query.pageindex || query.pageindex) : 1,
        pageNum = (req.query.pagesize || query.pagesize) ? (req.query.pagesize || query.pagesize) : 20,
        OrderID = query.OrderID || '',
        isPaging = query.isPaging || 1;

    page = page>0 ? page : 1;

    if (pageNum == ''){
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    var data = {
        page : page,
        pageNum : pageNum,
        OrderID : OrderID,
        isPaging : isPaging
    };

    var intdata = {
        page : page,
        pageNum : pageNum,
        OrderID : OrderID
    };

    for (var key in intdata){
        if(isNaN(intdata[key]) && intdata[key] != ''){
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + intdata[key] + '不是数字'
            });
        }
    }

    orderService.CountOrders(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                errorMsg: "查询失败，服务器内部错误"
            });
        }
        if (results !== undefined && results.length != 0) {
            countNum = results[0]['num'];

            //查询所需的详细数据
            orderService.queryOrders(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (result !== undefined && result.length != 0 && countNum != -1) {
                    var resultBack = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:pageNum,
                        totalPage: Math.ceil(countNum/pageNum),
                        data: result
                    };
                    if(resultBack.curPage == resultBack.totalPage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage-1)*pageNum;
                    }
                    res.status(200);
                    //console.log(resultBack);
                    return res.json(resultBack);
                } else {
                    res.status(200);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应订单"
                    });
                }
            });
        } else {
            res.status(200);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相应订单"
            });
        }
    });
});

router.post('/', function (req, res) {

    var formdata = JSON.parse(req.body.formdata);
    //检查所需要的字段是否都存在
    var data = ['PayMethod', 'IsValid', 'IsActive'];
    var err = 'require: ';
    for (var value in data) {
        if (!(data[value] in formdata)) {
            err += data[value] + ' ';
        }
    }
    //如果要求的字段不在req的参数中
    if (err !== 'require: ') {
        logger.writeError(err);
        res.status(400);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: '存在未填写的必填字段' + err
        });
    }

    var OrderTime = formdata.OrderTime || moment().format('YYYY-MM-DD HH:mm:ss'),
        PayMethod = formdata.PayMethod,
        IsValid = formdata.IsValid,
        IsActive = formdata.IsActive;
        // ProductIDs = formdata.ProductIDs,
        // ProductNames = formdata.ProductNames;

    // 存放接收的数据
    var insertdata = {
        OrderTime: OrderTime,
        PayMethod: PayMethod,
        IsValid: IsValid,
        IsActive: IsActive
    };

    var intdata = {
        PayMethod: PayMethod,
        IsValid: IsValid,
        IsActive: IsActive
    };

    for (var key in intdata) {
        if (isNaN(intdata[key])) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + intdata[key] + '不是数字'
            });
        }
    }

    var requiredvalue = '缺少输入参数：';
    for (var key in insertdata) {
        if (key != 'CancelTime' && key != 'DiscountMoney') {
            if (insertdata[key].length == 0) {
                requiredvalue += key + ' ';
                logger.writeError(requiredvalue);
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: requiredvalue
                });
            }
        }

    }

    //执行插入操作
    orderService.insertOrder(insertdata, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                addProductResult: result,
                msg: '服务器出错，产品新增操作失败'
            });
        }


        if (result !== undefined && result.affectedRows != 0) {

            var orderprod = {
                OrderID: result.insertId,
                ProductID: [1,1,1],//ProductIDs,
                ProductName: ['辣条','辣条','辣条']//ProductNames
            }

            var flag = 1;
            var temp;
            for (var i = 0; i < orderprod.ProductID.length; i++) {
                temp = {
                    OrderID: result.insertId,
                    ProductID: orderprod.ProductID[i],
                    ProductName: orderprod.ProductName[i]
                }
                orderService.insertOrderProduct(temp, function (err, results) {
                    if (results !== undefined && results.affectedRows == 0) {
                        flag = 0;
                    }
                });
            }
            if (flag == 1) {
                res.status(200);
                return res.json({
                    code: 200,
                    isSuccess: true,
                    msg: '一条订单记录添加成功'
                });
            }

        } else {
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