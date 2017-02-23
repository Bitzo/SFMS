/**
 * @Author: Cecurio
 * @Date: 2016/12/14 21:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/14 21:23
 * @Function:
 */
var db_jinkebro = appRequire('db/db_jinkebro'),
    product = appRequire('model/jinkebro/product/productmodel'),
    logger = appRequire("util/loghelper").helper,
    async = require('async');

//新增商品
exports.insertProduct = function(data, callback) {
    // var receivedData = {
    //     SKU: 'JK1320025220005',
    //     ProductName: '雪碧',
    //     ProductDesc: '',
    //     ProductImgPath: '',
    //     ExpireTime: '2017-02-20',
    //     ProducTime: '2017-02-20',
    //     SupplierID: 1,
    //     ProductTypeID: 4,
    //     ProductPrice: 2.5,
    //     OnSale: 1,
    //     TotalNum: 100,
    //     StockAreaID: 1,
    //     CreateUserID: 41,
    //     CreateTime: '2017-02-2002: 18: 55',
    //     newProductTypeName: ''
    // };

    var productData = {
            "SKU": data.SKU,
            "ProductName": data.ProductName,
            "ProductDesc": data.ProductDesc || '',
            "ProductImgPath": data.ProductImgPath || '',
            "ExpireTime": data.ExpireTime,
            "ProducTime": data.ProducTime,
            "SupplierID": data.SupplierID,
            "ProductTypeID": data.ProductTypeID,
            "ProductPrice": data.ProductPrice,
            "OnSale": data.OnSale
        },
        productStockData = {
            "TotalNum" : data.TotalNum,
            "StockAreaID" : data. StockAreaID,
            "CreateUserID" : data.CreateUserID,
            "CreateTime" : data.CreateTime
        },
        productTypeData = {
            "newProductTypeName" : data.newProductTypeName
        };

    // 从链接池得到connection
    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('mysql链接失败！');
            return callback(true,'mysql链接失败！');
        }


        //开始事务
        connection.beginTransaction(function(err) {

            if (err) {
                throw err;
            }

            var returnResult = {};
            var funcArr = [];

            // 插入记录到producttype表
            if (productTypeData.newProductTypeName != '') {
                var addProductTypeFunc = function(callback3) {
                    var insertSql3 = "insert into jit_productype set jit_productype.ProductTypeName = " + " '" + productTypeData.newProductTypeName + "';";

                    console.log(insertSql3);

                    connection.query(insertSql3, function(err, info) {
                        if (err) {
                            connection.rollback(function() {
                                logger.writeError("[order]执行事务失败，" + "ERROR：" + err);
                                console.log("[order]执行事务失败，" + "ERROR：" + err);
                                connection.release();
                                throw err;

                            });
                        }
                        if (info != undefined && info.affectedRows == 1) {
                            productData.ProductTypeID = info.insertId;
                        } else {
                            connection.rollback(function () {
                                logger.writeError("添加新商品类型失败！");
                                console.log("添加新商品类型失败！");
                            });
                            callback(false, "添加新商品类型失败！");
                            return ;
                        }
                        console.log(info);
                        callback3(err, info);
                    });
                };
                funcArr.push(addProductTypeFunc);
            }else {
                return callback(false, '请为商品设置类型！');
            }

            // 添加记录到product表
            var addProductFunc = function(callback1) {
                var insertSql1 = "insert into jit_product set ";
                var sql = "";
                if (productData != undefined) {
                    for (var key in productData) {
                        if (productData[key] != '') {
                            if (sql.length == 0) {
                                if (!isNaN(productData[key])) {
                                    sql += " " + key + " = " + productData[key] + " ";
                                } else {
                                    sql += " " + key + " = '" + productData[key] + "' ";
                                }
                            } else {
                                if (!isNaN(productData[key])) {
                                    sql += ", " + key + " = " + productData[key] + " ";
                                } else {
                                    sql += ", " + key + " = '" + productData[key] + "' ";
                                }
                            }
                        }
                    }
                }
                insertSql1 += sql + ' ;';
                console.log("insert into jit_product,sql: " + insertSql1);
                logger.writeInfo("insert into jit_product,sql: " + insertSql1);

                connection.query(insertSql1, function(err, info) {
                    if (err) {
                        connection.rollback(function() {
                            logger.writeError("[order]执行事务失败，" + "ERROR：" + err);
                            console.log("[order]执行事务失败，" + "ERROR：" + err);
                            throw err;
                        });
                        connection.release();
                        return ;
                    }
                    console.log(info);
                    returnResult = info;
                    productStockData['ProductID'] = info.insertId;

                    callback1(err, info);
                });
            };
            funcArr.push(addProductFunc);

            // 添加记录到productstock表
            var addProductStockFunc = function(callback2) {

                var insertSql2 = ' insert into jit_productstock set  ';
                var sql = '';
                if (productStockData != undefined) {
                    for (var key in productStockData) {
                        if (sql.length == 0) {
                            if (!isNaN(productStockData[key])) {
                                sql += " " + key + " = " + productStockData[key] + " ";
                            } else {
                                sql += " " + key + " = '" + productStockData[key] + "' ";
                            }
                        } else {
                            if (!isNaN(productStockData[key])) {
                                sql += ", " + key + " = " + productStockData[key] + " ";
                            } else {
                                sql += ", " + key + " = '" + productStockData[key] + "' ";
                            }
                        }
                    }
                }
                insertSql2 += sql + ' ;';
                console.log("insert into jit_productstock,sql: " + insertSql2);
                logger.writeInfo("insert into jit_productstock,sql: " + insertSql2)
                connection.query(insertSql2, function(err, info) {
                    if (err) {
                        connection.rollback(function() {
                            logger.writeError("[ordercustomer]执行事务失败，" + "ERROR：" + err);
                            console.log("[ordercustomer]执行事务失败，" + "ERROR：" + err);
                            throw err;
                        });
                        connection.release();
                        return ;
                    }
                    console.log(info);
                    callback2(err, info);
                });
            };
            funcArr.push(addProductStockFunc);


            async.series(funcArr, function(err, result) {
                if (err) {
                    connection.rollback(function(err) {
                        throw err;
                    });
                    connection.release();
                    return ;
                }

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                        connection.release();
                        return ;
                    }
                    console.log('insert product success');
                    // 事务执行成功，此处释放连接！！！
                    connection.release();
                    return callback(false, returnResult);
                });
            });
        });
    });
};

//删除产品
exports.deleteProduct = function(data, callback) {
    var delete_sql = "update jit_product set jit_product.OnSale = 0 where ProductID = " + data['ProductID'] + ";";

    logger.writeInfo("[menuDelete func in productdal]产品删除：" + delete_sql);
    console.log("in dal,产品删除：" + delete_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[productdal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(delete_sql, function(err, results) {
            connection.release();
            if (err) {
                throw err;
                callback(true);
                return;
            }

            callback(false, results);
            return;
        });
    });
};

//修改商品
exports.updateProduct = function(data, callback) {

    var update_sql = 'update jit_product set ';
    var sql = '';

    if (data !== undefined) {
        for (var key in data) {
            if (key != 'ProductID') {
                if (sql.length == 0) {
                    sql += " " + key + " = '" + data[key] + "' ";
                } else {
                    sql += ", " + key + " = '" + data[key] + "' ";
                }
            }
        }
    }

    sql += " where ProductID = " + data['ProductID'];

    update_sql = update_sql + sql;

    logger.writeInfo("[updateProduct func in productdal]产品编辑:" + update_sql);
    console.log("in dal,产品编辑：" + update_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[productdal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(update_sql, function(err, results) {
            connection.release();
            if (err) {
                connection.release();
                throw err;
                callback(true);
                return;
            }

            callback(false, results);
            return;
        })

    });
};

//查询商品
exports.queryProducts = function(data, callback) {
    var arr = new Array();

    //这边待优化，jit_producttype表不会很大，可以先查出来放入字典，从内存去map，不必要join
    arr.push(' select SKU,jit_product.ProductID,ProductName,ProductDesc,ProductImgPath, ');
    arr.push(' ExpireTime,ProducTime,SupplierID,ProductTypeID,jit_productype.ProductTypeName,ProductPrice,jit_productstock.TotalNum,jit_product.OnSale ');
    arr.push(' from jit_product ');
    arr.push(' left join jit_productype on jit_product.ProductTypeID = jit_productype.ID ');
    arr.push(' left join jit_productstock on jit_productstock.ProductID = jit_product.ProductID ');
    arr.push(' where 1 = 1 ');

    var query_sql = arr.join(' ');

    var queryData = {
        SKU: data.SKU || '',
        "jit_product.ProductID" : data['jit_product.ProductID'] || '',
        ProductName: data.ProductName || '',
        ExpireTime: data.ExpireTime || '',
        SupplierID: data.SupplierID || '',
        ProductTypeID: data.ProductTypeID || '',
        ProductPrice: data.ProductPrice || '',
        OnSale: data.OnSale || '',
    };

    if (queryData !== undefined) {
        for (var key in queryData) {
            if (key !== 'page' && key !== 'pageNum' && queryData[key] != '' && key !== 'isPaging') {
                //判断data[key]是否是数值类型
                if (!isNaN(queryData[key])) {
                    query_sql += ' and ' + key + ' = ' + queryData[key] + ' ';
                } else {
                    query_sql += ' and ' + key + ' = "' + queryData[key] + '" ';
                }
            }
        }
    }

    if (data.minProductPrice != '') {
        query_sql += " and jit_product.ProductPrice > " + data.minProductPrice + " ";
    }

    if (data.maxProductPrice != '') {
        query_sql += " and jit_product.ProductPrice < " + data.maxProductPrice + " ";
    }

    if (data.earlyExpireTime != '') {
        query_sql += " and jit_product.ExpireTime > '" + data.earlyExpireTime + "' ";
    }

    if (data.lateExpireTime != '') {
        query_sql += " and jit_product.ExpireTime < '" + data.lateExpireTime + "' ";
    }


    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    query_sql += ' order by jit_product.ProductID desc ';

    if (data['isPaging'] == 0) {
        query_sql += " LIMIT " + (page - 1) * num + "," + num + " ;";
    } else {
        query_sql += ';';
    }

    console.log('查询商品的sql：' + query_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log('查询商品建立连接失败');
            callback(true, JSON.stringify(connection));
            return;
        }

        connection.query(query_sql, function(err, results) {
            connection.release();
            if (err) {
                callback(true, JSON.stringify(results));
                return;
            }

            return callback(false, results);
        });
    });
};

//查询指定条件商品的个数
exports.CountProducts = function(data, callback) {
    var sql = ' select count(1) as num from jit_product where 1=1 ';
    var queryData = {
        SKU: data.SKU || '',
        "jit_product.ProductID" : data.ProductID || '',
        ProductName: data.ProductName || '',
        ExpireTime: data.ExpireTime || '',
        SupplierID: data.SupplierID || '',
        ProductTypeID: data.ProductTypeID || '',
        ProductPrice: data.ProductPrice || '',
        OnSale: data.OnSale || ''
    };

    if (queryData !== undefined) {
        for (var key in queryData) {
            if (key !== 'page' && key !== 'pageNum' && queryData[key] != '' && key !== 'isPaging') {
                //如果data[key]是数字
                if (!isNaN(queryData[key])) {
                    sql += " and " + key + " = " + queryData[key] + " ";
                } else {
                    sql += " and " + key + " = '" + queryData[key] + "' ";
                }
            }
        }
    }

    if (data.minProductPrice != '') {
        sql += " and jit_product.ProductPrice > " + data.minProductPrice + " ";
    }

    if (data.maxProductPrice != '') {
        sql += " and jit_product.ProductPrice < " + data.maxProductPrice + " ";
    }

    if (data.earlyExpireTime != '') {
        sql += " and jit_product.ExpireTime > '" + data.earlyExpireTime + "' ";
    }

    if (data.lateExpireTime != '') {
        sql += " and jit_product.ExpireTime < '" + data.lateExpireTime + "' ";
    }

    logger.writeInfo("查询指定条件的商品个数,sql:" + sql);
    console.log("查询指定条件的商品个数,sql:" + sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            callback(true);
            return;
        }
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('查询指定条件的商品个数：' + err);
                callback(true);
                return;
            }
            return callback(false, results);
    });
});
};

//根据ID得到该商品类型的个数
exports.getProCountByID = function(data, callback) {
    var sql = 'select count(1) as count from jit_product';

    sql += " where ProductTypeID= " + data['ID'];

    logger.writeInfo("根据ID得到该商品类型的个数,sql:" + sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            callback(true);
            return;
        }
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {               
                logger.writeError('查询：' + err);
                callback(true);
                return;
            }

            callback(false, results);
            return;
        });
    });
};

exports.getMaxSKU = function (callback) {
    var sql = "select jit_product.SKU from jit_product order by jit_product.ProductID desc limit 1;";
    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError('数据库连接错误：' + err);
            return callback(true,'数据库连接错误！');
        }
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                logger.writeError('查询：' + err);
                callback(true);
                return;
            }
     
            return callback(false, results);
        });
    });
};