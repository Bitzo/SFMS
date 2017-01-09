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
                msg: "操作失败，服务器内部错误"
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                data: results
            });
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

    var data = ['ApplicationID', 'FunctionLevel', 'ParentID', 'FunctionCode', 'FunctionName', 'IsActive'];
    var err = 'required: ';
    var formdata = req.body.formdata;
    for (var value in data) {
        if (!(data[value] in formdata)) {
            console.log("require " + data[value]);
            err += data[value] + ' ';
        }
    }

    if (err != 'required: ') {
        res.status(400);
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
    var Memo = formdata.Memo || '';
    var IsActive = formdata.IsActive;
    var data = {
        'ApplicationID': ApplicationID,
        'FunctionLevel': FunctionLevel,
        'ParentID': ParentID,
        'FunctionCode': FunctionCode,
        'FunctionName': FunctionName,
        'Memo': Memo,
        'IsActive': IsActive
    }
    var intdata = {
        'ApplicationID': ApplicationID,
        "ParentID": ParentID,
        "IsActive": IsActive,
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
    functionservice.insert(data, function (err, result) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败，服务器出错"
            })
            return;
        }
        if (result !== undefined && result.length != 0 && result.affectedRows > 0) {
            res.json({
                code: 200,
                isSuccess: true,
                data: data,
                msg: "操作成功"
            })
        } else {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败,服务器出错"
            })
        }
    })

});

//功能点的编辑
router.put('/', function (req, res) {

    var data = ['ApplicationID', 'FunctionID', 'FunctionLevel', 'ParentID', 'FunctionCode', 'FunctionName', 'IsActive'];
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
    var Memo = formdata.Memo || '';
    var IsActive = formdata.IsActive;

    var intdata = {
        "FunctionID": FunctionID,
        "ApplicationID": ApplicationID,
        "ParentID": ParentID,
        "IsActive": IsActive,
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

    functionservice.update(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败，服务器出错"
            })
            return;
        }

        if (results !== undefined && results.length != 0) {
            if (results.affectedRows > 0) {
                res.json({
                    code: 200,
                    isSuccess: true,
                    msg: '操作成功'
                });
            } else {
                res.json({
                    code: 404,
                    isSuccess: false,
                    msg: '不存在该功能点'
                });
            }
        } else {
            res.json({
                code: 500,
                isSuccess: false,
                msg: '操作失败'
            });
        }
    })

});

//功能点的删除
router.delete('/', function (req, res) {
    var FunctionID = JSON.parse(req.query.d).FunctionID;
    if (FunctionID === undefined || FunctionID == '') {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require FunctionID'
        })
        return;
    }
    if (isNaN(FunctionID)) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'FunctionID 不是数字'
        })
        return;
    }

    var data = {
        'FunctionID': FunctionID
    };

    functionservice.delete(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: results
            });
            console.log('111')
            return;
        }
        if (results !== undefined && results.length != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                msg: results
            });
            console.log('200')
            return;
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: '删除失败！'
            });
            console.log('333')
            return;
        }
    })
});

//根据FunctionID得到该功能点的值
router.get('/getFuncByID', function (req, res) {
    var FunctionID = JSON.parse(req.query.f).FunctionID;
    if (FunctionID === undefined || FunctionID == '') {
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