/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-14 20:41
 * @Function 功能点管理
 */

var express = require('express');
var router = express.Router();

var functionservice = appRequire('service/backend/function/functionservice');

//得到所有树形功能点
router.get('/', function (req, res) {
    data = {};
    functionservice.queryAllFunctions(data, function (err, results) {
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
router.post('/', function (req, res) {

    var data = ['ApplicationID', 'FunctionLevel', 'ParentID', 'FunctionCode', 'FunctionName'];
    var err = 'required: ';
    var formdata = req.body.formdata;
    for (var value in data) {
        if (!(data[value] in formdata)) {
            console.log("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if (err != 'required: ') {
        res.json({
            code: 404,
            isSuccess: false,
            msg: err
        });
        return;
    };

    data.push('Memo');
    var ApplicationID = formdata.ApplicationID;
    var FunctionLevel = formdata.FunctionLevel;
    var ParentID = formdata.ParentID;
    var FunctionCode = formdata.FunctionCode;
    var FunctionName = formdata.FunctionName;
    var Memo = formdata.Memo;
    var IsActive = formdata.IsActive;
    var data = {
        'ApplicationID': ApplicationID,
        'FunctionLevel': FunctionLevel,
        'ParentID': ParentID,
        'FunctionCode': FunctionCode,
        'FunctionName': FunctionName,
        'Memo': Memo,
        'IsActive': 1
    }
    functionservice.insert(data, function (err, result) {
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
                msg: "添加功能点成功"
            })
        } else {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "添加信息失败,服务器出错"
            })
        }
    })

});

//功能点的编辑
router.put('/', function (req, res) {

    var data = ['ApplicationID', 'FunctionID', 'FunctionLevel', 'ParentID', 'FunctionCode', 'FunctionName'];
    var err = 'required: ';
    var formdata = req.body.formdata;
    for (var value in data) {
        if (!(data[value] in formdata)) {
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
    data.push('Memo');
    var ApplicationID = formdata.ApplicationID;
    var FunctionID = formdata.FunctionID;
    var FunctionLevel = formdata.FunctionLevel;
    var ParentID = formdata.ParentID;
    var FunctionCode = formdata.FunctionCode;
    var FunctionName = formdata.FunctionName;
    var Memo = formdata.Memo;

    var data = {
        'ApplicationID': ApplicationID,
        'FunctionID': FunctionID,
        'FunctionLevel': FunctionLevel,
        'ParentID': ParentID,
        'FunctionCode': FunctionCode,
        'FunctionName': FunctionName,
        'Memo': Memo,
    }

    functionservice.update(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "修改失败，服务器出错"
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
                code: 500,
                isSuccess: false,
                msg: '修改信息失败'
            })
        }
    })

});

//功能点的删除
router.delete('/', function (req, res) {
    var FunctionID = JSON.parse(req.query.d).FunctionID;

    console.log('FunctionID' + FunctionID)
    if (FunctionID === undefined || FunctionID == '') {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require FunctionID'
        });
    }
    var data = {
        'FunctionID': FunctionID
    };

    functionservice.delete(data, function (err, results) {
        if (err) {
            if (results > 0) {
                res.json({
                    code: 400,
                    isSuccess: false,
                    msg: '请选删除其子功能点。'
                });
            } else {
                res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '删除失败，服务器出错'
                });
            }
        }

        if (results !== undefined && results.length != 0) {
            res.status('200');
            res.json({
                code: 200,
                isSuccess: true,
                msg: '删除成功'
            });
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: '删除失败'
            });
        }
    })
});

//根据FunctionID得到该功能点的值
router.put('/getFuncByID', function (req, res) {
    var functionID = JSON.parse(req.query.f).functionID;

    if (FunctionID === undefined || FunctionID == '') {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require FunctionID'
        });
        return;
    }

    var data = {
        'FunctionID': functionID,
    };

    functionservice.getFuncByID(data, function (err, results) {
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

module.exports = router;