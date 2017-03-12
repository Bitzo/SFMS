/**
 * @Author: Cecurio
 * @Date: 2017/3/9 17:24
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/3/9 17:24
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url'),
    config = appRequire('config/config');

//菜单业务逻辑组件
var datadictionaryService = appRequire('service/backend/datadictionary/datadictionaryservice'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config');

//查看字典
router.get('/plain',function (req,res) {
    var query = JSON.parse(req.query.f);

    var page = req.query.pageindex || query.pageindex || 1,
        pageNum = req.query.pagesize || query.pagesize || 20,
        applicationID = query.ApplicationID || '',
        dictionaryID = query.DictionaryID || '',
        dictionaryLevel = query.DictionaryLevel || '',
        parentID = query.ParentID || '',
        category = query.Category || '',
        dictionaryCode = query.DictionaryCode || '',
        dictionaryValue = query.DictionaryValue || '',
        isActive = query.IsActive || '',
        isPaging = req.query.isPaging || 1;  //是否分页

    page = page>0 ? page : 1;

    if (pageNum == undefined) {
        pageNum = config.pageCount;
    }

    if(isActive == undefined || isActive == ''){
        isActive = 1;
    }

    var data = {
        "page": page,
        "pageNum": pageNum,
        "ApplicationID" : applicationID,
        "DictionaryID" : dictionaryID,
        "DictionaryLevel" : dictionaryLevel,
        "ParentID" : parentID,
        "Category" : category,
        "DictionaryCode" : dictionaryCode,
        "DictionaryValue" : dictionaryValue,
        "IsActive" : isActive,
        "isPaging" : isPaging
    };

    //用于查询结果总数的计数
    var countNum = 0;

    //查询所有数据总数
    datadictionaryService.countAllDataDicts(data, function (err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: "服务器内部错误！"
            });
        }

        if (results == undefined || results.length == 0 || results[0]['num'] <= 0) {
            res.status(404);

            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相关字典信息！"
            });
        }

        countNum = results[0]['num'];

        datadictionaryService.queryDatadictionary(data, function (err, result) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "服务器内部错误！"
                });
            }

            if ((result instanceof Array) && result != undefined && result.length) {

                var resultBack = {
                    code: 200,
                    isSuccess: true,
                    msg: '查询成功！',
                    dataNum: countNum,
                    curPage: page,
                    curPageNum:pageNum,
                    totalPage: Math.ceil(countNum/pageNum),
                    data: result
                };

                if(resultBack.curPage == resultBack.totalPage) {
                    resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage-1)*pageNum;
                }

                res.status(200);
                return res.json(resultBack);
            } else {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相关字典信息！"
                });
            }
        });
    });
});

//查看字典
router.get('/tree',function (req,res) {
    var query = JSON.parse(req.query.f);

    var page = query.pageindex || 1,
        pageNum = query.pagesize || (config.pageCount),
        applicationID = query.ApplicationID || '',
        dictionaryID = query.DictionaryID || '',
        dictionaryLevel = query.DictionaryLevel || '',
        parentID = query.ParentID || '',
        category = query.Category || '',
        dictionaryCode = query.DictionaryCode || '',
        dictionaryValue = query.DictionaryValue || '',
        isActive = query.IsActive || '';

    page = page>0 ? page : 1;

    if(isActive === undefined || isActive == ''){
        isActive = 1;
    }

    var data = {
        "page": page,
        "pageNum": pageNum,
        "ApplicationID" : applicationID,
        "DictionaryID" : dictionaryID,
        "DictionaryLevel" : dictionaryLevel,
        "ParentID" : parentID,
        "Category" : category,
        "DictionaryCode" : dictionaryCode,
        "DictionaryValue" : dictionaryValue,
        "IsActive" : isActive
    };

    //用于查询结果总数的计数
    var countNum = 0;

    //查询所有数据总数
    datadictionaryService.countAllDataDicts(data, function (err, results) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: "查询失败，服务器内部错误"
            });
            return;
        }
        if (results !== undefined && results.length != 0) {
            countNum = results[0]['num'];

            //查询所需的详细数据
            datadictionaryService.queryDatadictionaryFormTree(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (result !== undefined && result.length != 0 && countNum != -1) {
                    var resultBack = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:pageNum,
                        totalPage: Math.ceil(countNum/pageNum),
                        data: result
                    };

                    if(resultBack.curPage == resultBack.totalPage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage-1)*pageNum;
                    }

                    res.status(200);
                    return res.json(resultBack);
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        result : result,
                        msg: "未查询到相关字典信息"
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相关字典信息"
            });
        }
    });
});

module.exports = router;