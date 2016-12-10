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
            logger.writeInfo("require " + temp[value]);
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
            logger.writeInfo("require " + temp[value]);
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
        pageNum = req.query.pagesize || 20,
        totalNum = 0;

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
        logger.writeInfo(results);
        totalNum = results[0].num;
        if(totalNum > 0) {
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
                logger.writeInfo(results);
                if (results !== undefined && results.length > 0) {
                    var result = {
                        status: 200,
                        isSuccess: true,
                        dataNum: totalNum,
                        curPage: page,
                        totalPage: Math.ceil(totalNum/pageNum),
                        curPageNum: pageNum,
                        data: results
                    };
                    if(result.curPage == result.totalPage) {
                        result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                    }
                    res.status(200);
                    return res.json(result);
                } else {
                    res.status(200);
                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '无数据'
                    })
                }
            })
        } else {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: false,
                msg: '无数据'
            })
        }
    })
})

//KPI审核
router.put('/check', function (req, res) {
    var data = req.body.data,
        temp = ['ID', 'CheckUser', 'KPIStatus', 'Remark'],
        err = 'require: '
    logger.writeInfo(data);
    for (var key in temp) {
        if (!(temp[key] in data[0])) {
            logger.writeInfo("require: " + temp[key]);
            err += temp[key];
        }
    }
    if (err != 'require: ') {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: err
        })
    }
    KPIservice.checkKPI(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: results
            })
        }
        if(results !== undefined && results.length > 0) {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: true,
                msg: results
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