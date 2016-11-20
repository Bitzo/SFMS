/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-14 20:41
 */

var express = require('express');
var router = express.Router();

var functionservice = appRequire('service/backend/function/functionservice');

router.get('/', function(req, res) {
    var appID = req.query.appID || 1;

    var data = {
        'ApplicationID': appID,
    };

    //查询所需的详细数据
    functionservice.queryAllFunctions(data, function(err, results) {
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
//功能点的新增
router.post('/insert', function(req, res) {

    var data = ['ApplicationID', 'FunctionLevel', 'ParentID', 'FunctionCode', 'FunctionName', 'Memo', 'IsActive'];
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

    var ApplicationID = req.body.ApplicationID;
    var FunctionLevel = req.body.FunctionLevel;
    var ParentID = req.body.ParentID;
    var FunctionCode = req.body.FunctionCode;
    var FunctionName = req.body.FunctionName;
    var Memo = req.body.Memo;
    var IsActive = req.body.IsActive;
    var data = {
        'ApplicationID': ApplicationID,
        'FunctionLevel': FunctionLevel,
        'ParentID': ParentID,
        'FunctionCode': FunctionCode,
        'FunctionName': FunctionName,
        'Memo': Memo,
        'IsActive': IsActive
    }
    functionservice.insert(data, function(err,result) {
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
router.post('/update', function(req, res) {

    var data = ['ApplicationID', 'FunctionID', 'FunctionLevel', 'ParentID', 'FunctionCode', 'FunctionName', 'Memo', 'IsActive'];
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

    var ApplicationID = req.body.ApplicationID;
    var FunctionID = req.body.FunctionID;
    var FunctionLevel = req.body.FunctionLevel;
    var ParentID = req.body.ParentID;
    var FunctionCode = req.body.FunctionCode;
    var FunctionName = req.body.FunctionName;
    var Memo = req.body.Memo;
    var IsActive = req.body.IsActive;

    var data = {
        'ApplicationID': ApplicationID,
        'FunctionID': FunctionID,
        'FunctionLevel': FunctionLevel,
        'ParentID': ParentID,
        'FunctionCode': FunctionCode,
        'FunctionName': FunctionName,
        'Memo': Memo,
        'IsActive': IsActive
    }

    functionservice.update(data, function(err, results) {
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
router.post('/delete', function(req, res) {
    var FunctionID = req.body.FunctionID;
    console.log(FunctionID)
    if (FunctionID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require FunctionID'
        })
        return;
    }

    var data = {
        'FunctionID': FunctionID
    };
    console.log(data)
    functionservice.delete(data, function(err, results) {
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