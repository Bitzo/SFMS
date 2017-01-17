/**
 * @Author: Cecurio
 * @Date: 2017/1/2 17:43
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 17:43
 * @Function:
 */
var db_jinkebro = appRequire('db/db_jinkebro'),
    order = appRequire('model/jinkebro/order/ordermodel'),
    logger = appRequire("util/loghelper").helper,
    async = require('async'),
    moment = require('moment');
//新增订单
exports.insertOrder = function(data, callback) {

    var insertSql = 'insert into jit_order set ';
    var sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (sql.length == 0) {
                if (!isNaN(data[key])) {
                    sql += " " + key + " = " + data[key] + " ";
                } else {
                    sql += " " + key + " = '" + data[key] + "' ";
                }
            } else {
                if (!isNaN(data[key])) {
                    sql += ", " + key + " = " + data[key] + " ";
                } else {
                    sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    insertSql += sql;

    logger.writeInfo("[insertOrder func in productdal]订单新增:" + insertSql);
    console.log("[insertOrder func in productdal]订单新增:" + insertSql);


    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insertSql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

/**
 * 创建订单（事务保证，损失性能）
 * @param {object} data 订单对象
 * @param {function} callback 回调方法
 */
exports.createOrder = function(data, callback) {
    /**
     * 1.校验data传过来的必要的参数是否有，并且合法（这一步其实应该在service层做）
     * 2.校验当前订单对应的所有商品库存是否满足下单量
     * 3.创建订单
     * 4.创建订单与商品的关系数据
     * 5.扣减对应的商品数量，update的时候注意where条件（where 当前商品的库存>下单的数量），如果update之后返回影响的行数如果为0，说明
     * 商品库存不足，此时也应该回滚
     * 6.返回创建生成的订单号
     * 7.以上任何一步异常，回滚
     * 8.提交
     */
}

/**
 * 使用事务增加订单
 * @param data
 * @param callback
 */
exports.insertOrderFull = function(data, callback) {
    var insertSql1 = '',
        insertSql2 = '';

    // var receiveData = {
    //     "OrderTime": "2017-01-10 15:47:32",
    //     "PayMethod": 1,
    //     "IsValid": 1,
    //     "IsActive": 1,
    //     "ProductIDs": [
    //         1,
    //         2,
    //         3
    //     ],
    //     "ProductCounts": [
    //         2,
    //         1,
    //         3
    //     ],
    //     "CustomerID": 1,
    //     "OrderStatus": 1
    // };

    var insertOrderData = {
        OrderTime: data.OrderTime,
        PayMethod: data.PayMethod,
        IsValid: data.IsValid,
        IsActive: data.IsActive,
        OrderStatus: data.OrderStatus
    };

    var receiveProductIDs = data.ProductIDs,
        receiveProductCounts = data.ProductCounts;

    logger.writeInfo("[insertOrderFull func in orderdal]订单新增. ");
    console.log("[insertOrderFull func in orderdal]订单新增.");

    // 从链接池得到connection
    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.error('mysql 链接失败');
            callback(true);
            return;
        }
        //开始事务
        connection.beginTransaction(function(err) {
            if (err) {
                throw err;
            }
            var returnResult = {};
            var funcArr = [];

            // 添加记录到order表
            var func1 = function(callback1) {
                insertSql1 = 'insert into jit_order set ';
                var sql = '';
                if (insertOrderData !== undefined) {
                    for (var key in insertOrderData) {
                        if (sql.length == 0) {
                            if (!isNaN(insertOrderData[key])) {
                                sql += " " + key + " = " + insertOrderData[key] + " ";
                            } else {
                                sql += " " + key + " = '" + insertOrderData[key] + "' ";
                            }
                        } else {
                            if (!isNaN(insertOrderData[key])) {
                                sql += ", " + key + " = " + insertOrderData[key] + " ";
                            } else {
                                sql += ", " + key + " = '" + insertOrderData[key] + "' ";
                            }
                        }
                    }
                }
                insertSql1 += sql + ' ;';
                console.log("insert into order,sql: " + insertSql1);
                logger.writeInfo("insert into order,sql: " + insertSql1);
                connection.query(insertSql1, function(err, info) {
                    if (err) {
                        connection.rollback(function() {
                            logger.writeError("[order]执行事务失败，" + "ERROR：" + err);
                            console.log("[order]执行事务失败，" + "ERROR：" + err);
                            throw err;
                        });
                    }
                    console.log(info);
                    returnResult = info;
                    callback1(err, info);
                });
            };
            funcArr.push(func1);

            // 添加记录到ordercustomer表
            var func2 = function(callback2) {
                var InsertUserOrderData = {
                    CustomerID: data.CustomerID,
                    OrderID: returnResult.insertId,
                    IsActive: data.IsActive,
                    CreateTime: moment().format('YYYY-MM-DD HH:mm:ss')
                };

                insertSql2 = ' insert into jit_ordercustomer set  ';
                var sql = '';
                if (InsertUserOrderData !== undefined) {
                    for (var key in InsertUserOrderData) {
                        if (sql.length == 0) {
                            if (!isNaN(InsertUserOrderData[key])) {
                                sql += " " + key + " = " + InsertUserOrderData[key] + " ";
                            } else {
                                sql += " " + key + " = '" + InsertUserOrderData[key] + "' ";
                            }
                        } else {
                            if (!isNaN(InsertUserOrderData[key])) {
                                sql += ", " + key + " = " + InsertUserOrderData[key] + " ";
                            } else {
                                sql += ", " + key + " = '" + InsertUserOrderData[key] + "' ";
                            }
                        }
                    }
                }
                insertSql2 += sql + ' ;';
                console.log("insert into ordercustomer,sql: " + insertSql2);
                logger.writeInfo("insert into ordercustomer,sql: " + insertSql2)
                connection.query(insertSql2, function(err, info) {
                    if (err) {
                        connection.rollback(function() {
                            logger.writeError("[ordercustomer]执行事务失败，" + "ERROR：" + err);
                            console.log("[ordercustomer]执行事务失败，" + "ERROR：" + err);
                            throw err;
                        });
                    }
                    console.log(info);
                    callback2(err, info);
                });
            };
            funcArr.push(func2);

            // 插入记录到orderProduct表
            (function next(index) {
                if (index === receiveProductIDs.length) { // No items left
                    return;
                }
                var tempProID = receiveProductIDs[index];
                var tempProCount = receiveProductCounts[index];
                var tempfunc = function(callbacktemp) {
                    var insertSqlTemp = ' insert into jit_orderproduct set OrderID = ' + returnResult.insertId + ' , ';
                    insertSqlTemp += ' ProductID = ' + tempProID + ' , ';
                    insertSqlTemp += ' ProductCount = ' + tempProCount + ' ;';
                    console.log("insertSqlTemp" + index + ": " + insertSqlTemp);
                    logger.writeInfo("insertSqlTemp" + index + ": " + insertSqlTemp);
                    connection.query(insertSqlTemp, function(err, info) {
                        if (err) {
                            connection.rollback(function() {
                                logger.writeError("[orderProduct]执行事务失败，" + "ERROR：" + err);
                                console.log("[orderProduct]执行事务失败，" + "ERROR：" + err);
                                throw err;
                            });
                        }
                        console.log(info);
                        callbacktemp(err, info);
                    });
                }
                funcArr.push(tempfunc);
                next(index + 1);
            })(0);

            async.series(funcArr, function(err, result) {
                if (err) {
                    connection.rollback(function(err) {
                        throw err;
                    });
                    callback(true);
                    connection.release();
                    return;
                }

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }
                    console.log('insert success');
                    connection.release();
                    callback(false, returnResult);
                });
            });
        });

    });
}

//新增订单产品表的一条记录
exports.insertOrderProduct = function(data, callback) {

    var insertSql = 'insert into jit_orderproduct set ';
    var sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (sql.length == 0) {
                if (!isNaN(data[key])) {
                    sql += " " + key + " = " + data[key] + " ";
                } else {
                    sql += " " + key + " = '" + data[key] + "' ";
                }
            } else {
                if (!isNaN(data[key])) {
                    sql += ", " + key + " = " + data[key] + " ";
                } else {
                    sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    insertSql += sql + ";";

    logger.writeInfo("[insertOrderProduct func in orderdal]订单新增:" + insertSql);
    console.log("[insertOrderProduct func in orderdal]订单新增:" + insertSql);


    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insertSql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//新增用户订单表的一条记录
exports.insertOrderCustomer = function(data, callback) {

    var insertSql = 'insert into jit_ordercustomer set ';
    var sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (sql.length == 0) {
                if (!isNaN(data[key])) {
                    sql += " " + key + " = " + data[key] + " ";
                } else {
                    sql += " " + key + " = '" + data[key] + "' ";
                }
            } else {
                if (!isNaN(data[key])) {
                    sql += ", " + key + " = " + data[key] + " ";
                } else {
                    sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    insertSql += sql + ";";

    logger.writeInfo("[insertOrderCustomer func in productdal]订单用户表的新增:" + insertSql);
    console.log("[insertOrderCustomer func in productdal]订单用户表的新增:" + insertSql);


    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insertSql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

/**
 * 删除订单,物理删除
 * @param data
 * @param callback
 */
exports.deleteOrder = function(data, callback) {
    var delete_sql = 'delete from jit_order where 1 = 0 ;  ';

    console.log(delete_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(delete_sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

/**
 * 修改订单,包括修改order表，orderproduct表
 * @param data
 * @param callback
 */
exports.updateOrder = function(data, callback) {
    //接收的data数据形式如下：
    // var dat = {
    //     order: {
    //             OrderID: 1,
    //             OrderTime: '2017-01-1318: 29: 52',
    //             PayTime: '',
    //             DeliveryTime: '',
    //             PayMethod: '0',
    //             IsValid: 1,
    //             IsActive: 1,
    //             DeliveryUserID: '',
    //             IsCancel: '',
    //             CancelTime: '',
    //             DiscountMoney: '',
    //             DiscountType: '',
    //             BizID: '',
    //             Memo: '',
    //             IsCheck: '',
    //             PDate: '',
    //             OrderStatus: 1
    //     },
    //     orderProduct: {
    //         ProductIDs: [
    //             1,
    //             2,
    //             5
    //         ],
    //             ProductCounts: [
    //             2,
    //             3,
    //             1
    //         ]
    //     }
    // }
    var orderTableData = data.order;
    var ordprodtTabDt = data.orderProduct;
    // 订购商品的ID及其数量
    var receiveProductIDs = ordprodtTabDt.ProductIDs; //array
    var receiveProductCounts = ordprodtTabDt.ProductCounts; //array
    console.log(receiveProductIDs == undefined);
    console.log(receiveProductCounts == undefined);
    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.error('mysql 链接失败');
            callback(true);
            return;
        }
        //开始事务
        connection.beginTransaction(function(err) {
            if (err) {
                throw err;
            }
            var returnResult = {};
            var funcArr = [];
            // 修改Order表
            var func1 = function(callback1) {
                var update_sql = 'update jit_order set  ';
                var temp_sql = '';
                if (orderTableData !== undefined) {
                    for (var key in orderTableData) {
                        if (orderTableData[key] != '') {
                            if (temp_sql.length == 0) {
                                if (!isNaN(orderTableData[key])) {
                                    temp_sql += " " + key + " = " + orderTableData[key] + " ";
                                } else {
                                    temp_sql += " " + key + " = '" + orderTableData[key] + "' ";
                                }
                            } else {
                                if (!isNaN(orderTableData[key])) {
                                    temp_sql += " , " + key + " = " + orderTableData[key] + " ";
                                } else {
                                    temp_sql += " , " + key + " = '" + orderTableData[key] + "' ";
                                }
                            }
                        }
                    }
                }
                update_sql += temp_sql;
                update_sql += ' where OrderID = ' + orderTableData.OrderID + ';';
                console.log('修改order表中记录的sql' + update_sql);
                logger.writeInfo('修改order表中记录的sql' + update_sql);
                connection.query(update_sql, function(err, info) {
                    if (err) {
                        connection.rollback(function() {
                            logger.writeError("[updateOrder]执行事务失败，" + "ERROR：" + err);
                            console.log("[updateOrder]执行事务失败，" + "ERROR：" + err);
                            throw err;
                        });
                    }
                    console.log(info);
                    returnResult = info;
                    callback1(err, info);
                });
            };
            funcArr.push(func1);

            // 修改orderproduct表
            if (receiveProductIDs !== undefined && receiveProductIDs.length !== undefined && receiveProductIDs.length > 0) {
                var func2 = function(callback2) {
                    var orderProDelSql = 'delete from jit_orderproduct where jit_orderproduct.OrderID = ' + orderTableData.OrderID;
                    console.log('删除orderproduct表中指定记录的sql：' + orderProDelSql);
                    logger.writeInfo('删除orderproduct表中指定记录的sql：' + orderProDelSql);
                    connection.query(orderProDelSql, function(err, info) {
                        if (err) {
                            connection.rollback(function() {
                                logger.writeError("[ordercustomer]执行事务失败，" + "ERROR：" + err);
                                console.log("[ordercustomer]执行事务失败，" + "ERROR：" + err);
                                throw err;
                            });
                        }
                        console.log(info);
                        callback2(err, info);
                    });
                };
                funcArr.push(func2);
            }


            // 新增orderproduct表的记录
            (function next(index) {
                if (receiveProductIDs === undefined || receiveProductIDs.length === undefined || receiveProductIDs.length <= 0) {
                    return;
                }
                if (index === receiveProductIDs.length) { // No items left
                    return;
                }
                var tempProID = receiveProductIDs[index];
                var tempProCount = receiveProductCounts[index];
                var orderProAddSqlTemp = 'insert into jit_orderproduct set jit_orderproduct.OrderID = ' + orderTableData.OrderID + ' , ';
                orderProAddSqlTemp += ' jit_orderproduct.ProductID = ' + tempProID + ' , ';
                orderProAddSqlTemp += ' jit_orderproduct.ProductCount = ' + tempProCount + ' ;';

                console.log("orderProAddSqlTemp" + index + ": " + orderProAddSqlTemp);
                logger.writeInfo("orderProAddSqlTemp" + index + ": " + orderProAddSqlTemp);
                var tempfunc = function(callbacktemp) {
                    connection.query(orderProAddSqlTemp, function(err, info) {
                        if (err) {
                            connection.rollback(function() {
                                logger.writeError("[orderProduct]执行事务失败，" + "ERROR：" + err);
                                console.log("[orderProduct]执行事务失败，" + "ERROR：" + err);
                                throw err;
                            });
                        }
                        callbacktemp(err, info);
                    });
                }
                funcArr.push(tempfunc);
                next(index + 1);
            })(0);

            async.series(funcArr, function(err, result) {
                if (err) {
                    connection.rollback(function(err) {
                        throw err;
                    });
                    callback(true);
                    connection.release();
                    return;
                }

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }
                    console.log('success');
                    connection.release();
                    callback(false, returnResult);
                });
            });
        });

    });

}

/**
 * 查询订单
 * @param data
 * @param callback
 */
exports.queryOrders = function(data, callback) {
    var arr = new Array();
    // data的格式如下
    // {
    //     pageManage: {
    //         page: 1,
    //             pageNum: 20,
    //             isPaging: 1
    //     },
    //     orderProduct: {
    //         'jit_orderproduct.ProductID': [
    //
    //         ],
    //             'jit_orderproduct.ProductCount': [
    //
    //         ]
    //     },
    //     order: {
    //         'jit_ordercustomer.OrderID': '1',
    //             'jit_customer.WechatUserCode': '',
    //             'jit_customer.CustomerID': '',
    //             'jit_order.OrderStatus': ''
    //     }
    // }
    arr.push(' select  jit_customer.CustomerID,jit_ordercustomer.OrderID, ');
    arr.push(' jit_order.OrderTime,jit_orderproduct.ProductID,jit_product.ProductName,jit_orderproduct.ProductCount, ');
    arr.push(' jit_product.ProductPrice,jit_productype.ProductTypeName,jit_order.PayMethod,jit_order.OrderStatus,jit_order.IsValid,jit_order.IsActive ');
    arr.push(' from jit_ordercustomer ,jit_order,jit_orderproduct,jit_product,jit_customer,jit_productype ');
    arr.push(' where 1 = 1 and jit_order.OrderID = jit_ordercustomer.orderID ');
    arr.push(' and jit_order.OrderID = jit_orderproduct.OrderID ');
    arr.push(' and jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' and jit_ordercustomer.CustomerID = jit_customer.CustomerID ');
    arr.push(' and jit_product.ProductTypeID = jit_productype.ID ');

    var query_sql = arr.join(' ');

    // 接收service传来的数据
    var pageManageData = data.pageManage;
    var orderProductData = data.orderProduct;
    var orderData = data.order;

    // OrderID,WechatUserCode,CustomerID,OrderStatus,IsActive的拼接
    if (orderData !== undefined) {
        for (var key in orderData) {
            if (orderData[key] != '') {
                //判断data[key]是否是数值类型
                if (!isNaN(orderData[key])) {
                    query_sql += " and " + key + " = " + orderData[key] + " ";
                } else {
                    query_sql += " and " + key + " = '" + orderData[key] + "' ";
                }
            }
        }
    }

    //产品种类和数量的查询sql拼接
    var tempSql = '',
        tempArr = orderProductData['jit_orderproduct.ProductID'],
        tempArrLength = tempArr.length;
    if (tempArrLength != 0) {
        for (var i = 0; i < tempArrLength; i++) {
            if (tempSql.length == 0) {
                tempSql += ' and jit_orderproduct.ProductID in (' + tempArr[i];
            } else {
                tempSql += ' ,' + tempArr[i];
            }
        }
        tempSql += ' ) ';
        query_sql += tempSql;
    }

    tempSql = '';
    tempArr = orderProductData['jit_orderproduct.ProductCount'];
    tempArrLength = tempArr.length;
    if (tempArrLength != 0) {
        for (var i = 0; i < tempArrLength; i++) {
            if (tempSql.length == 0) {
                tempSql += ' and jit_orderproduct.ProductCount in (' + tempArr[i];
            } else {
                tempSql += ' ,' + tempArr[i];
            }
        }
        tempSql += ' ) ';
        query_sql += tempSql;
    }

    var num = pageManageData.pageNum; //每页显示的个数
    var page = pageManageData.page || 1;

    if (pageManageData.isPaging == 1) {
        query_sql += " LIMIT " + (page - 1) * num + "," + num + " ;";
    }

    logger.writeInfo("[queryOrders func in productdal]订单查询:" + query_sql);
    console.log("[queryOrders func in productdal]订单查询:" + query_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(query_sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });

}

/**
 * 查询指定条件订单的个数
 * @param data
 * @param callback
 * @constructor
 */
exports.CountOrders = function(data, callback) {
    var arr = new Array();
    arr.push(' select count(1) as num ');
    arr.push(' from jit_ordercustomer ,jit_order,jit_orderproduct,jit_product,jit_customer ');
    arr.push(' where 1 = 1 and jit_order.OrderID = jit_ordercustomer.orderID ');
    arr.push(' and jit_order.OrderID = jit_orderproduct.OrderID ');
    arr.push(' and jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' and jit_ordercustomer.CustomerID = jit_customer.CustomerID ');
    var sql = arr.join(' ');

    // 接收service传来的数据
    var orderProductData = data.orderProduct;
    var orderData = data.order;

    // OrderID,WechatUserCode,CustomerID,OrderStatus的拼接
    if (orderData !== undefined) {
        for (var key in orderData) {
            if (orderData[key] != '') {
                //判断data[key]是否是数值类型
                if (!isNaN(orderData[key])) {
                    sql += " and " + key + " = " + orderData[key] + " ";
                } else {
                    sql += " and " + key + " = '" + orderData[key] + "' ";
                }
            }
        }
    }

    //产品种类和数量的查询sql拼接
    var tempSql = '',
        tempArr = orderProductData['jit_orderproduct.ProductID'],
        tempArrLength = tempArr.length;
    if (tempArrLength != 0) {
        for (var i = 0; i < tempArrLength; i++) {
            if (tempSql.length == 0) {
                tempSql += ' and jit_orderproduct.ProductID in (' + tempArr[i];
            } else {
                tempSql += ' ,' + tempArr[i];
            }
        }
        tempSql += ' ) ';
        sql += tempSql;
    }

    tempSql = '';
    tempArr = orderProductData['jit_orderproduct.ProductCount'];
    tempArrLength = tempArr.length;
    if (tempArrLength != 0) {
        for (var i = 0; i < tempArrLength; i++) {
            if (tempSql.length == 0) {
                tempSql += ' and jit_orderproduct.ProductCount in (' + tempArr[i];
            } else {
                tempSql += ' ,' + tempArr[i];
            }
        }
        tempSql += ' ) ';
        sql += tempSql;
    }

    sql += ';'; //sql拼接结束

    logger.writeInfo("查询指定条件的订单个数,sql:" + sql);
    console.log("查询指定条件的订单个数,sql:" + sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            callback(true);
            return;
        }
        connection.query(sql, function(err, results) {
            if (err) {
                logger.writeError('查询指定条件的订单个数：' + err);
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });
}