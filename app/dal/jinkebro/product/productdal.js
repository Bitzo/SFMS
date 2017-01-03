/**
 * @Author: Cecurio
 * @Date: 2016/12/14 21:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/14 21:23
 * @Function:
 */
var db_jinkebro = appRequire('db/db_jinkebro'),
    product = appRequire('model/jinkebro/product/productmodel'),
    logger = appRequire("util/loghelper").helper;

//新增商品
exports.insertProduct = function (data,callback) {

    var insert_sql = 'insert into jit_product set ';
    var sql = '';

    if(data !== undefined){
        for(var key in data){
            if(sql.length == 0){
                sql += " " + key + " = '" + data[key] + "' " ;
            }else{
                sql += ", " + key + " = '" + data[key] + "' " ;
            }
        }
    }

    insert_sql += sql;

    logger.writeInfo("[insertProduct func in productdal]产品新增：" +insert_sql);
    console.log("in dal, 产品新增：" + insert_sql);

    db_jinkebro.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[productdal]数据库连接错误：" + err);
            callback(true);
            return;
        }
        connection.query(insert_sql, function(err, result) {
            if (err) {
                throw err;
                callback(true);
                return;
            }
            callback(false, result);
            connection.release();
        });
    });

}

//删除产品
exports.deleteProduct = function (data,callback) {
    var delete_sql = 'delete from jit_product where ProductID = ' + data['ProductID'] + ';';

    logger.writeInfo("[menuDelete func in productdal]产品删除：" + delete_sql);
    console.log("in dal,产品删除：" + delete_sql);

    db_jinkebro.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[productdal]数据库连接错误：" + err);
            callback(true);
            return ;
        }

        connection.query(delete_sql, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return ;
            }

            callback(false, results);
            connection.release();
        });
    });
}

//修改商品
exports.updateProduct = function (data,callback) {

    var update_sql = 'update jit_product set ';
    var sql = '';

    if(data !== undefined){
        for(var key in data){
            if(key != 'ProductID'){
                if(sql.length == 0){
                    sql += " " + key + " = '" + data[key] + "' " ;
                }else{
                    sql += ", " + key + " = '" + data[key] + "' " ;
                }
            }
        }
    }

    sql += " where ProductID = " + data['ProductID'];

    update_sql = update_sql + sql;

    logger.writeInfo("[updateProduct func in productdal]产品编辑:" + update_sql);
    console.log("in dal,产品编辑：" + update_sql);

    db_jinkebro.mysqlPool.getConnection(function (err,connection) {
        if(err) {
            logger.writeError("[productdal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(update_sql, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return;
            }

            callback(false, results);
            connection.release();
        })

    });

}

//查询商品
exports.queryProducts = function (data,callback) {

    var arr = new Array();

    arr.push(' select SKU,ProductID,ProductName,ProductDesc,ProductImgPath, ');
    arr.push(' ExpireTime,ProducTime,SupplierID,ProductTypeID,jit_productype.ProductTypeName,ProductPrice ');
    arr.push(' from jit_product ');
    arr.push(' left join jit_productype on jit_product.ProductTypeID = jit_productype.ID ');
    arr.push(' where 1 = 1 ');

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

    if(data['isPaging'] == 1){
        query_sql += " LIMIT " + (page-1)*num + "," + num + " ;";
    }else {
        query_sql += ';' ;
    }


    logger.writeInfo("[queryProducts func in productdal]产品查询:" + query_sql);
    console.log("[queryProducts func in productdal]产品查询:" + query_sql);


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

//查询指定条件商品的个数
exports.CountProducts = function (data,callback) {
    var sql = ' select count(1) as num from jit_product where 1=1 ';

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

    logger.writeInfo("查询指定条件的商品个数,sql:" + sql);
    console.log("查询指定条件的商品个数,sql:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            callback(true);
            return;
        }
        connection.query(sql, function (err, results) {
            if (err) {
                logger.writeError('查询指定条件的商品个数：' + err);
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });
}

//根据ID得到该商品类型的个数
exports.getProCountByID = function (data, callback) {
    var sql = 'select count(1) as count from jit_product';

    sql += " where ProductTypeID= " + data['ID'];

    logger.writeInfo("根据ID得到该商品类型的个数,sql:" + sql);

    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            callback(true);
            return;
        }
        connection.query(sql, function (err, results) {
            if (err) {
                logger.writeError('查询：' + err);
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
            return;
        });
    });
}
