/**
 * @Author: bitzo
 * @Date: 2016/12/2 16:25
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/13 10:25
 * @Function: KPI 路由
 */

var express = require('express');
var router = express.Router();
var KPIservice = appRequire('service/sfms/KPI/KPIservice');
var dataservice = appRequire('service/backend/datadictionary/datadictionaryservice');
var projectuserservice = appRequire('service/sfms/project/projectuserservice');
var userservice = appRequire('service/backend/user/userservice');
var config = appRequire('config/config');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;


/**
 * KPI信息新增：
 *  所需要做的步骤：
 *  1、验证绩效分用户userID是否属于项目projectID
 *  2、查询KPIName, KPIType是否在字典表里
 *  3、获取userID的用户名UserName
 *  4、数据获取并验证完毕后再存入KPI数据
 */
router.post('/', function (req, res) {
    var query = req.body,
        ProjectID = query.ProjectID,
        KPIType = query.KPIType,//字典表的ID
        KPIScore = query.KPIScore,
        OperateUser = req.query.jitkey,
        UserID = query.UserID,
        UserName = query.UserName,
        KPIName = query.KPIName,//字典表ID
        Remark = query.Remark || '',
        isTrue = false; //用于逻辑上的判断

    //检查所需要的参数是否齐全
    var temp = ['KPIName', 'KPIType', 'KPIScore', 'ProjectID', 'UserID', 'UserName'],
        err = 'required: ';
    for(var value in temp)
    {
        if(!(temp[value] in query))
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

    //验证绩效分用户userID是否属于项目projectID
    projectuserservice.queryProjectByUserID({'UserID': UserID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
            console.log(results)
        if (results !== undefined && results.length>0) {
            for (var i in results) {
                if (results[i].ProjectID == ProjectID) isTrue = true;
            }
            if (isTrue == true) {
                isTrue = false;
                //查询KPIName, KPIType是否在字典表里
                var DicID = {
                    'DictionaryID': [KPIName, KPIType]
                }
                dataservice.queryDatadictionaryByID(DicID, function (err, results) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '服务器出错'
                        })
                    }
                    if (results !== undefined && results.length == DicID.DictionaryID.length) {
                        KPIName = results[0].DictionaryValue;
                        KPIType = results[1].DictionaryValue;
                        //获取userID的用户名UserName
                        userservice.querySingleID(UserID, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '服务器出错'
                                })
                            }
                            if (results !== undefined && results.length > 0) {
                                UserName = results[0].UserName;
                                //数据获取并验证完毕后再存入KPI数据
                                var data = {
                                    'KPIName': KPIName,
                                    'KPIType': KPIType,
                                    'KPIScore': KPIScore,
                                    'ProjectId': ProjectID,
                                    'UserID': UserID,
                                    'UserName': UserName,
                                    'OperateUser': OperateUser,
                                    'KPIStatus': '待审核',
                                    'Remark': Remark,
                                    'IsActive': 1
                                }
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
                                        res.status(400);
                                        return res.json({
                                            status: 404,
                                            isSuccess: false,
                                            msg: results
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        res.status(400);
                        return res.json({
                            status: 404,
                            isSuccess: false,
                            msg: '该绩效类型或名称无效'
                        })
                    }
                })
            } else {
                res.status(400);
                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '该用户不在该项目中'
                })
            }
        } else {
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '该用户不在该项目中'
            })
        }
    })
})

//KPI基本信息编辑
router.put('/', function (req, res) {
    var query = req.body,
        ID = query.ID,
        KPIName = query.KPIName,
        KPIType = query.KPIType,
        KPIScore = query.KPIScore,
        ProjectID = query.ProjectID,
        UserID = query.UserID,
        UserName = query.UserName,
        OperateUser = req.query.jitkey,
        Remark = query.Remark || '';

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
        'Remark': Remark,
        'IsActive': 1
    }

    //检查所需要的参数是否齐全
    var temp = ['ID', 'KPIName', 'KPIType', 'KPIScore', 'ProjectID', 'UserID', 'UserName',],
        err = 'required: ';
    for(var value in temp)
    {
        if(!(temp[value] in query))
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

    KPIservice.queryKPI({'ID':ID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        if(results !== undefined && results.length>0) {
            if (results[0].CheckStatus == '待审核') {
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
                        res.status(400);
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
                    status: 404,
                    isSuccess: false,
                    msg: '已审核的绩效不可编辑'
                })
            }
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

//KPI查询，用于个人查询
router.get('/:UserID', function (req, res) {
    var UserID = req.params.UserID,
        query = req.query,
        ProjectID = query.ProjectID || '',
        StartTime = query.StartTime || '',
        EndTime = query.EndTime || '',
        page = req.query.pageindex > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ProjectID': ProjectID,
        'UserID': UserID,
        'KPIStatus': '',
        'StartTime': StartTime,
        'EndTime': EndTime,
        'page': page,
        'pageNum': pageNum,
        'IsActive': 1
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
                if (results !== undefined && results.length > 0) {
                    for (var i in results) {
                        results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm:SS');
                        if(results[i].CheckTime !== null)
                            results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm:SS');
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

//KPI查询,此查询用于可审核绩效的角色进行查询
router.get('/', function (req, res) {
    var query = req.query,
        UserID = query.UserID || '',
        ProjectID = query.ProjectID || '',
        StartTime = query.StartTime || '',
        EndTime = query.EndTime || '',
        KPIStatus = query.KPIStatus || '',
        page = req.query.pageindex > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ProjectID': ProjectID,
        'UserID': UserID,
        'KPIStatus': KPIStatus,
        'StartTime': StartTime,
        'EndTime': EndTime,
        'page': page,
        'pageNum': pageNum,
        'IsActive': 1
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
                if (results !== undefined && results.length > 0) {
                    for (var i in results) {
                        results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm:SS');
                        if(results[i].CheckTime !== null)
                        results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm:SS');
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
        temp = ['ID', 'CheckUser', 'KPIStatus'],
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
    KPIservice.queryKPI()
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

//KPI删除
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

    KPIservice.updateKPI(data, function (err, results) {
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