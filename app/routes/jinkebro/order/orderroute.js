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
    for(var key1 in req.query)
    {
        console.log("获取等到的url为" + key1);     
    }
   
    var page = (req.query.pageindex || req.query.pageindex) ? (req.query.pageindex || req.query.pageindex) : 1,
        pageNum = (req.query.pagesize || req.query.pagesize) ? (req.query.pagesize || req.query.pagesize) : 20,
        OrderID = req.query.OrderID || '',
        WechatUserCode = req.query.WechatUserCode || '',
        isPaging = req.query.isPaging || 0; //是否分页 0表示不分页,1表示分页

    console.log("获取到的orderid="+OrderID);
    page = page>0 ? page : 1;

    if (pageNum == ''){
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    var data = {
        page : page,
        pageNum : pageNum,
        "jit_ordercustomer.OrderID" : OrderID,
        "jit_customer.WechatUserCode" : WechatUserCode,
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

router.post('/full',function (req,res) {
    var stringinfo = {};
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
        ProductIDs = formdata.ProductIDs || [1,2,3],//数组，表示ProductID的集合
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
        if (result !== undefined && result.affectedRows != 0) {
            res.status(200);
            res.json({
                code : 200,
                isSuccess : true,
                msg : result
            });
            return ;
        }else {
            res.status(400);
            res.json({
                code : 400,
                isSuccess : true,
                msg : '订单新增失败'
            });
            return ;
        }

    });
});

router.post('/', function (req, res) {



    //检查所需要的字段是否都存在
    // var data = ['PayMethod', 'IsValid', 'IsActive'];
    // var err = 'require: ';
    // for (var value in data) {
    //     if (!(data[value] in formdata)) {
    //         err += data[value] + ' ';
    //     }
    // }
    // //如果要求的字段不在req的参数中
    // if (err !== 'require: ') {
    //     logger.writeError(err);
    //     res.status(400);
    //     return res.json({
    //         code: 404,
    //         isSuccess: false,
    //         msg: '存在未填写的必填字段' + err
    //     });
    // }
    var stringinfo = {};
    //获取到传到的值
    for(var key in req.body)
    {
        stringinfo = key;
    }
    var formdata = JSON.parse(stringinfo);
    var OrderTime = formdata.OrderTime || moment().format('YYYY-MM-DD HH:mm:ss'),
        PayMethod = formdata.PayMethod || 1,
        IsValid = formdata.IsValid || 1,
        IsActive = formdata.IsActive || 1,
        ProductIDs = formdata.ProductIDs,//数组，表示ProductID的集合
        ProductCounts = formdata.ProductCounts,
        CustomerID = formdata.CustomerID || 1;

        console.log(ProductIDs);
        console.log(CustomerID);

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
            return ;
        }

        if (result !== undefined && result.affectedRows != 0) {
            var InsertUserOrderData = {
                CustomerID : CustomerID,
                OrderID : result.insertId,
                IsActive : 1,
                CreateTime : moment().format('YYYY-MM-DD HH:mm:ss')
            };

            orderService.insertOrderCustomer(InsertUserOrderData,function (err,InsertUserOrderResult) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        addProductResult: result,
                        msg: '服务器出错，产品新增操作失败'
                    });
                    return ;
                }
            });

            var orderprod = {
                OrderID: result.insertId,
                ProductID: ProductIDs,
                ProductCount : ProductCounts
            };

            var flag = 1;
            var temp;
            for (var i = 0; i < orderprod.ProductID.length; i++) {
                temp = {
                    OrderID: result.insertId,
                    ProductID: orderprod.ProductID[i],
                    ProductCount : orderprod.ProductCount[i]
                }
                orderService.insertOrderProduct(temp, function (err, results) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            addProductResult: result,
                            msg: '服务器出错，产品新增操作失败'
                        });
                        return ;
                    }
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
                    insertOrderID: result.insertId,
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

router.put('/',function (req,res) {
    var formdata = JSON.parse(req.body.formdata);
    console.log(formdata);
    var OrderID = formdata.OrderID,
        PayMethod = formdata.PayMethod ,
        IsValid = formdata.IsValid ,
        IsActive = formdata.IsActive ,
        PayTime = formdata.PayTime,
        DeliveryTime = formdata.DeliveryTime,
        DeliveryUserID = formdata.DeliveryUserID,
        IsCancel = formdata.IsCancel,
        DiscountMoney = formdata.DiscountMoney,
        DiscountType = formdata.DiscountType,
        BizID = formdata.BizID,
        Memo = formdata.Memo,
        IsCheck = formdata.IsCheck,
        PDate = formdata.PDate,
        CancelTime = formdata.CancelTime;

    //检查要输入的部分
    // if (orderService.checkInput(res,OrderID,'OrderID') !== undefined){
    //     return ;
    // }
    //
    // if (orderService.checkInput(res,PayMethod,'PayMethod') !== undefined){
    //     return ;
    // }
    //
    // if (orderService.checkInput(res,IsValid,'IsValid') !== undefined){
    //     return ;
    // }
    // if(orderService.checkInput(res,IsActive,'IsActive') !== undefined){
    //     return ;
    // }
    // orderService.checkInput(res,PayTime,'PayTime');
    // orderService.checkInput(res,DeliveryTime,'DeliveryTime');
    // orderService.checkInput(res,DeliveryUserID,'DeliveryUserID');
    // orderService.checkInput(res,IsCancel,'IsCancel');
    // orderService.checkInput(res,DiscountMoney,'DiscountMoney');
    // orderService.checkInput(res,DiscountType,'DiscountType');
    // orderService.checkInput(res,BizID,'BizID');
    // orderService.checkInput(res,Memo,'Memo');
    // orderService.checkInput(res,IsCheck,'IsCheck');
    // orderService.checkInput(res,PDate,'PDate');
    // orderService.checkInput(res,CancelTime,'CancelTime');

    orderService.insertOrderFull({},function (err,result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器出错，产品新增操作失败'
            });
            return ;
        }
        res.status(200);
        res.json({
            code : 200,
            isSuccess : true,
            result : result
        });
        return ;
    });


});

router.delete('/',function (req,res) {
    res.status(200);
    return res.json({
        code : 200,
        isSuccess : true,
        msg : 'product delete '
    });
});


module.exports = router;