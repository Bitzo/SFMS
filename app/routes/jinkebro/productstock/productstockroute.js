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
    logger = appRequire("util/loghelper").helper,
    moment = require('moment');

//查看库存信息
router.get('/', function (req, res) {
    console.log(req.query)
    var data = {};
    if (req.query !== undefined) {
        var query = req.query;
        var page = (query.pageindex || query.pageindex) ? (query.pageindex || query.pageindex) : 1,
            pageNum = (query.pagesize || query.pagesize) ? (query.pagesize || query.pagesize) : 20,
            data = {
                ProductID: query.ProductID || '',
                StockAreaID: query.StockAreaID || '',
                CreateUserID: query.CreateUserID || '',
                CreateTime: query.CreateTime || '',
                EditUserID: query.EditUserID || '',
                EditTime: query.EditTime || ''
            };
    }
                        
    console.log(data.ProductID);
    proStockService.queryProStock(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败，服务器内部错误"
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            var result = {
                code: 200,
                isSuccess: true,
                data: results
            };
            res.json(result);
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
        }
    });
});



//库存信息的新增
router.post('/', function (req, res) {
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
});

//修改库存信息
router.put('/', function (req, res) {

    var datainfo = '';
    for (var key in req.body) {
        datainfo = key;
    }

    console.log(datainfo);
    var formdata = JSON.parse(datainfo);
    //检查所需要的字段是否都存在
    var data = ['ID', 'ProductID', 'TotalNum'];
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
    var initdata = {
        'ID': formdata.ID,
        'ProductID': formdata.ProductID,
        'TotalNum': formdata.TotalNum,
        'StockAreaID': formdata.StockAreaID,
        'EditUserID': formdata.EditUserID,
    }
    for (var key in initdata) {
        if (isNaN(initdata[key])) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + initdata[key] + '不是数字'
            });
        }
    }
    // 存放接收的数据
    var updatedata = {
        'ID': initdata.ID,
        'ProductID': initdata.ProductID,
        'TotalNum': initdata.TotalNum,
        'StockAreaID': initdata.StockAreaID,
        'EditUserID': initdata.EditUserID,
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

        if (results !== undefined && results.affectedRows != 0) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                addProductResult: results,
                msg: '产品类别修改成功'
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "产品类别操作失败"
            });
        }
    });
});

//产品类别的删除
router.delete('/', function (req, res) {
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
});
module.exports = router;