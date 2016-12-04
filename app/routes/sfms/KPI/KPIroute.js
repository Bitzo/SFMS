/**
 * @Author: bitzo
 * @Date: 2016/12/2 16:25
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/2 16:25
 * @Function: KPI 路由
 */

var express = require('express');
var router = express.Router();
var KPIservice = appRequire('service/sfms/KPI/KPIservice');
var config = appRequire('config/config');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//KPI信息新增
router.post('/', function (req, res) {
    var KPIName = req.body.KPIName,
        KPIType = req.body.KPIType,
        KPIScore = req.body.KPIScore,
        ProjectID = req.body.ProjectID,
        UserID = req.body.UserID,
        UserName = req.body.UserName,
        OperateUser = req.body.OperateUser,
        Remark = req.body.Remark;

    var data = {
        'KPIName': KPIName,
        'KPIType': KPIType,
        'KPIScore': KPIScore,
        'ProjectId': ProjectID,
        'UserID': UserID,
        'UserName': UserName,
        'OperateUser': OperateUser,
        'KPIStatus': '待审核',
        'Remark': Remark
    }
    //检查所需要的参数是否齐全
    var temp = ['KPIName', 'KPIType', 'KPIScore', 'ProjectID', 'UserID','OperateUser', 'UserName', 'Remark'],
        err = 'required: ';
    for(var value in temp)
    {
        if(!(temp[value] in req.body))
        {
            console.log("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if(err!='required: ')
    {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    };

    KPIservice.addKPI(data, function (err, results) {
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

//KPI基本信息编辑
router.put('/', function (req, res) {
    var ID = req.body.ID,
        KPIName = req.body.KPIName,
        KPIType = req.body.KPIType,
        KPIScore = req.body.KPIScore,
        ProjectID = req.body.ProjectID,
        UserID = req.body.UserID,
        UserName = req.body.UserName,
        OperateUser = req.body.OperateUser,
        KPIStatus = req.body.KPIStatus,
        Remark = req.body.Remark;

    var data ={
        'ID': ID,
        'KPIName': KPIName,
        'KPIType': KPIType,
        'KPIScore': KPIScore,
        'ProjectId': ProjectID,
        'UserID': UserID,
        'UserName': UserName,
        'OperateUser': OperateUser,
        'KPIStatus': '待审核',
        'Remark': Remark
    }

    //检查所需要的参数是否齐全
    var temp = ['ID', 'KPIName', 'KPIType', 'KPIScore', 'ProjectID', 'UserID', 'OperateUser', 'UserName', 'Remark'],
        err = 'required: ';
    for(var value in temp)
    {
        if(!(temp[value] in req.body))
        {
            console.log("require " + temp[value]);
            err += temp[value] + ' ';
        }
    }
    if(err!='required: ')
    {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    };

    KPIservice.updateKPI(data, function (err, results) {
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

//KPI查询
router.get('/', function (req, res) {
    var KPIName = req.query.KPIName,
        KPIType = req.query.KPIType,
        ProjectID = req.query.ProjectID,
        UserName = req.query.UserName,
        KPIStatus = req.query.KPIStatus,
        page = req.query.pageindex > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize,
        totleNum = 0;

    if (pageNum === undefined) pageNum = config.pageCount;

    var data = {
        'KPIName': KPIName,
        'KPIType': KPIType,
        'ProjectID': ProjectID,
        'UserName': UserName,
        'KPIStatus': KPIStatus,
        'page': page,
        'pageNum': pageNum
    }

    KPIservice.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        console.log(results);
        totleNum = results[0].num;
        if(totleNum > 0) {
            //查询所需的详细数据
            KPIservice.queryKPI(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    })
                }
                console.log(results);
                if (results !== undefined && results.length > 0) {
                    var result = {
                        status: 200,
                        isSuccess: true,
                        dataNum: totleNum,
                        curPage: page,
                        totlePage: Math.ceil(totleNum/pageNum),
                        curPageNum: pageNum,
                        data: results
                    };
                    if(result.curPage == result.totlePage) {
                        result.curPageNum = result.dataNum - (result.totlePage-1)*pageNum;
                    }
                    res.status(200);
                    return res.json(result);
                } else {
                    res.status(404);
                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '无数据'
                    })
                }
            })
        } else {
            res.status(404);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '无数据'
            })
        }
    })
})

module.exports = router;