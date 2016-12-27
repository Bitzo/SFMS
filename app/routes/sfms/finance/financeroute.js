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
var projectservice = appRequire('service/sfms/project/projectservice');
var dataservice = appRequire('service/backend/datadictionary/datadictionaryservice');
var userservice = appRequire('service/backend/user/userservice');
var config = appRequire('config/config');
var moment = require('moment');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

/**
 * 财务信息新增
 *  1. 验证申报财务的项目是否存在
 *  2. 查询fiType、inOutType、fiName是否在字典表中
 *  3. 获取userID的username
 *  4. 存入数据
 */
router.post('/', function (req, res) {
    var query = req.body.formdata,
        fiName = query.fiName,
        fiType = query.fiType,
        inOutType = query.inOutType,
        fiPrice = query.fiPrice,
        projectID = query.projectID,
        userID = query.userID,
        userName = query.userName,
        operateUser = req.query.jitkey,
        remark = query.remark,
        isActive = 1,
        //前端需要传输的数据
        temp = ['fiName', 'fiType', 'inOutType', 'fiPrice', 'projectID','userID','remark'],
        err = 'require: ';

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

    //验证申报财务的项目是否存在
    var data = {
        'ID': projectID
    }
    projectservice.queryProject(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results !== undefined && results.length > 0) {
            //查询fiType、inOutType、fiName是否在字典表中
            var DicID = {
                'DictionaryID': [fiType, inOutType, fiName]
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
                    fiType = results[0].DictionaryValue;
                    inOutType = results[1].DictionaryValue;
                    fiName = results[2].DictionaryValue;
                    //获取userid的username
                    userservice.querySingleID(userID, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            })
                        }
                        if (results !== undefined && results.length > 0) {
                            userName = results[0].UserName;
                            userservice.querySingleID(userID, function (err, results) {
                                if (err) {
                                    res.status(500);
                                    return res.json({
                                        status: 500,
                                        isSuccess: false,
                                        msg: '操作失败，服务器出错'
                                    })
                                }
                                if (results !== undefined && results.length > 0) {
                                    operateUser = results[0].UserName;
                                    //数据全部验证完毕后存入数据
                                    var data = {
                                        'FIName': fiName,
                                        'FIType': fiType,
                                        'InOutType': inOutType,
                                        'FIPrice': fiPrice,
                                        'projectID': projectID,
                                        'UserID': userID,
                                        'UserName': userName,
                                        'OperateUser': operateUser,
                                        'FIStatu': '待审核',
                                        'Remark': remark,
                                        'IsActive': isActive
                                    };
                                    financeService.addFinance(data, function (err, results) {
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
                                        msg: '操作失败，用户无效'
                                    })
                                }
                            })
                        } else {
                            res.status(400);
                            return res.json({
                                status: 404,
                                isSuccess: false,
                                msg: '操作失败，用户无效'
                            })
                        }
                    })
                } else {
                    res.status(400);
                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '操作失败，财务类型或财务名称有误'
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '项目信息有误'
            })
        }
    })
})

/**
 * 财务基本信息编辑
 * 1. 先验证所要编辑的财务信息是否已经被审核
 * 2. 检查项目ID是否有效
 * 3. 查询字典表，验证fiName,fiType,inOutType
 * 4. 查询用户ID 的 username
 * 5. 全部核实并查询完，存入数据
 */
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
    financeService.queryFinance({'ID':ID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            })
        }
        if (results !== undefined && results.length>0 && results[0].FIStatu == '待审核') {

            //验证申报财务的项目是否存在
            var data = {
                'ID': projectID
            }
            projectservice.queryProject(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    //查询fiType、inOutType、fiName是否在字典表中
                    var DicID = {
                        'DictionaryID': [fiType, inOutType, fiName]
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
                            fiType = results[0].DictionaryValue;
                            inOutType = results[1].DictionaryValue;
                            fiName = results[2].DictionaryValue;
                            //获取userid的username
                            userservice.querySingleID(userID, function (err, results) {
                                if (err) {
                                    res.status(500);
                                    return res.json({
                                        status: 500,
                                        isSuccess: false,
                                        msg: '操作失败，服务器出错'
                                    })
                                }
                                if (results !== undefined && results.length > 0) {
                                    userName = results[0].UserName;
                                    userservice.querySingleID(operateUser, function (err, results) {
                                        if (err) {
                                            res.status(500);
                                            return res.json({
                                                status: 500,
                                                isSuccess: false,
                                                msg: '操作失败，服务器出错'
                                            })
                                        }
                                        if (results !== undefined && results.length > 0) {
                                            operateUser = results[0].UserName;
                                            //数据全部验证完毕后存入数据
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
                                            financeService.updateFinance(data, function (err, results) {
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
                                                msg: '操作失败，用户无效'
                                            })
                                        }
                                    })
                                } else {
                                    res.status(400);
                                    return res.json({
                                        status: 404,
                                        isSuccess: false,
                                        msg: '操作失败，用户无效'
                                    })
                                }
                            })
                        } else {
                            res.status(400);
                            return res.json({
                                status: 404,
                                isSuccess: false,
                                msg: '操作失败，财务类型或财务名称有误'
                            })
                        }
                    })
                } else {
                    res.status(400);
                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '操作失败，项目信息有误'
                    })
                }
            })
        } else {
            res.status(400);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '操作失败，项目已审核或无效，不可编辑'
            })
        }
    })
})

//财务信息查询
router.get('/', function (req, res) {
    var query = JSON.parse(req.query.f),
        startTime = query.startTime || '',
        endTime = query.endTime || '',
        fiType = query.fiType || '',
        inOutType = query.inOutType || '',
        projectID = query.projectID || '',
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
    if (moment(data.startTime).isValid())
        data.startTime = moment(data.startTime).format("YYYY-MM-DD HH:mm:ss");
    if (moment(data.endTime).isValid())
        data.endTime = moment(data.endTime).format("YYYY-MM-DD HH:mm:ss");

    financeService.countQuery(data, function (err, results) {
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
            financeService.queryFinance(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
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

//财务审核
router.put('/check', function (req, res) {
    var data = req.body.formdata,
        temp = ['ID', 'FIStatu'],
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

    var ID = [];
    for (var i in data) {
        if(data[i].FIStatu == '不通过' && (data[i].Remark === undefined || data[i].Remark.trim()=='')) {
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败，不通过的审核需填写备注信息'
            })
        }
        data[i].CheckUser = req.query.jitkey;
        ID[i] = data[i].ID;
    }
    //查看该财务信息是否已经被审核
    financeService.queryFinanceForCheck(ID, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: results
            })
        }
        if (results !== undefined && results === true) {
            //所有结果均为未审核状态
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
                msg: results
            })
        }
    })
})

//财务删除
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

    financeService.updateFinance(data, function (err, results) {
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