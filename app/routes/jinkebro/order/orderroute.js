/**
 * @Author: Cecurio
 * @Date: 2017/1/2 17:36
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 17:36
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url'),
    async = require('async');

//订单业务逻辑组件
var orderService = appRequire('service/jinkebro/order/orderservice'),
    orderModel = appRequire('model/jinkebro/order/ordermodel'),
    moment = require('moment'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    validator = require('validator');

/**
 * 查询order表的信息,只是展示每条订单的信息，没有订单商品信息
 */
router.get('/order', function (req, res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.jinkeBroApp.orderManger.orderQuery.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var query = JSON.parse(req.query.f);
        //接收前端数据
        var page = (req.query.pageindex) ? (req.query.pageindex) : 1,
            pageNum = (req.query.pagesize) ? (req.query.pagesize) : 20,
            OrderID = query.OrderID || '',
            isPaging = (req.query.isPaging !== undefined) ? (req.query.isPaging) : 0, //是否分页 0表示不分页,1表示分页
            IsActive = (query.IsActive !== undefined) ? (query.IsActive) : '',
            OrderStatus = query.OrderStatus || '';

        var sendData = {
            page: page,
            pageNum: pageNum,
            OrderID: OrderID,
            isPaging: isPaging,
            IsActive: IsActive,
            OrderStatus: OrderStatus
        };

        var queueAllResult = [];
        var countNum = -1;
        var flag = 0;

        orderService.CountOrders(sendData, function (err, results) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    errorMsg: "查询失败，服务器内部错误"
                });
            }

            if (results == undefined || results.length == 0 || results[0]['num'] <= 0) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应订单"
                });
            }

            countNum = results[0]['num'];

            //查询所需的详细数据
            //所有的订单数据 result
            orderService.queryOrders(sendData, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (result == undefined || result.length == 0) {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应订单"
                    });
                }

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
                //执行顺序1

                // 去计算价格
                async.map(result, function (item, callback) {
                    var tempOrderID = item.OrderID;
                    orderService.queryOrderProduct({ "OrderID": tempOrderID }, function (err, tags) {
                        var tempSumOfMoney = 0;
                        for (var i = 0; i < tags.length; i++) {
                            tempSumOfMoney += tags[i].ProductPrice * tags[i].ProductCount;
                        }
                        item['totalMoney'] = tempSumOfMoney.toFixed(2);
                        callback(null, item);
                    })
                }, function (err, results1) {
                    // !!!!!! 在此res.status() 、 res.json()  !!!!!!
                    //执行顺序2
                    for (var i = 0; i < results1.length; i++) {
                        queueAllResult[i] = results1[i];
                        if (i == results1.length - 1) {
                            flag = 1;
                        }
                    }
                    if (flag == 1) {
                        res.status(200);
                        return res.json(resultBack);
                    }
                    console.log(queueAllResult);
                });
            });
        });
    });
});

/**
 * 查询订单产品信息
 * 根据订单号查看该订单的信息
 * 包括商品的名称 数量
 * 该订单的总价
 */
router.get('/', function (req, res) {
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.jinkeBroApp.orderManger.orderQuery.functionCode
    }

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var f = JSON.parse(req.query.f);
        //接收前端数据
        var page = (req.query.pageindex || req.query.pageindex) ? (req.query.pageindex || req.query.pageindex) : 1,
            pageNum = (req.query.pagesize || req.query.pagesize) ? (req.query.pagesize || req.query.pagesize) : 20,
            OrderID = f.OrderID || '',
            WechatUserCode = req.query.WechatUserCode || '',
            isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 1, //是否分页 0表示不分页,1表示分页
            IsActive = (req.query.IsActive !== undefined) ? (req.query.IsActive) : '',
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

        page = page > 0 ? page : 1;
        if (pageNum == '') {
            pageNum = config.pageCount;
        }

        //用于查询结果总数的计数
        var countNum = 0;

        // 传到dal的数据
        var sendData = {
            page: page,
            pageNum: pageNum,
            isPaging: isPaging,
            ProductID: ProductID,
            ProductCount: ProductCount,
            OrderID: OrderID,
            WechatUserCode: WechatUserCode,
            CustomerID: CustomerID,
            OrderStatus: OrderStatus,
            IsActive: IsActive
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

            if (results == undefined || results.length == 0) {
                res.status(200);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应订单"
                });
            }

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

                if (result == undefined || result.length == 0 ) {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应订单"
                    });
                }

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
                return res.json(resultBack);
            });
        });
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
router.post('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.orderManger.orderAdd.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var stringinfo = '';
        // 获取到传到的值
        for (var key in req.body) {
            stringinfo = key;
        }

        var formdata = JSON.parse(req.body.formdata);
        var OrderTime = formdata.OrderTime || moment().format('YYYY-MM-DD HH:mm:ss'),
            PayMethod = formdata.PayMethod || 1,
            IsValid = formdata.IsValid || 1,
            IsActive = formdata.IsActive || 1,
            ProductIDs = formdata.ProductIDs || [1, 2, 3],//数组，表示ProductID的集合
            ProductCounts = formdata.ProductCounts || [2, 1, 9],
            CustomerID = formdata.CustomerID || 3,
            OrderStatus = formdata.OrderStatus || 1;

        // 存放接收的数据
        var insertdata = {
            OrderTime: OrderTime,
            PayMethod: PayMethod,
            IsValid: IsValid,
            IsActive: IsActive,
            ProductIDs: ProductIDs,
            ProductCounts: ProductCounts,
            CustomerID: CustomerID,
            OrderStatus: OrderStatus
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

        orderService.insertOrderFull(insertdata, function (err, result) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '服务器内部出错！'
                });
            }
            if (result !== undefined && result.insertId != undefined) {
                res.status(200);
                res.json({
                    code: 200,
                    isSuccess: true,
                    msg: '下单成功，您的订单号是' + result.insertId,
                    insertId: result.insertId,
                    result: result
                });
                return;
            } else {
                res.status(400);
                res.json({
                    code: 400,
                    isSuccess: true,
                    msg: '下单失败',
                    result: result
                });
                return;
            }
        });
    });
});

/**
 * 订单修改路由
 */
router.put('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.orderManger.orderEdit.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    };

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        // 接收前端传过来的变量
        var OrderID = req.body.formdata.OrderID,     //not null
            OrderTime = req.body.formdata.OrderTime || '',  //not null
            PayMethod = req.body.formdata.PayMethod || '', //not null
            IsValid = (req.body.formdata.IsValid != undefined) ? (req.body.formdata.IsValid) : '',       //not null
            IsActive = (req.body.formdata.IsActive != undefined) ? (req.body.formdata.IsActive) : '',    //not null
            PayTime = req.body.formdata.PayTime,
            DeliveryTime = req.body.formdata.DeliveryTime,
            DeliveryUserID = req.body.formdata.DeliveryUserID,
            IsCancel = req.body.formdata.IsCancel,
            CancelTime = req.body.formdata.CancelTime,
            DiscountMoney = req.body.formdata.DiscountMoney,
            DiscountType = req.body.formdata.DiscountType,
            BizID = req.body.formdata.BizID,
            Memo = req.body.formdata.Memo,
            IsCheck = req.body.formdata.IsCheck,
            PDate = req.body.formdata.PDate,
            OrderStatus = (req.body.formdata.OrderStatus != undefined) ? (req.body.formdata.OrderStatus) : '';  //not null

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
        function checkIsInt(intData, intDataDesc) {
            var returnErrInfo = {
                "msg": "参数不能为空!"
            };

            if (intData == undefined) {
                return;
            }

            if (isNaN(intData)) {
                returnErrInfo.msg = intDataDesc + "必须是一个整数!";
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: true,
                    msg: returnErrInfo.msg
                });

            } else {
                if (intData < 0) {
                    returnErrInfo.msg = intDataDesc + "必须是一个正整数!";
                    if (intDataDesc == 'IsActive' || intDataDesc == 'IsValid') {
                        returnErrInfo.msg = intDataDesc + "必须是0或者是一个正整数!";
                    }
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: true,
                        msg: returnErrInfo.msg
                    });
                }
            }
        }

        // 数据完整性校验
        if (OrderID != undefined && checkIsInt(OrderID, '订单号') !== undefined) {
            return;
        }

        if (IsActive != undefined && checkIsInt(IsActive, '是否有效') !== undefined) {
            return;
        }

        if (OrderStatus != undefined && checkIsInt(OrderStatus, '订单状态') !== undefined) {
            return;
        }

        var countData = {
            OrderID: OrderID,
            OrderStatus: '',
            IsActive: '',
        };

        var sendData = {
            OrderStatus: OrderStatus,
            OrderID: OrderID
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
                orderService.updateOrder(sendData, function (err, result) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: '服务器出错，产品修改操作失败'
                        });
                    }

                    if (result !== undefined && result.affectedRows != 0) {
                        res.status(200);
                        res.json({
                            code: 200,
                            isSuccess: true,
                            msg: '订单修改成功'
                        });
                        return;
                    } else {
                        res.status(400);
                        res.json({
                            code: 400,
                            isSuccess: true,
                            msg: '订单修改失败'
                        });
                        return;
                    }
                });
            } else {
                res.status(404);
                res.json({
                    code: 404,
                    isSuccess: true,
                    msg: '要修改的订单不存在，订单修改失败'
                });
                return;
            }
        });
    });
});

router.delete('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.orderManger.orderDel.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }
        if (funcResult !== undefined && funcResult.isSuccess === true) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                msg: 'product delete '
            });
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }
    });
});


module.exports = router;