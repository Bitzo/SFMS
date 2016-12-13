/**
 * @Author: luozQ
 * @Date:   2016-12-13 上午 11:42
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-12-14 上午 11:45
 * @Function 产品类别管理
 */

var express = require('express');
var router = express.Router();
var proTypeService = appRequire('service/wechat/productype/productypeservice');

//得到所有产品类别
router.get('/', function(req, res) {

    proTypeService.queryAllProType(data, function(err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "查询失败，服务器内部错误"
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            var result = {
                code: 200,
                isSuccess: true,
               // data: results
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
//功能点的新增
router.post('/', function(req, res) {

    var data = ['ProductTypeName'];
    var err = 'required: ';
    for (var value in data) {
        if (!(data[value] in req.body)) {
            console.log("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if (err != 'required: ') {
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    };

    var ProductTypeName = req.body.ProductTypeName;
    var data = {
        'ProductTypeName': ProductTypeName
    }
    proTypeService.insert(data, function(err,result) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "添加失败，服务器出错"
            })
            return;
        }
        if (result !== undefined && result.length != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                data: data,
                msg: "添加信息成功"
            })
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: "添加信息失败"
            })
        }
    })

});

//功能点的编辑
router.put('/', function(req, res) {

    var data = ['ID', 'ProductTypeName'];
    var err = 'required: ';
    for (var value in data) {
        if (!(data[value] in req.body)) {
            console.log("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if (err != 'required: ') {
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    };

    var ID = req.body.ID;
    var ProductTypeName=req.body.ProductTypeName;
    var data = {
        'ID': ID,
        'ProductTypeName': ProductTypeName,
    }

    proTypeService.update(data, function(err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "添加失败，服务器出错"
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                data: data,
                msg: '修改信息成功'
            })
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: '修改信息失败'
            })
        }
    })
});

//功能点的删除
router.delete('/', function(req, res) {
   var ID = JSON.parse(req.query.d).ID;

    if (ID === undefined||ID=='') {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require ID'
        })
        return;
    }

    var data = {
        'ID': ID
    };
    console.log(data)
    proTypeService.delete(data, function(err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: '删除失败，服务器出错'
            })
            return;
        }

        if (results !== undefined && results.length != 0) {

            res.json({
                code: 200,
                isSuccess: true,
                msg: '删除成功',
                dataNum: results.length,
                data: results
            })
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: '删除失败！请刷新！'
            })
        }
    })
});

module.exports = router;