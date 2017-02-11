/**
 * @Author: bitzo
 * @Date: 2017/1/16 16:50
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/16 16:50
 * @Function:
 */

var express = require('express');
var router = express.Router();
var config = appRequire('config/config');
var operationService = appRequire('service/backend/log/logservice');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;
var moment = require('moment');
var userservice = appRequire('service/backend/user/userservice');
var functionConfig = appRequire('config/functionconfig');
var userFuncService = appRequire('service/backend/user/userfuncservice');

//日志查询
router.get('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.operationManage.operationQuery.functionCode
    };
    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (results !== undefined && results.isSuccess === true) {
            var query = JSON.parse(req.query.f),
                applicationID = query.ApplicationID || '',
                type = query.Type || '',
                createTime = query.CreateTime || '',
                createUserID = query.CreateUserID || '',
                sort = query.sortindex || 'ID',
                sortDirection = query.sortDirection || 'asc',
                totalNum = 0,
                page = req.query.pageindex || 1,
                pagesize = req.query.pagesize || config.pageCount;
            page = page > 0? page : 1;

            if (moment(createTime).isValid())
                createTime = moment(createTime).format("YYYY-MM-DD");

            data = {
                'ApplicationID': applicationID,
                'Type': type,
                'CreateTime': createTime,
                'CreateUserID': createUserID,
                'sort': sort,
                'sortDirection': sortDirection,
                'page': page,
                'pageNum': pagesize
            };

            operationService.countQuery(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错1'
                    })
                }
                totalNum = results[0].num;
                if(totalNum > 0) {
                    operationService.queryLog(data, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错2'
                            })
                        }
                        if (results !== undefined && results.length > 0) {
                            //格式化数据
                            for(var i in results) {
                                results[i].CreateTime = moment(results[i].CreateTime).format("YYYY-MM-DD HH:mm:ss");
                                results[i].PDate = moment(results[i].PDate).format("YYYY-MM-DD");
                            }
                            //填充用户名
                            var ID = [];
                            for (var i=0;i<results.length;++i) {
                                if (results[i].CreateUserID == null) continue;
                                if (i==0) {
                                    ID[i] = results[i].CreateUserID;
                                }
                                else {
                                    var j = 0;
                                    for (j=0;j<ID.length;++j) {
                                        if (ID[j] == results[i].CreateUserID) break;
                                    }
                                    if (j == ID.length) ID[j] = results[i].CreateUserID;
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
                                        if (results[i].CreateUserID == data[j].AccountID) {
                                            results[i].CreateUserName = data[j].UserName;
                                            break;
                                        }
                                    }
                                }
                                var result = {
                                    status: 200,
                                    isSuccess: true,
                                    dataNum: totalNum,
                                    curPage: page,
                                    totalPage: Math.ceil(totalNum/pagesize),
                                    curPageNum: pagesize,
                                    data: results
                                };
                                if(result.curPage == result.totalPage) {
                                    result.curNum = result.totalNum - (result.totalPage-1)*pagesize;
                                }
                                res.status(200);
                                return res.json(result)
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
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    });
});

module.exports = router;