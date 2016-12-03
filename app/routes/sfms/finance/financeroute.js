/**
 * @Author: bitzo
 * @Date: 2016/12/3 19:53
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/3 19:53
 * @Function: 财务管理
 */

var express = require('express');
var router = express.Router();
var financeService = appRequire('service/sfms/finance/financeservice');
var config = appRequire('config/config');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//财务信息新增
router.post('/', function (req, res) {
    var fiName = req.body.fiName,
        fiType = req.body.fiType,
        inOutType = req.body.inOutType,
        fiPrice = req.body.fiPrice,
        projectID = req.body.projectID,
        userID = req.body.userID,
        userName = req.body.userName,
        operateUser = req.body.operateUser,
        remark = req.body.remark,
        //前端需要传输的数据
        temp = ['fiName', 'fiType', 'inOutType', 'fiPrice', 'projectID','userID','userName', 'operateUser', 'remark'],
        err = 'require: ';
    var data = {
        'FIName': fiName,
        'FIType': fiType,
        'InOutType': inOutType,
        'FIPrice': fiPrice,
        'ProjectID': projectID,
        'UserID': userID,
        'UserName': userName,
        'OperateUser': operateUser,
        'FIStatu': '待审核',
        'Remark': remark
    };

    for(var value in temp)
    {
        if(!(temp[value] in req.body))
        {
            console.log("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if(err!='require: ')
    {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    };

    financeService.addFinance(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        if(results !== undefined && results.insertId > 0) {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: true,
                msg: '添加成功'
            })
        } else {
            res.status(404);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: results
            })
        }
    })
})


//财务基本信息编辑
router.put('/', function (req, res) {
    var ID = req.body.ID,
        fiName = req.body.fiName,
        fiType = req.body.fiType,
        inOutType = req.body.inOutType,
        fiPrice = req.body.fiPrice,
        projectID = req.body.projectID,
        userID = req.body.userID,
        userName = req.body.userName,
        operateUser = req.body.operateUser,
        remark = req.body.remark,
        //前端需要传输的数据
        temp = ['ID', 'fiName', 'fiType', 'inOutType', 'fiPrice', 'projectID','userID','userName', 'operateUser', 'remark'],
        err = 'require: ';
    var data = {
        'ID': ID,
        'FIName': fiName,
        'FIType': fiType,
        'InOutType': inOutType,
        'FIPrice': fiPrice,
        'ProjectID': projectID,
        'UserID': userID,
        'UserName': userName,
        'OperateUser': operateUser,
        'FIStatu': '待审核',
        'Remark': remark
    };

    for(var value in temp)
    {
        if(!(temp[value] in req.body))
        {
            console.log("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if(err!='require: ')
    {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    };

    financeService.updateFinance(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        if(results !== undefined && results.affectedRows > 0) {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: true,
                msg: '更新成功'
            })
        } else {
            res.status(404);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: results
            })
        }
    })
})

module.exports = router;