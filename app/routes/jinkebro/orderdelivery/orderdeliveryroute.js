/**
 * @Author: Duncan
 * @Date: 2017/1/21 11:08
 * @Last Modified by: Duncan
 * @Last Modified time: 
 * @Function: 订单的配送员
 */

var express = require('express'),
    router = express.Router(),
    logger = appRequire('util/loghelper').helper,
    url = require('url');
	
//订单配送员的逻辑组件
var orderDelivery = appRequire('service/jinkebro/orderdelivery/orderdeliveryservice'),
    orderDelieveryModel = appRequire('model/jinkebro/orderdelivery/orderdeliverymodel'),
    userService = appRequire('service/backend/user/userservice'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    orderService = appRequire('service/jinkebro/order/orderservice'),
    moment = require('moment'),
    config = appRequire('config/config');

router.post('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.orderDelivery.orderdeliveryAdd.functionCode;
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
        if (funcResult !== undefined && funcResult.isSuccess === true) {
            var formdata = req.body.formdata;

            var data = ['OrderID', 'DeliveryUserID'];
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
                DeliveryUserID = formdata.DeliveryUserID,
                DeliveryBeginTime = formdata.DeliveryBeginTime,
                DeliveryEndTime = formdata.DeliveryEndTime;

            if (DeliveryBeginTime != undefined && DeliveryBeginTime != '') {
                DeliveryBeginTime = moment(formdata.DeliveryBeginTime).format('YYYY-MM-DD HH:mm:ss');
            } else {
                DeliveryBeginTime = '';
            }

            if (DeliveryEndTime != undefined && DeliveryEndTime != '') {
                DeliveryEndTime = moment(formdata.DeliveryEndTime).format('YYYY-MM-DD HH:mm:ss');
            } else {
                DeliveryEndTime = '';
            }

            //接收的数据进行object然后来插入
            var insertData = {
                "OrderID" : OrderID,
                "DeliveryUserID" : DeliveryUserID,
                "DeliveryBeginTime" : DeliveryBeginTime || '',
                "DeliveryEndTime" : DeliveryEndTime || ''
            };

            var intData = {
                "OrderID" : OrderID,
                "DeliveryUserID" : DeliveryUserID
            };

            for (var key in intData) {
                if (isNaN(insertData[key])) {
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: key + ": " + intData[key] + '不是数字'
                    });
                }
            }

            orderDelivery.queryOrderDelivery({ 'OrderID': OrderID }, function (err, queryInfo) {
                if (err) {
                    console.log("查询订单的配送员失败");
                    return;
                }

                if (queryInfo.length == 0) {
                    //执行插入操作
                    orderDelivery.insertOrderDelivery(insertData, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '服务器出错，订单配送员新增操作失败'
                            });
                        }

                        if (result !== undefined && result.affectedRows != 0) {
                            orderService.updateOrder({'OrderID': OrderID, 'OrderStatus': 2}, function (err, updateInfo) {
                                    if (err) {
                                        res.status(500);
                                        return res.json({
                                            code: 500,
                                            isSuccess: false,
                                            msg: '服务器内部错误!'
                                        });
                                    }

                                    if (updateInfo !== undefined && updateInfo.affectedRows != 0) {
                                        res.status(200);
                                        return res.json({
                                            code: 200,
                                            isSuccess: true,
                                            addProductResult: result,
                                            msg: '配送员分配成功'
                                        });
                                    }
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
                }

                if (queryInfo.length != 0) {
                    insertData.ID = queryInfo[0].ID;
                    orderDelivery.updateOrderDelivery(insertData, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                addProductResult: result,
                                msg: '服务器出错，订单配送员修改操作失败'
                            });
                        }

                        if (result !== undefined && result.affectedRows != 0) {
                            res.status(200);
                            return res.json({
                                code: 200,
                                isSuccess: true,
                                updateResult: result,
                                msg: '订单配送员修改成功'
                            });
                        } else {
                            res.status(404);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "订单配送员修改操作失败"
                            });
                        }
                    });

                }
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

router.get('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.orderDelivery.orderdeliveryQuery.functionCode;
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
            var query = JSON.parse(req.query.f);
            var page = req.query.pageindex || 1,
                pageNum = req.query.pagesize || config.pageCount,
                orderID = query.OrderID || '',
                deliveryUserID = query.DeliveryUserID || '',
                deliveryBeginTime = query.DeliveryBeginTime || '',
                deliveryEndTime = query.DeliveryEndTime || '',
                isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 0;

           var data = {
                page : page,
                pageNum : pageNum,
                isPaging : isPaging
            };

            if (orderID != undefined) {
                data.OrderID = orderID;
                if (isNaN(orderID)) {
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: 'orderID不是数字！'
                    });
                };
            }

            if (deliveryUserID !== undefined) {
                data.DeliveryUserID = deliveryUserID;
                if (isNaN(deliveryUserID)) {
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: 'deliveryUserID不是数字！'
                    });
                };
            }

            if (deliveryBeginTime !== undefined) {
                data.DeliveryBeginTime = deliveryBeginTime;
            }

            if (deliveryEndTime !== undefined) {
                data.DeliveryEndTime = deliveryEndTime;
            }
            
            
            var countNum = -1;
            orderDelivery.countOrderDelivery(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        errorMsg: "查询失败，服务器内部错误！"
                    });
                }
                
                if (results !== undefined && results.length != 0 && (results[0]['num']) > 0) {
                    countNum = results[0]['num'];

                    orderDelivery.queryOrderDelivery(data, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "查询失败，服务器内部错误！"
                            });
                        }

                        if (result !== undefined && result.length != 0 && countNum != -1) {
                            var resultBack = {
                                code: 200,
                                isSuccess: true,
                                msg: '查询成功！',
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
                        } else {
                            res.status(200);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "未查询到相应配送情况！"
                            });
                        }
                    });
                } else {
                    res.status(200);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应配送情况！"
                    });
                }
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

router.put('/', function (req, res) {

    var functionCode = functionConfig.jinkeBroApp.orderDelivery.orderdeliveryQuery.functionCode;
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
            //接受前端的数据
            console.log(req.body.formdata);
            var formdata = req.body.formdata;

            var data = ['OrderID', 'DeliveryUserID'];
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
                DeliveryUserID = formdata.DeliveryUserID || '',
                DeliveryBeginTime = (formdata.DeliveryBeginTime != undefined) ? moment(formdata.DeliveryBeginTime).format('YYYY-MM-DD HH:mm:ss') : '',
                DeliveryEndTime = (formdata.DeliveryEndTime != undefined) ? moment(formdata.DeliveryEndTime).format('YYYY-MM-DD HH:mm:ss') : '';


            //接收的数据进行object然后来插入
            var insertData = {
                "OrderID" : OrderID,
                "DeliveryUserID" : DeliveryUserID,
                "DeliveryBeginTime" : DeliveryBeginTime || '',
                "DeliveryEndTime" : DeliveryEndTime || ''
            };

            var intData = {
                "OrderID" : OrderID,
                "DeliveryUserID" : DeliveryUserID
            };

            for (var key in intData) {
                if (isNaN(intData[key])) {
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: key + ": " + intData[key] + '不是数字'
                    });
                }
            }

            //执行插入操作
            orderDelivery.countOrderDelivery({OrderID : OrderID},function (err,results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器内部错误！'
                    });
                }
                console.log(results)
                if (results != undefined && results.length != 0 && results[0]['num'] > 0) {
                    orderDelivery.updateOrderDelivery(insertData, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '服务器出错，订单配送员修改操作失败'
                            });
                        }

                        if (result !== undefined && result.affectedRows != 0) {
                            res.status(200);
                            return res.json({
                                code: 200,
                                isSuccess: true,
                                updateResult: result,
                                msg: '订单配送员记录修改成功！'
                            });
                        } else {
                            res.status(404);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "订单配送员修改操作失败！"
                            });
                        }
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "此条订单配送员记录不存在！"
                    });
                }

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

router.put('/startDelivery', function (req, res) {

    var functionCode = functionConfig.jinkeBroApp.orderDelivery.orderdeliveryQuery.functionCode;
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
            //接受前端的数据
            var formdata = req.body.formdata;

            var data = ['OrderID'];
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
                DeliveryBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');


            //接收的数据进行object然后来插入
            var insertData = {
                "OrderID" : OrderID,
                "DeliveryBeginTime" : DeliveryBeginTime || ''
            };

            var intData = {
                "OrderID" : OrderID,
            };

            for (var key in intData) {
                if (isNaN(intData[key])) {
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: key + ": " + intData[key] + '不是数字'
                    });
                }
            }

            //执行插入操作
            orderDelivery.countOrderDelivery({OrderID : OrderID},function (err,results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器内部错误！'
                    });
                }
                console.log(results)
                if (results != undefined && results.length != 0 && results[0]['num'] > 0) {
                    orderDelivery.updateOrderDelivery(insertData, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '服务器出错，订单配送员修改操作失败'
                            });
                        }

                        if (result !== undefined && result.affectedRows != 0) {
                            res.status(200);
                            return res.json({
                                code: 200,
                                isSuccess: true,
                                updateResult: result,
                                msg: '开始配送操作成功！'
                            });
                        } else {
                            res.status(404);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "开始配送操作失败！"
                            });
                        }
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "此条订单配送员记录不存在！"
                    });
                }

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


router.put('/endDelivery', function (req, res) {

    var functionCode = functionConfig.jinkeBroApp.orderDelivery.orderdeliveryQuery.functionCode;
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
            //接受前端的数据

            var formdata = req.body.formdata;

            var data = ['OrderID'];
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
                DeliveryEndTime = moment().format('YYYY-MM-DD HH:mm:ss');


            //接收的数据进行object然后来插入
            var insertData = {
                "OrderID" : OrderID,
                "DeliveryEndTime" : DeliveryEndTime || ''
            };

            var intData = {
                "OrderID" : OrderID
            };

            for (var key in intData) {
                if (isNaN(intData[key])) {
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: key + ": " + intData[key] + '不是数字'
                    });
                }
            }

            //执行插入操作
            orderDelivery.countOrderDelivery({OrderID : OrderID},function (err,results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器内部错误！'
                    });
                }
                console.log(results)
                if (results != undefined && results.length != 0 && results[0]['num'] > 0) {
                    orderDelivery.updateOrderDelivery(insertData, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '服务器出错，订单配送员修改操作失败'
                            });
                        }

                        if (result !== undefined && result.affectedRows != 0) {

                            orderService.updateOrder({ OrderStatus: 3,OrderID: OrderID}, function (err, updateOrderResult) {
                                if (err) {
                                    res.status(500);
                                    return res.json({
                                        code: 500,
                                        isSuccess: false,
                                        msg: '服务器出错，产品修改操作失败'
                                    });
                                    return;
                                }

                                if (updateOrderResult !== undefined && updateOrderResult.affectedRows != 0) {
                                    res.status(200);
                                    return res.json({
                                        code: 200,
                                        isSuccess: true,
                                        msg: '订单修改成功'
                                    });
                                } else {
                                    res.status(400);
                                    return res.json({
                                        code: 400,
                                        isSuccess: true,
                                        msg: '订单修改失败'
                                    });
                                }
                            });

                        } else {
                            res.status(404);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "完成配送操作失败！"
                            });
                        }
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "此条订单配送员记录不存在！"
                    });
                }

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