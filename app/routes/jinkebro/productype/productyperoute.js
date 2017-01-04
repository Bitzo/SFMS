/**
 * @Author: luozQ
 * @Date: 2017/1/4 20:40
 * @Last Modified by: luozQ
 * @Last Modified time:  2017/1/4 20:50
 * @Function: 商品类别管理
 */
var express = require('express'),
    router = express.Router(),
    productypeService = appRequire('service/jinkebro/productype/productypeservice'),
    moment = require('moment'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config');

//查看产品类别
router.get('/', function (req, res) {

    data = {};
    if (req.query.f != undefined) {
        var query = JSON.parse(req.query.f);
        data = {
            ID: query.ID || '',
            ProductTypeName: query.ProductTypeName || ''
        };
    }

    productypeService.queryAllProType(data, function (err, results) {
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

//产品类别的新增
router.post('/', function (req, res) {
    if (req.body.formdata == undefined)
        res.status(400);
    return res.json({
        code: 404,
        isSuccess: false,
        msg: '存在未填写的必填字段'
    });
    
    var formdata = JSON.parse(req.body.formdata);

    //检查所需要的字段是否都存在
    var data = ['ProductTypeName'];
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

    var ProductTypeName = formdata.ProductTypeName || '';

    // 存放接收的数据
    var data = {
        "ProductTypeName": ProductTypeName
    };
    console.log(data.ProductTypeName)
    //执行插入操作
    productypeService.insert(data, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                data: result,
                msg: '服务器出错，产品类别新增操作失败'
            });
        }


        if (result !== undefined && result.affectedRows != 0) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                data: result,
                msg: '产品类别添加成功'
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "产品类别添加操作失败"
            });
        }
    });
});

//修改产品类别
router.put('/', function (req, res) {
    var formdata = JSON.parse(req.body.formdata);

    //检查所需要的字段是否都存在
    var data = ['ID', 'ProductTypeName'];
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
    var updatedata = {
        "ID": formdata.ID,
        'ProductTypeName': formdata.ProductTypeName
    };
    if (isNaN(formdata.ID)) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: key + ": " + intdata[key] + '不是数字'
        });
    }
    console.log(updatedata)
    productypeService.update(updatedata, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                addProductResult: results,
                msg: '服务器出错，产品类别新增操作失败'
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
                msg: "产品类别修改失败"
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
    productypeService.delete(deleteData, function (err, results) {
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
                data: results,
                msg: '产品类别删除操作成功'
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "产品类删除操作失败"
            });
        }
    });
});
module.exports = router;