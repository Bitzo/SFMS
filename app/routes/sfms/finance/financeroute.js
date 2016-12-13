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
    var query = req.body,
        fiName = query.fiName,
        fiType = query.fiType,
        inOutType = query.inOutType,
        fiPrice = query.fiPrice,
        projectID = query.projectID,
        userID = query.userID,
        userName = query.userName,
        operateUser = req.query.jitkey,
        remark = query.remark || '',
        isActive = 1,
        //前端需要传输的数据
        temp = ['fiName', 'fiType', 'inOutType', 'fiPrice', 'projectID','userID','userName'],
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
        'Remark': remark,
        'IsActive': isActive
    };

    for(var value in temp)
    {
        if(!(temp[value] in query))
        {
            logger.writeInfo("require " + temp[value]);
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
            res.status(400);
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
    var query = req.body,
        ID = query.ID,
        fiName = query.fiName,
        fiType = query.fiType,
        inOutType = query.inOutType,
        fiPrice = query.fiPrice,
        projectID = query.projectID,
        userID = query.userID,
        userName = query.userName,
        operateUser = req.query.jitkey,
        remark = query.remark || '',
        isActive = 1,
        //前端需要传输的数据
        temp = ['ID', 'fiName', 'fiType', 'inOutType', 'fiPrice', 'projectID','userID','userName'],
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
        'Remark': remark,
        'IsActive': isActive
    };

    for(var value in temp)
    {
        if(!(temp[value] in query))
        {
            logger.writeInfo("require " + temp[value]);
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
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: results
            })
        }
    })
})

//财务信息查询
router.get('/', function (req, res) {
    var query = req.query,
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        fiType = query.fiType || '',
        inOutType = query.inOutType || '',
        username = query.username || '',
        fiStatus = query.fiStatus || '',
        page = req.query.pageindex || 1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;
    page = page > 0 ? page : 1;

    var data = {
        'Username': username,
        'InOutType': inOutType,
        'FIType': fiType,
        'FIStatus': fiStatus,
        'startTime': startTime,
        'endTime': endTime,
        'page': page,
        'pageNum': pageNum,
        'IsActive': 1
    }

    financeService.countQuery(data, function (err, results) {
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
            financeService.queryFinance(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    })
                }
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

//财务审核
router.put('/check', function (req, res) {
    var data = req.body.data,
        temp = ['ID', 'CheckUser', 'FIStatu'],
        err = 'require: ';
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
    financeService.checkFinance(data, function (err, results) {
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
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: results
            })
        }
    })
})

//财务删除
router.delete('/', function (req, res) {
    var ID = req.body.ID;
    if (ID == '' || ID === undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: "require ID"
        })
    }

    var data = {
        'ID': ID,
        'IsActive': 0
    };

    financeService.updateFinance(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: "服务器出错"
            });
        }
        if(results !== undefined && results.affectedRows > 0) {
            res.status(200);
            res.json({
                status: 200,
                isSuccess: true,
                msg: "删除成功"
            })
        } else {
            res.status(400);
            res.json({
                status: 400,
                isSuccess: true,
                msg: "删除失败"
            })
        }
    })
})
module.exports = router;