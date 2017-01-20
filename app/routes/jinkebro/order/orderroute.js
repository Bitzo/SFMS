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
    orderModel = appRequire('model/jinkebro/order/ordermodel'),
    moment = require('moment'),
    validator = require('validator');

/**
 * 查询order表的信息
 */
router.get('/order',function (req,res) {
    //接收前端数据
    var page = (req.query.pageindex || req.query.pageindex) ? (req.query.pageindex || req.query.pageindex) : 1,
        pageNum = (req.query.pagesize || req.query.pagesize) ? (req.query.pagesize || req.query.pagesize) : 20,
        OrderID = req.query.OrderID || '',
        isPaging = (req.query.isPaging !== undefined) ? (req.query.isPaging) : 1, //是否分页 0表示不分页,1表示分页
        IsActive = (req.query.IsActive !== undefined) ? (req.query.IsActive) : '',
        OrderStatus = req.query.OrderStatus || '';

    var sendData = {
        page :page,
        pageNum : pageNum,
        OrderID : OrderID,
        isPaging : isPaging,
        IsActive : IsActive,
        OrderStatus : OrderStatus
    };
    var countNum = -1;
    orderService.CountOrders(sendData, function (err, results) {
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
            orderService.queryOrders(sendData, function (err, result) {
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
                        curPageNum: pageNum,
                        totalPage: Math.ceil(countNum / pageNum),
                        data: result
                    };
                    if (resultBack.curPage == resultBack.totalPage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage - 1) * pageNum;
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

/**
 * 查询订单产品信息
 */
router.get('/', function (req, res) {
    var f = JSON.parse(req.query.f);
    //接收前端数据
    var page = (req.query.pageindex || req.query.pageindex) ? (req.query.pageindex || req.query.pageindex) : 1,
        pageNum = (req.query.pagesize || req.query.pagesize) ? (req.query.pagesize || req.query.pagesize) : 20,
        OrderID = f.OrderID || '',
        WechatUserCode = req.query.WechatUserCode || '',
        isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 1, //是否分页 0表示不分页,1表示分页
        IsActive = (req.query.IsActive !== undefined) ? (req.query.IsActive) : 1,
        CustomerID = req.query.CustomerID || '',
        ProductID = req.query.ProductID || [],
        OrderStatus = f.OrderStatus || '',
        ProductCount = req.query.ProductCount || [];
    //前端传来的是字符串,转化为对象
    if (typeof ProductID == "string") {
        ProductID = JSON.parse(ProductID);
    }
    if (typeof ProductCount == "string") {
        ProductCount = JSON.parse(ProductCount);
    }

    console.log("获取到的orderid=" + OrderID);

    page = page > 0 ? page : 1;
    if (pageNum == '') {
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    // 传到dal的数据
    var sendData = {
        page : page,
        pageNum : pageNum,
        isPaging : isPaging,
        ProductID : ProductID,
        ProductCount : ProductCount,
        OrderID : OrderID,
        WechatUserCode : WechatUserCode,
        CustomerID : CustomerID,
        OrderStatus : OrderStatus,
        IsActive : IsActive
    };

    // 应该是整型的数据
    var intdata = {
        page: page,
        pageNum: pageNum,
        OrderID: OrderID
    };
    for (var key in intdata) {
        if (isNaN(intdata[key]) && intdata[key] != '') {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + intdata[key] + '不是数字'
            });
        }
    }

    orderService.CountOrderProduct(sendData, function (err, results) {
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
            orderService.queryOrderProduct(sendData, function (err, result) {
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
                        curPageNum: pageNum,
                        totalPage: Math.ceil(countNum / pageNum),
                        data: result
                    };
                    if (resultBack.curPage == resultBack.totalPage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage - 1) * pageNum;
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

/**
 * 使用事务新增一条订单的路由
 * success-responce:
 * {
 *  "code": 200,
 *  "isSuccess": true,
 *  "insertId": 463
 * }
 *
 * fail-responce:
 * {
 *   "code": 400,
 *   "isSuccess": true,
 *   "msg": "库存不足"
 * }
 */
router.post('/',function (req,res) {
    var stringinfo = '';
    // 获取到传到的值
    for(var key in req.body)
    {
        stringinfo = key;
    }
    var formdata = JSON.parse(req.body.formdata);
    var OrderTime = formdata.OrderTime || moment().format('YYYY-MM-DD HH:mm:ss'),
        PayMethod = formdata.PayMethod || 1,
        IsValid = formdata.IsValid || 1,
        IsActive = formdata.IsActive || 1,
        ProductIDs = formdata.ProductIDs || [1,2,5],//数组，表示ProductID的集合
        ProductCounts = formdata.ProductCounts || [2,1,3],
        CustomerID = formdata.CustomerID || 1,
        OrderStatus = formdata.OrderStatus || 1;

    // 存放接收的数据
    var insertdata = {
        OrderTime: OrderTime,
        PayMethod: PayMethod,
        IsValid: IsValid,
        IsActive: IsActive,
        ProductIDs : ProductIDs,
        ProductCounts : ProductCounts,
        CustomerID : CustomerID,
        OrderStatus : OrderStatus
    };

    //应该是int型的数据
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

    orderService.insertOrderFull(insertdata,function (err,result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器出错，产品新增操作失败'
            });
            return ;
        }
        if (result !== undefined && result.insertId != undefined) {
            res.status(200);
            res.json({
                code : 200,
                isSuccess : true,
                insertId : result.insertId,
                result : result
            });
            return ;
        }else {
            res.status(400);
            res.json({
                code : 400,
                isSuccess : true,
                msg : result
            });
            return ;
        }
    });
});

/**
 * 订单修改路由
 */
router.put('/', function (req, res) {
    // 使string(req.body.formdata)变成object(formdata)
    var formdata = JSON.parse(req.body.formdata);

    // 接收前端传过来的变量
    var OrderID = formdata.OrderID ,     //not null
        OrderTime = formdata.OrderTime || '',  //not null
        PayMethod = formdata.PayMethod || '', //not null
        IsValid = (formdata.IsValid != undefined) ? (formdata.IsValid) : '',       //not null
        IsActive = (formdata.IsActive != undefined) ? (formdata.IsActive) : '',    //not null
        PayTime = formdata.PayTime,
        DeliveryTime = formdata.DeliveryTime,
        DeliveryUserID = formdata.DeliveryUserID,
        IsCancel = formdata.IsCancel,
        CancelTime = formdata.CancelTime,
        DiscountMoney = formdata.DiscountMoney,
        DiscountType = formdata.DiscountType,
        BizID = formdata.BizID,
        Memo = formdata.Memo,
        IsCheck = formdata.IsCheck,
        PDate = formdata.PDate,
        OrderStatus = (formdata.OrderStatus != undefined) ? (formdata.OrderStatus) : '';  //not null

    //检查必填字段是否存在
    // var mandatoryFieldData = ['OrderID','OrderTime','PayMethod', 'IsValid', 'IsActive','OrderStatus'];
    if (orderService.checkInput(res, OrderID, 'OrderID') !== undefined) {
        return;
    }

    /**
     * 检验一个变量的值是否为正整数
     * @param intData
     * @param intDataDesc
     */
    function checkIsInt(intData,intDataDesc) {
        var returnErrInfo = {
            "msg": "参数不能为空!"
        };
        if(intData == undefined){
            return ;
        }
        if (isNaN(intData)) {
            returnErrInfo.msg = intDataDesc + "必须是一个整数!";
            res.status(400);
            return res.json({
                code : 400,
                isSuccess : true,
                msg : returnErrInfo.msg
            });

        }else {
            if (intData < 0) {
                returnErrInfo.msg = intDataDesc + "必须是一个正整数!";
                if (intDataDesc == 'IsActive' || intDataDesc == 'IsValid') {
                    returnErrInfo.msg = intDataDesc + "必须是0或者是一个正整数!";
                }
                res.status(400);
                return res.json({
                    code : 400,
                    isSuccess : true,
                    msg : returnErrInfo.msg
                });
            }
        }
    }

    // 数据完整性校验
    if (OrderID != undefined && checkIsInt(OrderID,'OrderID') !== undefined) {
        return ;
    }

    if (IsActive != undefined && checkIsInt(IsActive,'IsActive') !== undefined) {
        return ;
    }

    if (OrderStatus != undefined && checkIsInt(OrderStatus,'OrderStatus') !== undefined) {
        return ;
    }

    var countData = {
        OrderID : OrderID,
        OrderStatus : '',
        IsActive : '',
    };

    var sendData = {
        OrderStatus : OrderStatus,
        IsActive : IsActive,
        OrderID : OrderID
    };

    orderService.CountOrders(countData, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                errorMsg: "查询失败，服务器内部错误"
            });
        }
        if (results !== undefined && results.length != 0 && results[0]['num'] != 0) {
            // 订单修改
            orderService.updateOrder(sendData,function (err,result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错，产品修改操作失败'
                    });
                    return ;
                }

                if (result !== undefined && result.affectedRows != 0) {
                    res.status(200);
                    res.json({
                        code : 200,
                        isSuccess : true,
                        msg : '订单修改成功'
                    });
                    return ;
                }else {
                    res.status(400);
                    res.json({
                        code : 400,
                        isSuccess : true,
                        msg : '订单修改失败'
                    });
                    return ;
                }
            });
        }else {
            res.status(404);
            res.json({
                code : 404,
                isSuccess : true,
                msg : '要修改的订单不存在，订单修改失败'
            });
            return ;
        }
    });


});

router.delete('/', function (req, res) {
    res.status(200);
    return res.json({
        code: 200,
        isSuccess: true,
        msg: 'product delete '
    });
});


module.exports = router;