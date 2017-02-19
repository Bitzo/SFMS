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
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    moment = require('moment');

//商品新增
router.post('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.product.productAdd.functionCode;
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
            var formdata = req.body.formdata;
            // var formdata = JSON.parse(req.body.formdata);

            //检查所需要的字段是否都存在
            var data = ['SKU',
                'ProductName',
                'ExpireTime',
                'ProducTime',
                'SupplierID',
                'ProductTypeID',
                'ProductPrice',
                'OnSale',
                'TotalNum',
                'StockAreaID',
                'CreateUserID',
                'CreateTime'
            ];

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

            // var productstockmodel = {
            //     ID : '',
            //     ProductID : '',
            //     TotalNum : '',
            //     StockAreaID : '',
            //     CreateUserID : '',
            //     CreateTime : '',
            //     EditUserID : '', // can be null
            //     EditTime : '' // can be null
            // };

            // var producttypemodel = {
            //     ID : '',
            //     ProductTypeName : ''
            // };

            // var SKU = formdata.SKU || "123",
            //     ProductName = formdata.ProductName || "德芙巧克力",
            //     ProductDesc = formdata.ProductDesc || '',
            //     ProductImgPath = formdata.ProductImgPath || '',
            //     ExpireTime = formdata.ExpireTime || moment().format("YYYY-MM-DD"),
            //     ProducTime = formdata.ProducTime || moment().format("YYYY-MM-DD"),
            //     SupplierID = formdata.SupplierID || 1,
            //     ProductTypeID = formdata.ProductTypeID || 4,
            //     ProductPrice = formdata.ProductPrice || 29.5,
            //     OnSale = formdata.OnSale || 1,
            //     TotalNum = formdata.TotalNum || 100,
            //     StockAreaID = formdata.StockAreaID || 1,
            //     CreateUserID = formdata.CreateUserID || 41,
            //     CreateTime = formdata.CreateTime || moment().format("YYYY-MM-DD HH:mm:ss"),
            //     newProductTypeName = formdata.newProductTypeName || '德芙 香浓黑巧克力 碗装 252克/碗';
            var SKU = formdata.SKU,
                ProductName = formdata.ProductName,
                ProductDesc = formdata.ProductDesc,
                ProductImgPath = formdata.ProductImgPath,
                ExpireTime = formdata.ExpireTime,
                ProducTime = formdata.ProducTime,
                SupplierID = formdata.SupplierID,
                ProductTypeID = formdata.ProductTypeID,
                ProductPrice = formdata.ProductPrice,
                OnSale = formdata.OnSale,
                TotalNum = formdata.TotalNum,
                StockAreaID = formdata.StockAreaID,
                CreateUserID = formdata.CreateUserID,
                CreateTime = formdata.CreateTime,
                newProductTypeName = formdata.newProductTypeName || '';

            var requiredValue = '缺少输入参数 ：',
                requiredData = {
                    "SKU": SKU,
                    "ProductName": ProductName,
                    "SupplierID": SupplierID,
                    "ProductTypeID": ProductTypeID,
                    "ProductPrice": ProductPrice,
                    "OnSale": OnSale,
                    "TotalNum" : TotalNum,
                    "StockAreaID" :  StockAreaID,
                    "CreateUserID" : CreateUserID,
                };

            for (var key in requiredData) {
                if (requiredData[key] == undefined) {
                    requiredValue += key;
                    logger.writeError(requiredValue);
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: requiredValue
                    });
                }
            }

            if (ExpireTime != undefined) {
                ExpireTime = moment(formdata.ExpireTime).format("YYYY-MM-DD");
            } else {
                res.status(400);
                res.json({
                    code : 400,
                    isSuccess : false,
                    msg : '商品过期时间必须设置！'
                });
            }

            if (ProducTime != undefined) {
                ProducTime = moment(formdata.ProducTime).format("YYYY-MM-DD");
            } else {
                res.status(400);
                res.json({
                    code : 400,
                    isSuccess : false,
                    msg : '商品生产日期必须设置！'
                });
            }

            if (CreateTime != undefined) {
                CreateTime = moment(formdata.CreateTime).format("YYYY-MM-DD HH:mm:ss");
            } else {
                res.status(400);
                res.json({
                    code : 400,
                    isSuccess : false,
                    msg : '入库时间必须设置！'
                });
            }

            var shouldIntData = {
                "SupplierID" : SupplierID,
                "ProductTypeID" : ProductTypeID,
                "OnSale" : OnSale,
                "TotalNum" : TotalNum,
                "StockAreaID" :  StockAreaID,
                "CreateUserID" : CreateUserID
            };
            for (var key in shouldIntData) {
                if (isNaN(shouldIntData[key])) {
                    res.status(400);
                    return res.json({
                        code : 400,
                        isSuccess : false,
                        msg : key + " : " + shouldIntData[key] + '不是数字！'
                    });
                }
            }

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
                "OnSale": OnSale,
                "TotalNum" : TotalNum,
                "StockAreaID" :  StockAreaID,
                "CreateUserID" : CreateUserID,
                "CreateTime" : CreateTime,
                "newProductTypeName" : newProductTypeName
            };

            productService.getMaxSKUNext(function (err,skuResult) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器内部错误！'
                    });
                }

                if (skuResult != undefined && skuResult.length == 1) {
                    insertdata.SKU = skuResult[0].SKU;

                    productService.insertProduct(insertdata, function (err, result) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '服务器内部错误！'
                            });
                        }

                        if (result !== undefined && result.affectedRows != 0) {
                            res.status(200);
                            return res.json({
                                code: 200,
                                isSuccess: true,
                                addProductResult: result,
                                msg: '一条产品记录添加成功！'
                            });
                        } else {
                            res.status(404);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "产品添加操作失败！"
                            });
                        }
                    });

                } else {
                    res.status(404);
                    return res.json({
                        code : 404,
                        isSuccess : false,
                        msg : '获得最大SKU失败！'
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

router.delete('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.product.productDel.functionCode;
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
    var functionCode = functionConfig.jinkeBroApp.product.productEdit.functionCode;
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
                    productService.updateProduct(updatedata, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                addProductResult: results,
                                msg: '服务器出错，产品修改操作失败'
                            });
                        }

                        if (results !== undefined && results.affectedRows != 0) {
                            res.status(200);
                            return res.json({
                                code: 200,
                                isSuccess: true,
                                addProductResult: results,
                                msg: '修改产品成功！'
                            });
                        } else {
                            res.status(404);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "修改产品失败！"
                            });
                        }
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "修改的产品不存在，修改失败！"
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

//查看产品
router.get('/', function (req, res) {

    // req.query的内容如下：
    // {
    //     access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODc0MjgyODkwMTN9._kAZlxEinELePO5vfnW2ckhGaoiLy0ogGmqKDgGcG6s',
    //         jitkey: '1',
    //     f: '{
    //
    //     }',
    //     pageindex: '1',
    //         pagesize: '10'
    // }

    var functionCode = functionConfig.jinkeBroApp.product.productQuery.functionCode;
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

//查询所有的商品的部分 简单的没有任何的限制
router.get('/info', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.product.productQuery.functionCode;
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