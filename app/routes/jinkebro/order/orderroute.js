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
var orderService = appRequire('service/jinkebro/order/orderservice');

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






module.exports = router;