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
var userservice = appRequire('service/backend/user/userservice');
var config = appRequire('config/config');
var moment = require('moment');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目基本信息新增
router.post('/', function (req, res) {
    var query = req.body;
    var projectName = query.projectName,
        projectDesc = query.projectDesc,
        projectManageID = query.projectManageID,
        projectManageName = query.projectManageName,
        projectEndTime = query.projectEndTime,
        projectTimeLine = query.projectTimeLine,
        projectStatus = query.projectStatus,
        projectPrice = query.projectPrice,
        accountID = query.jitkey;

    //检查所需要的参数是否齐全
    var temp = ['projectName', 'projectDesc', 'jitkey', 'projectStatus', 'projectPrice',
            'projectManageID', 'projectEndTime', 'projectTimeLine'],
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

    userservice.querySingleID(projectManageID, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        if (results!==undefined && results.length>0) {
            projectManageName = results[0].UserName;
            var data = {
                'ProjectName': projectName,
                'ProjectDesc': projectDesc,
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
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '项目负责人信息有误'
            })
        }
    })
})

//项目基本信息修改
router.put('/', function (req, res) {
    var query = req.body;
    var ID = query.ID,
        projectName = query.projectName,
        projectDesc = query.projectDesc,
        projectManageID = query.projectManageID,
        projectManageName = query.projectManageName,
        projectEndTime = query.projectEndTime,
        projectTimeLine = query.projectTimeLine,
        projectStatus = query.projectStatus,
        projectPrice = query.projectPrice,
        accountID = query.jitkey,
        time = moment().format('YYYY-MM-DD HH:mm:ss');

    //检查所需要的参数是否齐全
    var temp = ['ID', 'projectName', 'projectDesc', 'jitkey', 'projectStatus', 'projectPrice', 'projectManageID', 'projectEndTime', 'projectTimeLine'],
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

    userservice.querySingleID(projectManageID, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        if (results!==undefined && results.length>0) {
            projectManageName = results[0].UserName;
            var data = {
                'ID': ID,
                'ProjectDesc': projectDesc,
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
            projectservice.updateProject(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    })
                }
                logger.writeInfo(results);
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
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '项目负责人信息有误'
            })
        }
    })

})

//项目基本信息查询
router.get('/', function (req, res) {
    var query = req.query,
        ID = query.ID || '',
        projectManageID = query.projectManageID || '',
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        page = req.query.pageindex>0 ?req.query.pageindex:1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ID': ID,
        'ProjectManageID': projectManageID,
        'CreateTime': startTime,
        'ProjectEndTime': endTime,
        'page': page,
        'pageNum': pageNum,
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
        totalNum = results[0].num;
        if(totalNum > 0) {
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
                if (results !== undefined && results.length > 0) {
                    for (var i in results) {
                        if (results[i].ProjectEndTime != null)
                            results[i].ProjectEndTime = moment(results[i].ProjectEndTime).format('YYYY-MM-DD HH:mm:ss');
                        if (results[i].CreateTime != null)
                            results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm:ss');
                        if (results[i].EditTime != null)
                            results[i].EditTime = moment(results[i].EditTime).format('YYYY-MM-DD HH:mm:ss');
                    }
                    var result = {
                        status: 200,
                        isSuccess: true,
                        dataNum: totalNum,
                        curPage: page,
                        totalPage: Math.ceil(totalNum/pageNum),
                        curPageNum: pageNum,
                        data: results
                    };
                    if(result.curPage == result.totlePage) {
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

//项目删除
router.delete('/', function (req, res) {
    var ID = req.body.ID;

    if (ID == '' || ID === undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: 'require: ID'
        })
    }
    var data = {
        'ID': ID,
        'IsActive': 0
    };

    projectservice.updateProject(data, function (err, results) {
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