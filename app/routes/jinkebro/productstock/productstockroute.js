/**
 * @Author: luozQ
 * @Date: 2017/1/4 20:40
 * @Last Modified by: luozQ
 * @Last Modified time:  2017/1/4 20:50
 * @Function: 库存管理
 */
var express = require('express'),
    router = express.Router(),
    url = require('url'),
    proStockService = appRequire('service/jinkebro/productstock/productstockservice'),
    datadictionaryService = appRequire('service/backend/datadictionary/datadictionaryservice'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    logger = appRequire("util/loghelper").helper,
    moment = require('moment'),
    async = require('async'),
    nodeExcel = require('excel-export');

//生成报表
router.get('/excel', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.productStock.productStockQuery.functionCode;
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

        var data = {};

        if (req.query != undefined) {
            var query = req.query;
            var page = (req.query.pageindex != undefined) ? (req.query.pageindex) : 1,
                pageNum = (req.query.pagesize != undefined) ? (req.query.pagesize) : 20,
                isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 1;

            data = {
                page: page,
                pageNum: pageNum,
                isPaging : isPaging,
                ProductID: query.ProductID || '',
                StockAreaID: query.StockAreaID || '',
                TotalNum : query.TotalNum || '',
                CreateUserID: query.CreateUserID || '',
                CreateTime: query.CreateTime || '',
                EditUserID: query.EditUserID || '',
                EditTime: query.EditTime || '',
                minTotalNum : query.minTotalNum || '',
                maxTotalNum : query.maxTotalNum || ''
            };
        }

        var countNum = -1;

        proStockService.countProStock(data, function (err, results) {
            if (err) {
                return res.send("数据异常");
            }

            if (!(results != undefined && results.length != 0 && (results[0]['num']) > 0)) {
                return res.send("数据异常");
            }

            countNum = results[0]['num'];

            proStockService.queryProStock(data, function (err, queryStockResult) {
                if (err) {
                    return res.send("数据异常");
                }

                if (!(queryStockResult != undefined && queryStockResult.length > 0 && queryStockResult.length != undefined)) {
                    return res.send("数据异常");
                }

                var filename = moment().format('YYYYMMDDHHmmss').toString();

                var conf ={};

                conf.name = "sheet1";

                conf.cols = [{
                    caption:'序号',
                    type:'number'
                },{
                    caption:'商品编号',
                    type:'number'
                },{
                    caption:'商品名称',
                    type:'string'
                },{
                    caption:'商品总数',
                    type:'number'
                },{
                    caption:'存储区域',
                    type:'string'
                },{
                    caption:'创建者',
                    type:'string'
                },{
                    caption:'创建时间',
                    type:'string'
                },{
                    caption:'修改者',
                    type:'string'
                },{
                    caption:'修改时间',
                    type:'string'
                }];

                conf.rows = [];

                for(var i=0; i<queryStockResult.length; ++i) {
                    conf.rows.push([(i+1).toString(), queryStockResult[i].ProductID.toString(), queryStockResult[i].ProductName,queryStockResult[i].TotalNum.toString(), queryStockResult[i].StockAreaName,
                        queryStockResult[i].CreateUserName, queryStockResult[i].CreateTime,queryStockResult[i].EditUserName,queryStockResult[i].EditTime]);
                }

                var result = nodeExcel.execute(conf);

                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + filename + ".xlsx");
                return res.end(result, 'binary');

            });
        });
    });
});

//查看库存信息
router.get('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.productStock.productStockQuery.functionCode;
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

        var data = {};

        if (req.query !== undefined) {
            var query = JSON.parse(req.query.f);
            var page = (req.query.pageindex != undefined) ? (req.query.pageindex) : 1,
                pageNum = (req.query.pagesize != undefined) ? (req.query.pagesize) : 20,
                isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 0;

            data = {
                page: page,
                pageNum: pageNum,
                isPaging : isPaging,
                ProductID: query.ProductID || '',
                StockAreaID: query.StockAreaID || '',
                TotalNum : query.TotalNum || '',
                CreateUserID: query.CreateUserID || '',
                CreateTime: query.CreateTime || '',
                EditUserID: query.EditUserID || '',
                EditTime: query.EditTime || '',
                minTotalNum : query.minTotalNum || '',
                maxTotalNum : query.maxTotalNum || ''
            };
        }

        var countNum = -1;

        proStockService.countProStock(data, function (err, results) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    errorMsg: "查询失败，服务器内部错误"
                });
            }

            if (!(results != undefined && results.length != 0 && (results[0]['num']) > 0)) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应库存！"
                });
            }

            countNum = results[0]['num'];

            proStockService.queryProStock(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误！"
                    });
                }

                if (!(result != undefined && result.length > 0 && result.length != undefined)) {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应库存！"
                    });
                }

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
            });
        });
    });
});

//库存信息的新增
router.post('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.productStock.productStockAdd.functionCode;
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
            var formdata = JSON.parse(req.body.formdata);

            //检查所需要的字段是否都存在
            var data = ['ProductID', 'TotalNum', 'StockAreaID', 'CreateUserID'];
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
            // 存放接收的数据
            var data = {
                "ProductID": formdata.ProductID || '',
                'TotalNum': formdata.TotalNum || '',
                'StockAreaID': formdata.StockAreaID || '',
                'CreateUserID': formdata.CreateUserID || '',
                'CreateTime': moment().format("YYYY-MM-DD HH:mm:ss"),
            };

            proStockService.insert(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: result,
                    });
                }

                if (result !== undefined && result.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '库存信息添加成功'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "库存信息添加操作失败"
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

//修改库存信息
router.put('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.productStock.productStockEdit.functionCode;
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

        var formdata = req.body.formdata;

        // 存放接收的数据
        var updatedata = {
            'ProductID': formdata.ProductID,
            'TotalNum': formdata.TotalNum,
            'StockAreaID': formdata.StockAreaID,
            'EditUserID': req.query.jitkey,
            'EditTime': moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        proStockService.update(updatedata, function (err, results) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: results
                });
            }

            if (results !== undefined && results.affectedRows != 0 && results.affectedRows != undefined) {
                res.status(200);
                return res.json({
                    code: 200,
                    isSuccess: true,
                    msg: '库存修改成功！'
                });
            } else {
                res.status(404);
                if (results.msg != undefined) {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: results.msg
                    });
                } else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: '库存修改操作失败！'
                    });
                }
            }
        });
    });
});

//产品类别的删除
router.delete('/', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.productStock.productStockDel.functionCode;
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
            var d = JSON.parse(req.query.d);
            var ID = d.ID;
            if (ID === undefined) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: 'require ID'
                });
            }
            if (isNaN(ID)) {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: 'ID不是数字'
                });
            }
            var deleteData = {
                "ID": ID
            };
            proStockService.delete(deleteData, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        data: results,
                        msg: '服务器出错，操作失败'
                    });
                }
                //判断是否删除成功
                if (results !== undefined && results.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '库存信息删除操作成功'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "库存信息删除操作失败"
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