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
var projectservice = appRequire('service/sfms/project/projectservice');
var userservice = appRequire('service/backend/user/userservice');
var moment = require('moment');
var config = appRequire('config/config');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

/**
 * 项目用户信息新增
 * 1. 查询项目ID的项目名称
 * 2. 查询editID的username并赋值给EditName、OperateName
 * 3. 查询所有UserID的UserName
 */
router.post('/', function (req, res) {
    /**
     * data:[
     *   {
     *     projectID: 1,
     *     userID: 1,
     *     editID: 1,
     *     duty: xxx,
     *     isActive: 1
     *   },
     *   ...
     * ]
     */
    var data = req.body.formdata,
        operateID = req.query.jitkey;
    //检查所需要的参数是否齐全
    var temp = ['projectID', 'userID', 'editID', 'isActive'],
        err = 'required: ';
    console.log(data)
    for(var value in temp)
    {
        if(!(temp[value] in data[0]))
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
    projectservice.queryProject({ID:data[0].projectID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if(results!==undefined && results.length > 0) {
            for (var i in data) {
                data[i].ProjectName = results[0].ProjectName;
            }
            userservice.querySingleID(operateID, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results!==undefined && results.length>0) {
                    for (var i in data) {
                        data[i].editName = results[0].UserName;
                        data[i].OperateUser = results[0].UserName;
                    }
                    var ID = [];
                    for (var i in data) {
                        if (i==0) ID[i] = data[i].userID;
                        else {
                            var j = 0;
                            for(j=0;j<ID.length;++j) {
                                if (data[i] == ID[j]) break;
                            }
                            if (j == ID.length) {
                                ID[j] = data[i].userID;
                            }
                        }
                    }
                    userservice.queryAccountByID(ID, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        if (results!==undefined&&results.length>0) {
                            for (var i=0;i<data.length;++i) {
                                var k = false;
                                for(var j=0;j<results.length;++j) {
                                    if (data[i].userID == results[j].AccountID) {
                                        k = true;
                                        data[i].UserName = results[j].UserName;
                                    }
                                }
                                if (k == false) {
                                    res.status(400);
                                    return res.json({
                                        status: 400,
                                        isSuccess: false,
                                        msg: '操作失败，添加的用户 '+ data[i].ID +' 信息有误！'
                                    })
                                }
                            }
                            projectuserservice.addProjectUser(data, function (err, results) {
                                if (err) {
                                    res.status(500);
                                    return res.json({
                                        status: 500,
                                        isSuccess: false,
                                        msg: '操作失败，服务器出错'
                                    })
                                }
                                if(results !== undefined && results.insertId > 0) {
                                    res.status(200);
                                    return res.json({
                                        status: 200,
                                        isSuccess: true,
                                        msg: '操作成功'
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
                                msg: '操作失败，添加的用户信息有误！'
                            })
                        }
                    })
                } else {
                    res.status(400);
                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '操作失败，操作用户有误'
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '操作失败，项目信息有误！'
            })
        }
    })
})

//项目用户信息修改
router.put('/', function (req, res) {
    var ID = req.body.formdata.ID,
        projectName = req.body.formdata.projectName,
        projectID = req.body.formdata.projectID,
        userID = req.body.formdata.userID,
        userName = req.body.formdata.userName,
        operateUser = req.body.formdata.operateUser,
        editName = req.body.formdata.editName,
        duty = req.body.formdata.duty,
        isActive = req.body.formdata.isActive;

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
    var temp = ['ID', 'projectName', 'projectID', 'userID', 'userName', 'operateUser', 'editName', 'duty', 'isActive'],
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
                msg: '操作失败，服务器出错'
            })
        }
        if(results !== undefined && results.affectedRows > 0) {
            res.status(200);
            return res.json({
                status: 200,
                isSuccess: true,
                msg: '操作成功'
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
router.get('/:projectID', function (req, res) {
    var query = req.query;
    var projectID = req.params.projectID || '',
        userName = query.userName || '',
        isActive = query.isActive || 1,
        page = req.query.pageindex > 0 ? req.query.pageindex : 1 ,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ProjectID': projectID,
        'UserName': userName,
        'OperateUserID': req.query.jitkey,
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
                msg: '操作失败，服务器出错'
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
                        msg: '操作失败，服务器出错'
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

router.delete('/', function (req, res) {
    var ID = JSON.parse(req.query.d).ID;
    if (ID == '' || ID === undefined) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: 'require: ID'
        })
    }
    var data = [
        {
            'ID': ID,
            'IsActive': 0
        }
    ]

    projectuserservice.updateProjectUser(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败，服务器出错"
            });
        }
        if (results!==undefined) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: false,
                msg: "操作成功"
            });
        }
    })
})

module.exports = router;