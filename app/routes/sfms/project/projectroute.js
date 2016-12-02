/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:24
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:24
 * @Function: project 项目管理
 */

var express = require('express');
var router = express.Router();
var projectservice = appRequire('service/sfms/project/projectservice');
var config = appRequire('config/config');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目基本信息新增
router.post('/', function (req, res) {
    var projectName = req.body.projectName,
        projectDesc = req.body.projectDesc,
        projectID = req.body.projectID,
        projectManageID = req.body.projectManageID,
        projectManageName = req.body.projectManageName,
        projectEndTime = req.body.projectEndTime,
        projectTimeLine = req.body.projectTimeLine,
        projectStatus = req.body.projectStatus,
        projectPrice = req.body.projectPrice,
        accountID = req.body.jitkey;

    var data = {
        'ProjectName': projectName,
        'ProjectDesc': projectDesc,
        'ProjectID': projectID,
        'ProjectManageID': projectManageID,
        'ProjectManageName': projectManageName,
        'ProjectEndTime': projectEndTime,
        'ProjectTimeLine': projectTimeLine,
        'ProjectStatus': projectStatus,
        'ProjectPrice': projectPrice,
        'OperateUser': accountID,
        'EditUser': accountID,
        'EditTime': '',
        'CreateTime': ''
    }

    //检查所需要的参数是否齐全
    var temp = ['projectName', 'projectDesc', 'projectID', 'jitkey', 'projectStatus', 'projectPrice',
            'projectManageID', 'projectManageName', 'projectEndTime', 'projectTimeLine'],
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

    projectservice.addProject(data, function (err, results) {
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
                msg: '添加项目成功'
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

//项目基本信息修改
router.put('/', function (req, res) {
    var ID = req.body.ID,
        projectName = req.body.projectName,
        projectDesc = req.body.projectDesc,
        projectID = req.body.projectID,
        projectManageID = req.body.projectManageID,
        projectManageName = req.body.projectManageName,
        projectEndTime = req.body.projectEndTime,
        projectTimeLine = req.body.projectTimeLine,
        projectStatus = req.body.projectStatus,
        projectPrice = req.body.projectPrice,
        accountID = req.body.jitkey,
        time = new Date().toLocaleString();

    var data = {
        'ID': ID,
        'ProjectDesc': projectDesc,
        'ProjectID': projectID,
        'ProjectName': projectName,
        'ProjectManageID': projectManageID,
        'ProjectManageName': projectManageName,
        'ProjectEndTime': projectEndTime,
        'ProjectTimeLine': projectTimeLine,
        'ProjectStatus': projectStatus,
        'ProjectPrice': projectPrice,
        'OperateUser': accountID,
        'EditUser': accountID,
        'EditTime': time
    }

    //检查所需要的参数是否齐全
    var temp = ['ID', 'projectName', 'projectDesc', 'projectID', 'jitkey', 'projectStatus', 'projectPrice',
            'projectManageID', 'projectManageName', 'projectEndTime', 'projectTimeLine'],
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
    projectservice.updateProject(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        console.log(results);
        if(results !== undefined && results.affectedRows > 0) {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: true,
                msg: '修改项目成功'
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

//项目基本信息查询
router.get('/', function (req, res) {
    var projectName = req.query.projectName,
        projectManageName = req.query.projectManageName,
        projectStatus = req.query.projectStatus,
        page = req.query.page>0 ?req.query.page:1,
        totleNum = 0;

    var data = {
        'ProjectName': projectName,
        'ProjectManageName': projectManageName,
        'ProjectStatus': projectStatus,
        'page': page
    }
    
    //查询数据量
    projectservice.countQuery(data, function (err, results) {
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
            projectservice.queryProject(data, function (err, results) {
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
                        totleNum: totleNum,
                        curPage: page,
                        totlePage: Math.ceil(totleNum/config.pageCount),
                        curNum: config.pageCount,
                        data: results
                    };
                    if(result.curPage == result.totlePage) {
                        result.curNum = result.totleNum - (result.totlePage-1)*config.pageCount;
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