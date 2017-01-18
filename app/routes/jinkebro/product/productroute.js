/**
 * @Author: Cecurio
 * @Date: 2016/12/30 20:35
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/30 20:35
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url');

//产品业务逻辑组件
var productService = appRequire('service/jinkebro/product/productservice'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config'),
    moment = require('moment');

//产品的新增
router.post('/', function (req, res) {
    var formdata = req.body.formdata;

    //检查所需要的字段是否都存在
    var data = ['SKU', 'ProductName', 'SupplierID', 'ProductTypeID', 'ProductPrice'];
    var err = 'require: ';
    for (var value in data) {
        if (!(data[value] in formdata)) {
            err += data[value] + ' ';
        }
    }
    //如果要求的字段不在req的参数中
    if (err !== 'require: ') {
        logger.writeError(err);
        res.status(400);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: '存在未填写的必填字段' + err
        });
    }

    var SKU = formdata.SKU,
        ProductName = formdata.ProductName,
        ProductDesc = formdata.ProductDesc || '',
        ProductImgPath = formdata.ProductImgPath || '',
        ExpireTime = (formdata.ExpireTime) ? (formdata.ExpireTime) : moment().format('YYYY-MM-DD HH:mm:ss'),
        ProducTime = (formdata.ProducTime) ? (formdata.ProducTime) : moment().format('YYYY-MM-DD HH:mm:ss'),
        SupplierID = formdata.SupplierID,
        ProductTypeID = formdata.ProductTypeID,
        ProductPrice = formdata.ProductPrice,
        OnSale = formdata.OnSale;

    // 存放接收的数据
    var insertdata = {
        "SKU": SKU,
        "ProductName": ProductName,
        "ProductDesc": ProductDesc,
        "ProductImgPath": ProductImgPath,
        "ExpireTime": ExpireTime,
        "ProducTime": ProducTime,
        "SupplierID": SupplierID,
        "ProductTypeID": ProductTypeID,
        "ProductPrice": ProductPrice,
        "OnSale": OnSale
    };

    var intdata = {
        "SupplierID": SupplierID,
        "ProductTypeID": ProductTypeID,
        "OnSale": OnSale
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
        if (key != 'ProductDesc' && key != 'ProductImgPath') {
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
    productService.insertProduct(insertdata, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                addProductResult: result,
                msg: '服务器出错，产品新增操作失败'
            });
        }


        if (result !== undefined && result.affectedRows != 0) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                addProductResult: result,
                msg: '一条产品记录添加成功'
            });
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

router.delete('/', function (req, res) {
    //productID是主键，只需要此属性就可准确删除，不必传入其他参数
    var d = JSON.parse(req.query.d);
    var productID = d.ProductID;
    if (productID === undefined) {
        res.status(404);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: 'require productID'
        });
    }
    if (isNaN(productID)) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: 'ProductID不是数字'
        });
    }
    var deleteData = {
        "ProductID": productID
    };

    //查询要删除的菜单是否存在
    productService.CountProducts(deleteData, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                deleteResult: result,
                msg: '操作失败，服务器出错'
            });
        }

        //所要删除的产品存在，执行删除操作
        if (result !== undefined && result[0]['num'] !== 0) {
            productService.deleteProduct(deleteData, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        deleteResults: results,
                        msg: '服务器出错，操作失败'
                    });
                }

                //判断是否删除成功
                if (results !== undefined && results.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        deleteResult: results,
                        msg: '产品删除操作成功'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "产品删除操作失败"
                    });
                }
            });
        } else {
            // 所要删除的菜单不存在
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                deleteResult: result,
                msg: '操作失败，所要删除的产品不存在'
            });
        }
    });
});

router.put('/', function (req, res) {
    var formdata = JSON.parse(req.body.formdata);

    //检查所需要的字段是否都存在
    var data = ['SKU', 'ProductID', 'ProductName', 'SupplierID', 'ProductTypeID', 'ProductPrice'];
    var err = 'require: ';
    for (var value in data) {
        if (!(data[value] in formdata)) {
            err += data[value] + ' ';
        }
    }

    //如果要求的字段不在req的参数中
    if (err !== 'require: ') {
        logger.writeError(err);
        res.status(400);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: '存在未填写的必填字段' + err
        });
    }

    var SKU = formdata.SKU,
        ProductID = formdata.ProductID,
        ProductName = formdata.ProductName,
        ProductDesc = formdata.ProductDesc ? formdata.ProductDesc : '',
        ProductImgPath = formdata.ProductImgPath ? formdata.ProductImgPath : '',
        ExpireTime = (formdata.ExpireTime) ? (formdata.ExpireTime) : moment().format('YYYY-MM-DD HH:mm:ss'),
        ProducTime = (formdata.ProducTime) ? (formdata.ProducTime) : moment().format('YYYY-MM-DD HH:mm:ss'),
        SupplierID = formdata.SupplierID,
        ProductTypeID = formdata.ProductTypeID,
        ProductPrice = formdata.ProductPrice,
        OnSale = formdata.OnSale;


    // 存放接收的数据
    var updatedata = {
        "SKU": SKU,
        "ProductID": ProductID,
        "ProductName": ProductName,
        "ProductDesc": ProductDesc,
        "ProductImgPath": ProductImgPath,
        "ExpireTime": ExpireTime,
        "ProducTime": ProducTime,
        "SupplierID": SupplierID,
        "ProductTypeID": ProductTypeID,
        "ProductPrice": ProductPrice,
        "OnSale": OnSale
    };

    var intdata = {
        "ProductID": ProductID,
        "SupplierID": SupplierID,
        "ProductTypeID": ProductTypeID,
        "OnSale": OnSale
    };

    var JudgeData = {
        "ProductID": ProductID,
        "pageNum": 1,
        "page": 1,
        "OnSale": OnSale
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
    for (var key in updatedata) {
        if (key != 'ProductDesc' && key != 'ProductImgPath') {
            if (updatedata[key].length == 0) {
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

    productService.queryProducts(JudgeData, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                updateResult: result,
                msg: '操作失败，服务器出错'
            });
        }
        // 所要修改的产品存在
        if (result !== undefined && result.length !== 0) {
            console.log('hello');
            productService.updateProduct(updatedata, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        addProductResult: results,
                        msg: '服务器出错，产品新增操作失败'
                    });
                }

                if (results !== undefined && results.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        addProductResult: results,
                        msg: '一条产品记录添加成功'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "产品添加操作失败"
                    });
                }
            });
        }
    });

});

//查看产品
router.get('/', function (req, res) {
    var query = JSON.parse(req.query.f);
    var page = (req.query.pageindex || query.pageindex) ? (req.query.pageindex || query.pageindex) : 1,
        pageNum = (req.query.pagesize || query.pagesize) ? (req.query.pagesize || query.pagesize) : 20,
        SKU = query.SKU || '',
        ProductID = query.ProductID || '',
        ProductName = query.ProductName || '',
        ExpireTime = query.ExpireTime || '',
        SupplierID = query.SupplierID || '',
        ProductTypeID = query.ProductTypeID || '',
        ProductPrice = query.ProductPrice || '',
        OnSale = (query.OnSale !== undefined) ? (query.OnSale) : 1,
        isPaging = (query.isPaging !== undefined) ? (query.isPaging) : 1; //是否分页 0表示不分页,1表示分页

    page = page > 0 ? page : 1;

    if (pageNum == '') {
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    var data = {
        page: page,
        pageNum: pageNum,
        SKU: SKU,
        ProductID: ProductID,
        ProductName: ProductName,
        ExpireTime: ExpireTime,
        SupplierID: SupplierID,
        ProductTypeID: ProductTypeID,
        ProductPrice: ProductPrice,
        OnSale: OnSale,
        isPaging: isPaging
    };

    var intdata = {
        page: page,
        pageNum: pageNum,
        ProductID: ProductID,
        SupplierID: SupplierID,
        ProductTypeID: ProductTypeID,
        OnSale: OnSale,
        isPaging: isPaging
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

    productService.CountProducts(data, function (err, results) {
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
            productService.queryProducts(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });

                    //这边要记录operationlog日志
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
                        code: 200,
                        isSuccess: true,
                        msg: "未查询到相应产品"
                    });
                }
            });
        } else {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                msg: "未查询到相应产品"
            });
        }
    });
});

//查询所有的商品的部分 简单的没有任何的限制
router.get('/info', function (req, res) {

    var page = (req.query.pageindex || req.query.pageindex) ? (req.query.pageindex || req.query.pageindex) : 1,
        pageNum = (req.query.pagesize || req.query.pagesize) ? (req.query.pagesize || req.query.pagesize) : 20,
        SKU = req.query.SKU || '',
        ProductID = req.query.ProductID || '',
        ProductName = req.query.ProductName || '',
        ExpireTime = req.query.ExpireTime || '',
        SupplierID = req.query.SupplierID || '',
        ProductTypeID = req.query.ProductTypeID || '',
        isPaging = (req.query.isPaging !== undefined) ? (req.query.isPaging) : 1, //是否分页 0表示不分页,1表示分页
        OnSale = (req.query.OnSale !== undefined) ? (req.query.OnSale) : 1;

    page = page > 0 ? page : 1;
    console.log("测试商品的查询的路由");
    if (pageNum == '') {
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    var data = {
        page: page,
        pageNum: pageNum,
        SKU: SKU,
        ProductID: ProductID,
        ProductName: ProductName,
        ExpireTime: ExpireTime,
        SupplierID: SupplierID,
        ProductTypeID: ProductTypeID,
        isPaging: isPaging,
        OnSale: OnSale
    };

    var intdata = {
        page: page,
        pageNum: pageNum,
        ProductID: ProductID,
        SupplierID: SupplierID,
        ProductTypeID: ProductTypeID,
        isPaging: isPaging,
        OnSale: OnSale
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

    productService.CountProducts(data, function (err, results) {
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
            productService.queryProducts(data, function (err, result) {
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
                    if (resultBack.curPage == resultBack.totlePage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totlePage - 1) * pageNum;
                    }
                    res.status(200);
                    //console.log(resultBack);
                    return res.json(resultBack);
                } else {
                    res.status(200);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应产品"
                    });
                }
            });
        } else {
            res.status(200);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相应产品"
            });
        }
    });
});


module.exports = router;