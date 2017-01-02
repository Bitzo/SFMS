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

}

//删除订单
exports.deleteOrder = function (data,callback) {

}

//修改订单
exports.updateOrder = function (data,callback) {


}

//查询订单
exports.queryOrders = function (data,callback) {
    var arr = new Array();
    arr.push(' select jit_order.OrderID,OrderTime,jit_order.IsActive,jit_order.PayMethod,jit_order.IsValid,jit_product.ProductName, ');
    arr.push(' jit_product.ProductPrice')
    arr.push(' from jit_order ');
    arr.push(' left join jit_orderproduct ');
    arr.push(' on jit_orderproduct.OrderID = jit_order.OrderID ');
    arr.push(' left join jit_product ');
    arr.push(' on jit_product.ProductID = jit_orderproduct.ProductID ');
    arr.push(' where 1=1 and jit_order.OrderID =  ');

    var query_sql = arr.join(' ');

    query_sql += data['OrderID'];

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
    var sql = ' select count(1) as num from jit_order where 1=1 ';

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
