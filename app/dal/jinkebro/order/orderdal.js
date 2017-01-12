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
exports.insertOrder = function (data, callback) {

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


    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insertSql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//使用事务增加订单
exports.insertOrderFull = function (data,callback) {
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
        OrderTime : data.OrderTime,
        PayMethod : data.PayMethod,
        IsValid : data.IsValid,
        IsActive : data.IsActive,
        OrderStatus : data.OrderStatus
    };

    var receiveProductIDs = data.ProductIDs,
        receiveProductCounts = data.ProductCounts;

    logger.writeInfo("[insertOrderFull func in orderdal]订单新增. ");
    console.log("[insertOrderFull func in orderdal]订单新增.");

    // 从链接池得到connection
    db_jinkebro.mysqlPool.getConnection(function (err,connection) {
        if (err) {
            console.error('mysql 链接失败');
            callback(true);
            return ;
        }
        //开始事务
        connection.beginTransaction(function (err) {
            if (err) {
                throw  err;
            }
            var returnResult = {};
            var funcArr = [];

            // 添加记录到order表
            var func1 = function(callback1) {
                insertSql1 = 'insert into jit_order set ';
                var sql = '';
                if(insertOrderData !== undefined){
                    for(var key in insertOrderData){
                        if(sql.length == 0){
                            if(!isNaN(insertOrderData[key])){
                                sql += " " + key + " = " + insertOrderData[key] + " " ;
                            }else {
                                sql += " " + key + " = '" + insertOrderData[key] + "' " ;
                            }
                        }else{
                            if(!isNaN(insertOrderData[key])){
                                sql += ", " + key + " = " + insertOrderData[key] + " " ;
                            }else {
                                sql += ", " + key + " = '" + insertOrderData[key] + "' " ;
                            }
                        }
                    }
                }
                insertSql1 += sql + ' ;';
                console.log("insert into order,sql: " + insertSql1);
                logger.writeInfo("insert into order,sql: " + insertSql1);
                connection.query(insertSql1, function (err,info) {
                    if (err) {
                        connection.rollback(function () {
                            logger.writeError("[order]执行事务失败，" + "ERROR：" + err);
                            console.log("[order]执行事务失败，" + "ERROR：" + err);
                            throw err;
                        });
                    }
                    console.log(info);
                    returnResult = info;
                    callback1(err,info);
                });
            };
            funcArr.push(func1);

            // 添加记录到ordercustomer表
            var func2 = function (callback2) {
                var InsertUserOrderData = {
                    CustomerID : data.CustomerID,
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
                connection.query(insertSql2, function (err, info) {
                    if (err) {
                        connection.rollback(function () {
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
                var tempfunc = function (callbacktemp) {
                    var insertSqlTemp = ' insert into jit_orderproduct set OrderID = ' + returnResult.insertId + ' , ';
                    insertSqlTemp += ' ProductID = ' + tempProID + ' , ';
                    insertSqlTemp += ' ProductCount = ' + tempProCount + ' ;' ;
                    console.log("insertSqlTemp" + index + ": " + insertSqlTemp);
                    logger.writeInfo("insertSqlTemp" + index + ": " + insertSqlTemp);
                    connection.query(insertSqlTemp, function (err,info) {
                        if (err) {
                            connection.rollback(function () {
                                logger.writeError("[orderProduct]执行事务失败，" + "ERROR：" + err);
                                console.log("[orderProduct]执行事务失败，" + "ERROR：" + err);
                                throw err;
                            });
                        }
                        console.log(info);
                        callbacktemp(err,info);
                    });
                }
                funcArr.push(tempfunc);
                next(index + 1);
            })(0);

            async.series(funcArr
                , function (err, result) {
                    if (err) {
                        connection.rollback(function (err) {
                            throw err;
                        });
                        callback(true);
                        connection.release();
                        return;
                    }

                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        console.log('insert success');
                        connection.release();
                        callback(false, returnResult);
                    });
                }
            );
        });

    });
}

//新增订单产品表的一条记录
exports.insertOrderProduct = function (data, callback) {

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


    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insertSql, function (err, results) {
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
exports.insertOrderCustomer = function (data, callback) {

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


    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insertSql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//删除订单
exports.deleteOrder = function (data, callback) {

}

//修改订单
exports.updateOrder = function (data, callback) {
    var sql = 'select 1+1 ';

    console.log(sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}

//查询订单
exports.queryOrders = function (data, callback) {
    var arr = new Array();
    arr.push(' select  jit_customer.CustomerID,jit_ordercustomer.OrderID, ');
    arr.push(' jit_order.OrderTime,jit_orderproduct.ProductID,jit_product.ProductName,jit_orderproduct.ProductCount, ');
    arr.push(' jit_product.ProductPrice,jit_productype.ProductTypeName,jit_order.PayMethod ');
    arr.push(' from jit_ordercustomer ,jit_order,jit_orderproduct,jit_product,jit_customer,jit_productype ');
    arr.push(' where 1 = 1 and jit_order.OrderID = jit_ordercustomer.orderID ');
    arr.push(' and jit_order.OrderID = jit_orderproduct.OrderID ');
    arr.push(' and jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' and jit_ordercustomer.CustomerID = jit_customer.CustomerID ');
    arr.push(' and jit_product.ProductTypeID = jit_productype.ID ');

    var query_sql = arr.join(' ');

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '' && key !== 'isPaging') {
                //判断data[key]是否是数值类型
                if (!isNaN(data[key])) {
                    query_sql += ' and ' + key + ' = ' + data[key] + ' ';
                } else {
                    query_sql += ' and ' + key + ' = "' + data[key] + '" ';
                }
            }
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    if (data.isPaging == 1) {
        query_sql += " LIMIT " + (page - 1) * num + "," + num + " ;";
    }

    logger.writeInfo("[queryOrders func in productdal]订单查询:" + query_sql);
    console.log("[queryOrders func in productdal]订单查询:" + query_sql);


    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(query_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });

}

//查询指定条件订单的个数
exports.CountOrders = function (data, callback) {
    var arr = new Array();
    arr.push(' select count(*) as num ');
    arr.push(' from jit_ordercustomer ,jit_order,jit_orderproduct,jit_product,jit_customer ');
    arr.push(' where 1 = 1 and jit_order.OrderID = jit_ordercustomer.orderID ');
    arr.push(' and jit_order.OrderID = jit_orderproduct.OrderID ');
    arr.push(' and jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' and jit_ordercustomer.CustomerID = jit_customer.CustomerID ');

    var sql = arr.join(' ');

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '' && key !== 'isPaging') {
                //如果data[key]是数字
                if (!isNaN(data[key])) {
                    sql += " and " + key + " = " + data[key] + " ";
                } else {
                    sql += " and " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    logger.writeInfo("查询指定条件的订单个数,sql:" + sql);
    console.log("查询指定条件的订单个数,sql:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            callback(true);
            return;
        }
        connection.query(sql, function (err, results) {
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
