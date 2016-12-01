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

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

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
        'EditUser': accountID
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

module.exports = router;