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
var moment = require('moment');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;


/**
 * KPI信息新增：
 *  所需要做的步骤
 *  1、验证绩效分用户userID是否属于项目projectID
 *  2、查询KPIName, KPIType是否在字典表里
 *  3、查询当前申请的projectID内是否已经有KPIType类型的绩效
 *  4、获取userID的用户名UserName
 *  5、数据获取并验证完毕后再存入KPI数据
 */
router.post('/', function (req, res) {
    var query = req.body.formdata,
        ProjectID = query.ProjectID,
        KPIType = query.KPIType,//字典表的ID
        KPIScore = query.KPIScore,
        OperateUser = req.query.jitkey,
        UserID = query.UserID,
        KPIName = query.KPIName,//字典表ID
        Remark = query.Remark || '',
        isTrue = false; //用于逻辑上的判断

    //检查所需要的参数是否齐全
    var temp = ['KPIName', 'KPIType', 'KPIScore', 'ProjectID', 'UserID'],
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
                msg: '操作失败，服务器出错'
            })
        }
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
                            msg: '操作失败，服务器出错'
                        })
                    }
                    if (results !== undefined && results.length == DicID.DictionaryID.length) {
                        KPIName = results[0].DictionaryValue;
                        KPIType = results[1].DictionaryValue;
                        //查询当前申请的projectID内是否已经有KPIType类型的绩效
                        query = {
                            'ProjectID': ProjectID,
                            'KPIType': KPIType,
                            'UserID': UserID,
                            'IsActive': 1
                        }
                        KPIservice.queryKPI(query, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                })
                            }
                            if (results !== undefined && results.length == 0) {
                                //获取userID的用户名UserName
                                userservice.querySingleID(UserID, function (err, results) {
                                    if (err) {
                                        res.status(500);
                                        return res.json({
                                            status: 500,
                                            isSuccess: false,
                                            msg: '操作失败，服务器出错'
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
                                        if (isNaN(data.KPIScore)) {
                                            res.status(400);
                                            return res.json({
                                                code: 400,
                                                isSuccess: false,
                                                msg: '绩效分不是正确的数值'
                                            });
                                        }
                                        if (data.Remark.length>45) {
                                            res.status(400);
                                            return res.json({
                                                code: 400,
                                                isSuccess: false,
                                                msg: '备注过长'
                                            });
                                        }
                                        KPIservice.addKPI(data, function (err, results) {
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
                                            msg: '操作失败，用户有误！'
                                        })
                                    }
                                })
                            } else {
                                res.status(400);
                                return res.json({
                                    status: 400,
                                    isSuccess: false,
                                    msg: '操作失败，当前项目，该用户已申请过此类型的绩效，不可重复申请'
                                })
                            }
                        })
                    } else {
                        res.status(400);
                        return res.json({
                            status: 404,
                            isSuccess: false,
                            msg: '操作失败，该绩效类型或名称无效'
                        })
                    }
                })
            } else {
                res.status(400);
                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '操作失败，该用户不在该项目中'
                })
            }
        } else {
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '操作失败，该用户不在该项目中'
            })
        }
    })
})

//KPI基本信息编辑
router.put('/', function (req, res) {
    var query = req.body.formdata,
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
    if (isNaN(data.KPIScore)) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '绩效分不是正确的数值'
        });
    }
    if (data.Remark.length>45) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '备注过长'
        });
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
                msg: '操作失败，服务器出错'
            })
        }
        if(results !== undefined && results.length>0) {
            if (results[0].KPIStatus == '待审核') {
                KPIservice.updateKPI(data, function (err, results) {
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
                    msg: '操作失败，已审核的绩效不可编辑'
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
router.get('/person', function (req, res) {
    var UserID = req.query.jitkey,
        query =  JSON.parse(req.query.f),
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
        'KPIStatus': KPIStatus.trim(),
        'StartTime': StartTime,
        'EndTime': EndTime,
        'page': page,
        'pageNum': pageNum,
    }
    KPIservice.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
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
                        msg: '操作失败，服务器出错'
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
                    //替换用户名
                    var ID = [];
                    for (var i=0;i<results.length;++i) {
                        if (results[i].CheckUser == null) continue;
                        if (i==0) ID[i] = results[i].UserID;
                        else {
                            var j = 0;
                            for (j=0;j<ID.length;++j) {
                                if (ID[j] == results[i].CheckUser) break;
                            }
                            if (j == ID.length) ID[j] = results[i].CheckUser;
                        }
                    }
                    userservice.queryAccountByID(ID, function (err, data) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        for (var i in results) {
                            for (var j in data) {
                                if (results[i].CheckUser == data[j].AccountID) {
                                    results[i].CheckUser = data[j].UserName;
                                    break;
                                }
                            }
                        }
                        res.status(200);
                        console.log(result)
                        return res.json(result);
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
    var query =  JSON.parse(req.query.f),
        ID = query.ID || '',
        UserID = query.UserID || '',
        ProjectID = query.ProjectID || '',
        StartTime = query.StartTime || '',
        EndTime = query.EndTime || '',
        KPIStatus = query.KPIStatus || '',
        KPIType =  query.KPIType || '',
        KPIName = query.KPIName || '',
        page = req.query.pageindex > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ID': ID,
        'ProjectID': ProjectID,
        'UserID': UserID,
        'KPIStatus': KPIStatus.trim(),
        'KPIType': KPIType,
        'KPIName': KPIName,
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
                msg: '操作失败，服务器出错'
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
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    for (var i in results) {
                        results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm');
                        if(results[i].CheckTime !== null)
                        results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm');
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
                    //替换用户名
                    var ID = [];
                    for (var i=0;i<results.length;++i) {
                        if (results[i].CheckUser == null) continue;
                        if (i==0) ID[i] = results[i].UserID;
                        else {
                            var j = 0;
                            for (j=0;j<ID.length;++j) {
                                if (ID[j] == results[i].CheckUser) break;
                            }
                            if (j == ID.length) ID[j] = results[i].CheckUser;
                        }
                    }
                    userservice.queryAccountByID(ID, function (err, data) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        for (var i in results) {
                            for (var j in data) {
                                if (results[i].CheckUser == data[j].AccountID) {
                                    results[i].CheckUser = data[j].UserName;
                                    break;
                                }
                            }
                        }
                        res.status(200);
                        return res.json(result);
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
    var data = req.body.formdata,
        temp = ['ID', 'KPIStatus'],
        err = 'require: ';
    for (var key in temp) {
        if (!(temp[key] in data)) {
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

    if(data.KPIStatus == '不通过' && (data.Memo === undefined || data.Memo.trim()==='')) {
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '操作失败，不通过的审核需填写备注信息'
        })
    }
    if(data.KPIStatus == '不通过') {
        data.Remark = data.Memo;
    }

    if (data.Remark.length>45) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '备注过长'
        });
    }

    data.CheckUser = req.query.jitkey;
    var ID = data.ID;

    //查看该绩效信息是否已经被审核
    KPIservice.queryKPI({ID:ID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results !== undefined && results.length>0) {
            if (results[0].KPIStatus == '待审核') {
                KPIservice.checkKPI(data, function (err, results) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        })
                    }
                    if (results !== undefined && results.affectedRows > 0) {
                        res.status(200);
                        return res.json({
                            status: 200,
                            isSuccess: true,
                            msg: '操作成功'
                        })
                    } else {
                        res.status(400);
                        return res.json({
                            status: 404,
                            isSuccess: false,
                            msg: '操作失败'
                        })
                    }
                })
            } else {
                res.status(400);
                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '当前绩效已审核！'
                })
            }
        } else {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '审核的绩效信息不存在'
            })
        }
    })
})

//KPI删除
router.delete('/', function (req, res) {
    var ID = JSON.parse(req.query.d).ID;
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
                msg: "操作失败，服务器出错"
            });
        }
        if(results !== undefined && results.affectedRows > 0) {
            res.status(200);
            res.json({
                status: 200,
                isSuccess: true,
                msg: "操作成功"
            })
        } else {
            res.status(400);
            res.json({
                status: 400,
                isSuccess: true,
                msg: "操作失败"
            })
        }
    })
})
module.exports = router;