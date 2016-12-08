/**
 * @Author: bitzo
 * @Date: 2016/12/1 19:21
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/1 19:21
 * @Function: 项目用户
 */
var express = require('express');
var router = express.Router();
var projectuserservice = appRequire('service/sfms/project/projectuserservice');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目用户信息新增
router.post('/', function (req, res) {
    var projectName = req.body.projectName,
        projectID = req.body.projectID,
        userID = req.body.userID,
        userName = req.body.userName,
        operateUser = req.body.operateUser,
        editName = req.body.editName,
        duty = req.body.duty,
        isActive = req.body.isActive;

    var data = {
        'ProjectName': projectName,
        'ProjectID': projectID,
        'UserID': userID,
        'UserName': userName,
        'OperateUser': operateUser,
        'EditName': editName,
        'Duty': duty,
        'IsActive': isActive,
        'EditTime': '',
        'CreateTime': ''
    }
    //检查所需要的参数是否齐全
    var temp = ['projectName', 'projectID', 'userID', 'userName', 'operateUser', 'editName', 'duty', 'isActive'],
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
    projectuserservice.addProjectUser(data, function (err, results) {
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

//项目用户信息修改
router.put('/', function (req, res) {
    var ID = req.body.ID,
        projectName = req.body.projectName,
        projectID = req.body.projectID,
        userID = req.body.userID,
        userName = req.body.userName,
        operateUser = req.body.operateUser,
        editName = req.body.editName,
        duty = req.body.duty,
        isActive = req.body.isActive;

    var data = {
        'ID': ID,
        'ProjectName': projectName,
        'ProjectID': projectID,
        'UserID': userID,
        'UserName': userName,
        'OperateUser': operateUser,
        'EditName': editName,
        'Duty': duty,
        'IsActive': isActive,
        'EditTime': ''
    }
    //检查所需要的参数是否齐全
    var temp = ['ID', 'projectName', 'projectID', 'userID', 'userName', 'operateUser', 'editName', 'duty', 'isActive']
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

    projectuserservice.updateProjectUser(data, function (err, results) {
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
                msg: '修改成功'
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

//项目用户信息查询
router.get('/', function (req, res) {
    var projectName = req.query.projectName,
        userName = req.query.userName,
        isActive = req.query.isActive,
        page = req.query.pageindex > 0 ? req.query.pageindex : 1 ,
        pageNum = req.query.pagesize,
        totalNum = 0;

    if (pageNum === undefined) pageNum = config.pageCount;

    var data = {
        'ProjectName': projectName,
        'UserName': userName,
        'IsActive': isActive,
        'page': page,
        'pageNum': pageNum
    }

    //查询数据量
    projectuserservice.countQuery(data, function (err, results) {
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
            projectuserservice.queryProjectUser(data, function (err, results) {
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
                    res.status(404);
                    return res.json({
                        status: 404,
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

module.exports = router;