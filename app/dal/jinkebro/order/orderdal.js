/**
 * @Author: Cecurio
 * @Date: 2017/1/2 17:43
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 17:43
 * @Function:
 */
var db_jinkebro = appRequire('db/db_jinkebro'),
    order = appRequire('model/jinkebro/order/ordermodel'),
    logger = appRequire("util/loghelper").helper;

//新增订单
exports.insertOrder = function (data,callback) {

    var insertSql = 'insert into jit_order set ';
    var sql = '';

    if(data !== undefined){
        for(var key in data){
            if(sql.length == 0){
                if(!isNaN(data[key])){
                    sql += " " + key + " = " + data[key] + " " ;
                }else {
                    sql += " " + key + " = '" + data[key] + "' " ;
                }
            }else{
                if(!isNaN(data[key])){
                    sql += ", " + key + " = " + data[key] + " " ;
                }else {
                    sql += ", " + key + " = '" + data[key] + "' " ;
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

//新增订单产品表的一条记录
exports.insertOrderProduct = function (data,callback) {

    var insertSql = 'insert into jit_orderproduct set ';
    var sql = '';

    if(data !== undefined){
        for(var key in data){
            if(sql.length == 0){
                if(!isNaN(data[key])){
                    sql += " " + key + " = " + data[key] + " " ;
                }else{
                    sql += " " + key + " = '" + data[key] + "' " ;
                }
            }else{
                if(!isNaN(data[key])){
                    sql += ", " + key + " = " + data[key] + " " ;
                }else {
                    sql += ", " + key + " = '" + data[key] + "' " ;
                }
            }
        }
    }

    insertSql += sql + ";";

    logger.writeInfo("[insertOrderProduct func in productdal]订单新增:" + insertSql);
    console.log("[insertOrderProduct func in productdal]订单新增:" + insertSql);


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
exports.insertOrderCustomer = function (data,callback) {

    var insertSql = 'insert into jit_ordercustomer set ';
    var sql = '';

    if(data !== undefined){
        for(var key in data){
            if(sql.length == 0){
                if(!isNaN(data[key])){
                    sql += " " + key + " = " + data[key] + " " ;
                }else{
                    sql += " " + key + " = '" + data[key] + "' " ;
                }
            }else{
                if(!isNaN(data[key])){
                    sql += ", " + key + " = " + data[key] + " " ;
                }else {
                    sql += ", " + key + " = '" + data[key] + "' " ;
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

//删除订单
exports.deleteOrder = function (data,callback) {

}

//修改订单
exports.updateOrder = function (data,callback) {
    var sql = 'select 1+1 ' ;

    console.log(sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, function(err, results) {
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
exports.queryOrders = function (data,callback) {
    var arr = new Array();
    arr.push(' select  jit_customer.CustomerID,jit_ordercustomer.OrderID, ');
    arr.push(' jit_order.OrderTime,jit_orderproduct.ProductID,jit_product.ProductName, ');
    arr.push(' jit_product.ProductPrice,jit_productype.ProductTypeName,jit_order.PayMethod ');
    arr.push(' from jit_ordercustomer ,jit_order,jit_orderproduct,jit_product,jit_customer,jit_productype ');
    arr.push(' where 1 = 1 and jit_order.OrderID = jit_ordercustomer.orderID ');
    arr.push(' and jit_order.OrderID = jit_orderproduct.OrderID ');
    arr.push(' and jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' and jit_ordercustomer.CustomerID = jit_customer.CustomerID ');
    arr.push(' and jit_product.ProductTypeID = jit_productype.ID ');

    var query_sql = arr.join(' ');

    if(data !== undefined){
        for(var key in data){
            if (key !== 'page' && key !== 'pageNum' && data[key] != '' && key !== 'isPaging'){
                //判断data[key]是否是数值类型
                if(!isNaN(data[key])){
                    query_sql += ' and ' + key + ' = '+ data[key] + ' ';
                }else {
                    query_sql += ' and ' + key + ' = "'+ data[key] + '" ';
                }
            }
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    if(data.isPaging == 1){
        query_sql += " LIMIT " + (page-1)*num + "," + num + " ;";
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
        });
    });

}

//查询指定条件订单的个数
exports.CountOrders = function (data,callback) {
    var arr = new Array();
    arr.push(' select count(*) as num ');
    arr.push(' from jit_ordercustomer ,jit_order,jit_orderproduct,jit_product,jit_customer ');
    arr.push(' where 1 = 1 and jit_order.OrderID = jit_ordercustomer.orderID ');
    arr.push(' and jit_order.OrderID = jit_orderproduct.OrderID ');
    arr.push(' and jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' and jit_ordercustomer.CustomerID = jit_customer.CustomerID ');

    var sql = arr.join(' ');

    if(data !== undefined){
        for(var key in data){
            if(key !== 'page' && key !== 'pageNum' && data[key] != '' && key !== 'isPaging'){
                //如果data[key]是数字
                if(!isNaN(data[key])){
                    sql += " and " + key + " = " + data[key] + " ";
                }else {
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
