/**
 * @Author: Cecurio
 * @Date: 2016/11/26 20:57
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/26 20:57
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice'),
    userService = appRequire('service/backend/user/userservice'),
    usermenuService = appRequire('service/backend/menu/usermenuservice'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice');

/**
 * 菜单树形展示
 */
router.get('/tree',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuQuery.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }


        var query = JSON.parse(req.query.f?req.query.f:"{}");
        var page = (req.query.pageindex) ? (req.query.pageindex) : 1,
            pageNum = (req.query.pagesize) ? (req.query.pagesize) : config.pageCount,
            isPaging = (req.query.isPaging) ? (req.query.isPaging) : 1,
            applicationID = query.ApplicationID || '',
            menuID = query.MenuID || '',
            parentID = query.ParentID || '',
            menuLevel = query.MenuLevel || '',
            menuName = query.MenuName || '',
            isActive = query.IsActive || '';

        page = page>0 ? page : 1;

        if (pageNum == ''){
            pageNum = config.pageCount;
        }

        //用于查询结果总数的计数
        var countNum = -1;

        var data = {
            page : page,
            pageNum : pageNum,
            isPaging : isPaging,
            ApplicationID : applicationID || '',
            MenuID : menuID || '',
            ParentID : parentID || '',
            MenuLevel : menuLevel || '',
            MenuName : menuName || '',
            IsActive : isActive || ''
        };

        var intdata = {
            page : page,
            pageNum : pageNum,
            ApplicationID : applicationID,
            MenuID : menuID,
            ParentID : parentID,
            MenuLevel : menuLevel,
            IsActive : isActive
        };

        for (var key in intdata){
            if(isNaN(intdata[key]) && intdata[key] != ''){
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: key + ": " + intdata[key] + '不是数字'
                });
            }
        }

        menuService.countAllMenus(data, function (err, results) {
            if (err) {
                res.status(500);
                res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "查询失败，服务器内部错误"
                });
                return;
            }
            if (results == undefined || results.length == 0 || results.length == undefined || results[0]['num'] <= 0) {
                res.status(404);

                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应菜单!"
                });
            }

            countNum = results[0]['num'];

            //查询所需的详细数据
            menuService.queryAllMenusFormTreeInTable(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (result == undefined || result.length == 0 || results.length == undefined || countNum == -1) {
                    res.status(404);

                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应菜单!"
                    });
                }

                var resultBack = {
                    code: 200,
                    isSuccess: true,
                    msg: '查询成功',
                    dataNum: countNum,
                    curPage: page,
                    curPageNum:pageNum,
                    totalPage: Math.ceil(countNum/pageNum),
                    appCount : result.length,
                    data: result
                };

                if(resultBack.curPage == resultBack.totalPage) {
                    resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage-1)*pageNum;
                }

                res.status(200);
                return res.json(resultBack);
            });
        });
    });
});

/**
 * 菜单平面展示
 */
router.get('/plain',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuQuery.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult !== undefined && funcResult.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var query = JSON.parse(req.query.f ? req.query.f : "{}");

        var page = (req.query.pageindex != undefined) ? (req.query.pageindex) : 1,
            pageNum = (req.query.pagesize != undefined) ? (req.query.pagesize) : (config.pageCount),
            isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 0,
            applicationID = query.ApplicationID || '',
            menuID = query.MenuID || '',
            parentID = query.ParentID || '',
            menuLevel = query.MenuLevel || '',
            menuName = query.MenuName || '',
            isActive = query.IsActive || '';

        page = page>0 ? page : 1;

        if (pageNum == ''){
            pageNum = config.pageCount;
        }

        //用于查询结果总数的计数
        var countNum = -1;

        var data = {
            page : page,
            pageNum : pageNum,
            isPaging : isPaging,
            ApplicationID : applicationID,
            MenuID : menuID,
            ParentID : parentID,
            MenuLevel : menuLevel,
            MenuName : menuName,
            IsActive : isActive,
            OperateUserID : req.query.jitkey
        };

        var intdata = {
            page : page,
            pageNum : pageNum,
            ApplicationID : applicationID,
            MenuID : menuID,
            ParentID : parentID,
            MenuLevel : menuLevel,
            IsActive : isActive
        };

        for (var key in intdata){
            if(isNaN(intdata[key]) && intdata[key] != ''){
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: key + ": " + intdata[key] + '不是数字'
                });
            }
        }

        menuService.countAllMenus(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    code: 500,
                    isSuccess: false,
                    errorMsg: "查询失败，服务器内部错误!"
                });
            }
            if (results == undefined || results.length == 0 || results.length == undefined || results[0]['num'] <= 0) {
                res.status(404);

                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应菜单!"
                });
            }

            countNum = results[0]['num'];

            //查询所需的详细数据
            menuService.queryAllMenus(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (result == undefined || result.length == 0 || countNum == -1) {
                    res.status(400);

                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应菜单!"
                    });
                }

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
            });
        });
    });
});

router.get('/parent',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuQuery.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (results !== undefined && results.isSuccess === true) {
            var query = JSON.parse(req.query.f?req.query.f:"{}");
            var page = (req.query.pageindex || query.pageindex) ? (req.query.pageindex || query.pageindex) : 1,
                pageNum = (req.query.pagesize || query.pagesize) ? (req.query.pagesize || query.pagesize) : 500,
                isPaging = (req.query.isPaging) ? (req.query.isPaging) : 0,
                applicationID = query.ApplicationID || '',
                menuID = query.MenuID || '',
                parentID = query.ParentID || '',
                menuLevel = query.MenuLevel || '',
                menuName = query.MenuName || '',
                isActive = query.IsActive || '';

            page = page>0 ? page : 1;

            if (pageNum == ''){
                pageNum = config.pageCount;
            }

            if(isActive === undefined || isActive == ''){
                isActive = 1;
            }

            //用于查询结果总数的计数
            var countNum = 0;

            var data = {
                page : page,
                pageNum : pageNum,
                ApplicationID : applicationID,
                MenuID : menuID,
                ParentID : parentID,
                MenuLevel : menuLevel,
                MenuName : menuName,
                IsActive : isActive
            };

            var intdata = {
                page : page,
                pageNum : pageNum,
                ApplicationID : applicationID,
                MenuID : menuID,
                ParentID : parentID,
                MenuLevel : menuLevel,
                IsActive : isActive
            };

            for (var key in intdata){
                if(isNaN(intdata[key]) && intdata[key] != ''){
                    res.status(400);
                    return res.json({
                        code: 400,
                        isSuccess: false,
                        msg: key + ": " + intdata[key] + '不是数字'
                    });
                }
            }

            menuService.countAllMenus(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        errorMsg: "查询失败，服务器内部错误"
                    });
                }
                if (results !==undefined && results.length != 0) {
                    countNum = results[0]['num'];

                    //查询所需的详细数据
                    menuService.queryAllParentMenus(data, function (err, result) {
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
                            res.status(200);
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: "未查询到相应菜单"
                            });
                        }
                    });
                } else {
                    res.status(200);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应菜单"
                    });
                }
            });
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

//通过jitkey获得树形Menu结构
//完成检查 2017.2.25 单凯
router.get('/',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuQuery.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, funcResults) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResults != undefined && funcResults.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResults.msg
            });
        }

        var userID = req.query.jitkey;

        var data = {
            "userID":userID
        };

        if (userID === undefined || parseInt(userID) <= 0) {
            res.status(404);

            return res.json({
                code: 404,
                isSuccess: false,
                msg: '当前登录用户无效!'
            });
        }

        userService.querySingleID(userID,function (err,result) {
            if(err){
                res.status(500);
                return res.json({
                    code : 500,
                    isSuccess :false,
                    msg : '服务器出错'
                });
            }

            if(result == undefined || result.length == 0 || result.length == undefined){
                res.status(404);

                return res.json({
                    code : 404,
                    isSuccess :false,
                    msg : '用户不存在!'
                });
            }

            menuService.queryMenuTreeByUserID(data,function (err,results) {
                if(err){
                    res.status(500);
                    return res.json({
                        code : 500,
                        isSuccess : false,
                        msg : '服务器连接错误!'
                    });
                }

                if(results == undefined || results.length == 0 || results.length == undefined){
                    res.status(404);

                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: '未查到相应菜单!'
                    });
                }

                res.status(200);
                return res.json({
                    code : 200,
                    isSuccess : true,
                    data : {
                        Menu : results
                    },
                    msg : '读取所有菜单成功！'
                });
            });
        });
    });

});

//新增菜单
router.post('/',function(req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuAdd.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult !== undefined && funcResult.isSuccess)) {
            res.status(404);

            return res.json({
                code: 404,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        // 检查所需要的字段是否都存在
        var data = ['ApplicationID','MenuLevel','ParentID','SortIndex','MenuName','IconPath','Url','Memo','IsActive'];
        var err = 'require: ';

        for (var value in data){
            if(!(data[value] in req.body.formdata)){
                err += data[value] + ' ';
            }
        }

        //如果要求的字段不在req的参数中
        if(err !== 'require: ') {
            logger.writeError(err);
            res.status(400);
            return res.json({
                code:404,
                isSuccess: false,
                msg: '存在未填写的必填字段' + err
            });
        }

        var applicationID = req.body.formdata.ApplicationID;
        var menuLevel = req.body.formdata.MenuLevel;
        var parentID = req.body.formdata.ParentID;
        var sortIndex = req.body.formdata.SortIndex;
        var menuName = req.body.formdata.MenuName;
        var iconPath = req.body.formdata.IconPath;
        var url = req.body.formdata.Url;
        var memo = req.body.formdata.Memo;
        var isActive = req.body.formdata.IsActive;

        if(memo === undefined || memo === null){
            memo = '';
        }

        // 存放接收的数据
        var data = {
            "ApplicationID" : applicationID ,
            "MenuLevel" : menuLevel,
            "ParentID" : parentID,
            "SortIndex" : sortIndex,
            "MenuName" : menuName,
            "IconPath" : iconPath,
            "Url" :url,
            "Memo" : memo,
            "IsActive" : isActive,
            "jitkey" : req.query.jitkey
        };

        var intdata = {
            "ApplicationID" : applicationID,
            "MenuLevel" : menuLevel,
            "ParentID" : parentID,
            "SortIndex" : sortIndex,
            "IsActive" : isActive
        };

        for (var key in intdata){
            if(isNaN(intdata[key])){
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: key + ": " + intdata[key] + '不是数字'
                });
            }
        }

        var requiredvalue = '缺少输入参数：';
        for(var key in data){
            if(key != 'Memo'){
                if(data[key].length == 0){
                    requiredvalue += key + ' ';
                    logger.writeError(requiredvalue);
                    res.status(404);
                    return res.json({
                        code :404,
                        isSuccess : false,
                        msg : requiredvalue
                    });
                }
            }

        }

        if (menuLevel == 1 && parentID != 0){
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '1级菜单的父菜单必须为0'
            });
        }

        //执行插入操作
        menuService.menuInsert(data,function (err,result) {
            if(err){
                res.status(500);
                return res.json({
                    code : 500,
                    isSuccess : false,
                    addMenuResult:result,
                    msg : '菜单新增操作失败，服务器出错'
                });
            }


            if(result !== undefined && result.affectedRows != 0){
                res.status(200);
                return res.json({
                    code : 200,
                    isSuccess : true,
                    addMenuResult:result,
                    msg : '一条菜单记录添加成功'
                });
            }else {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "菜单添加操作失败"
                });
            }
        });
    });
});

/**
 * 禁用某些菜单，将IsActive置为0
 */
router.put('/forbid',function (req,res) {

    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuEdit.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(404);

            return res.json({
                code: 404,
                isSuccess: false,
                msg: results.msg
            });
        }

        if (req.body.formdata.MenuID == undefined) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: "菜单为空"
            });
        }

        if (isNaN(req.body.formdata.MenuID)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: "菜单ID不是数字"
            });
        }

        var MenuID = req.body.formdata.MenuID;
        var menuLevel = -1;
        var parentID = -1;
        menuService.queryAllMenus({"MenuID":MenuID,"isPaging":0},function (err,queryResult) {
            if (err){
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "查询失败，服务器内部错误"
                });
            }

            if (queryResult == undefined || queryResult.length == 0 || queryResult.length == undefined){
                res.status(404);

                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "菜单不存在"
                });
            }

            menuLevel = queryResult[0].MenuLevel;
            parentID = queryResult[0].ParentID;

            if (menuLevel != 1 && menuLevel != 2) {
                res.status(404);

                return res.json({
                    code: 404,
                    isSuccess: false,
                    MenuLevel : menuLevel,
                    msg: "菜单级别错误！"
                });
            }

            menuService.reuseMenu({"MenuID":MenuID,"IsActive":0},function (err,updateResult1) {
                if (err){
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (updateResult1 != undefined && updateResult1.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        MenuLevel : menuLevel,
                        msg: "菜单存在 菜单禁用成功"
                    });
                }else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        MenuLevel : menuLevel,
                        msg: "菜单存在 菜单禁用失败"
                    });
                }
            });
        });
    });
});

/**
 * 启用某些菜单，将IsActive置为1
 * 1、如果启动子菜单，也要启动父菜单
 * 2、如果启动父菜单，可不用启动子菜单
 */
router.put('/reuse',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuEdit.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        // 无此操作的功能点
        if (!(results != undefined && results.isSuccess)) {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: results.msg
            });
        }

        if (req.body.formdata.MenuID == undefined) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: "菜单为空"
            });
        }

        if (isNaN(req.body.formdata.MenuID)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: "菜单ID不是数字"
            });
        }

        var MenuID = req.body.formdata.MenuID;

        var menuLevel = -1;
        var parentID = -1;

        menuService.queryAllMenus({"MenuID":MenuID,"isPaging":0},function (err,queryResult) {
            if (err){
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "查询失败，服务器内部错误"
                });
            }

            if (queryResult == undefined || queryResult.length == 0){
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "菜单不存在"
                });
            }

            menuLevel = queryResult[0].MenuLevel;
            parentID = queryResult[0].ParentID;

            if (menuLevel != 1 && menuLevel != 2) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    MenuLevel : menuLevel,
                    msg: "菜单级别错误"
                });
            }

            if (menuLevel == 1){
                //如果启动父菜单，可不用启动子菜单
                menuService.reuseMenu({"MenuID":MenuID,"IsActive":1},function (err,updateResult1) {
                    if (err){
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: "查询失败，服务器内部错误"
                        });
                    }

                    if (updateResult1 != undefined && updateResult1.affectedRows != 0) {
                        res.status(200);
                        return res.json({
                            code: 200,
                            isSuccess: true,
                            MenuLevel : menuLevel,
                            msg: "菜单存在 菜单启用成功"
                        });
                    }else {
                        res.status(404);
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            MenuLevel : menuLevel,
                            msg: "菜单存在 菜单启用失败"
                        });
                    }

                });

            }

            if (menuLevel == 2){
                // 如果启动子菜单，也要启动父菜单
                var updateData = {
                    "MenuID": [MenuID,parentID],
                    "IsActive": 1
                };

                menuService.reuseMenu(updateData,function (err,updateResult2) {
                    if (err){
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: "查询失败，服务器内部错误"
                        });
                    }

                    if (updateResult2 != undefined && updateResult2.affectedRows != 0) {
                        res.status(200);
                        return res.json({
                            code: 200,
                            isSuccess: true,
                            MenuLevel : menuLevel,
                            msg: "菜单存在 菜单启用成功"
                        });
                    }else {
                        res.status(404);
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            MenuLevel : menuLevel,
                            msg: "菜单存在 菜单启用失败"
                        });
                    }
                });
            }
        });
    });
});

/**
 *菜单修改
 * 1、如果MenuID为a的IsActive将被修改为0，则需要将ParentID = a 的IsActive 要被置为0
 * 然后将usermenu表的MenuID = a 的记录的IsActive 置为0
 */
router.put('/',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuEdit.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(results != undefined && results.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        // 检查所需要的字段是否都存在
        var data = ['ApplicationID','MenuID','MenuLevel','ParentID','SortIndex','MenuName','IconPath','Url','Memo','IsActive'];
        var err = 'require: ';

        for (var value in data){
            if(!(data[value] in req.body.formdata)){
                err += data[value] + ' ';
            }
        }

        //如果要求的字段不在req的参数中
        if(err !== 'require: ') {
            logger.writeError(err);
            res.status(400);
            return res.json({
                code:400,
                isSuccess: false,
                errorMsg: '存在未填写的必填字段',
                msg: err
            });
        }

        //接收前台数据
        var menuID = req.body.formdata.MenuID;
        var applicationID = req.body.formdata.ApplicationID;
        var menuLevel = req.body.formdata.MenuLevel;
        var parentID = req.body.formdata.ParentID;
        var sortIndex = req.body.formdata.SortIndex;
        var menuName = req.body.formdata.MenuName;
        var iconPath = req.body.formdata.IconPath;
        var url = req.body.formdata.Url;
        var memo = req.body.formdata.Memo;
        var isActive = req.body.formdata.IsActive;

        var data = {
            "MenuID" : menuID,
            "ApplicationID" : applicationID,
            "MenuLevel" : menuLevel,
            "ParentID" : parentID,
            "SortIndex" : sortIndex,
            "MenuName" : menuName,
            "IconPath" : iconPath,
            "Url" : url,
            "Memo" : memo,
            "IsActive" : isActive,
            "OperateUserID" : req.query.jitkey
        };

        var intdata = {
            "MenuID" : menuID,
            "ApplicationID" : applicationID,
            "MenuLevel" : menuLevel,
            "ParentID" : parentID,
            "SortIndex" : sortIndex,
            "IsActive" : isActive
        };

        for (var key in intdata){
            if(isNaN(intdata[key])){
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: key + ": " + intdata[key] + '不是数字'
                });
            }
        }

        var requiredvalue = '缺少输入的修改参数：';
        for(var key in data){
            if(key != 'Memo'){
                if(data[key].length == 0){
                    requiredvalue += key + ' ';
                    logger.writeError(requiredvalue);
                    res.status(404);
                    return res.json({
                        code :404,
                        isSuccess : false,
                        msg : requiredvalue
                    });
                }
            }

        }

        // 如果菜单的IsActive要被修改为0，那么它和它的的子菜单将修改为0
        if (isActive == 0) {
            var cancelData = {
                "IsActive" : isActive,
                "MenuID" : menuID
            };

            // 判断要修改的菜单是否存在
            menuService.countAllMenus({"MenuID" : menuID}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误"
                    });
                }

                if (results == undefined || results.length == 0 || results[0]['num'] <= 0) {
                    res.status(404);
                    return res.json({
                        code :404,
                        isSuccess : false,
                        msg : '操作失败，所要修改的菜单不存在'
                    });
                }

                //菜单存在
                menuService.updateMenuIsActive(cancelData,function (err,result) {
                    if(err){
                        res.status(500);
                        return res.json({
                            code :500,
                            isSuccess : false,
                            msg : '操作失败，服务器出错'
                        });
                    }

                    if(result !== undefined && result.affectedRows != 0){
                        //修改菜单表成功
                        menuService.menuUpdate(data,function (err,menuResult) {
                            if(err){
                                res.status(500);
                                return res.json({
                                    code :500,
                                    isSuccess : false,
                                    msg : '操作失败，服务器出错'
                                });
                            }

                            if(menuResult !== undefined && menuResult.affectedRows != 0){
                                res.status(200);
                                return res.json({
                                    code : 200,
                                    isSuccess : true,
                                    updateResults : results,
                                    msg : '菜单修改操作成功'
                                });

                            }else {
                                res.status(404);
                                return res.json({
                                    code: 404,
                                    isSuccess: false,
                                    msg: "菜单修改操作失败"
                                });
                            }
                        });
                    }else {
                        res.status(404);
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            msg: "取消菜单失败"
                        });
                    }
                });
            });
        }

        if (isActive != 0){
            // 修改MenuID之前，先判断是否存在这个MenuID,MenuID不可以更改
            var JudgeData = {
                "MenuID" : menuID,
                "pageNum": 1,
                "page": 1
            };

            menuService.countAllMenus({"MenuID" : menuID}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        errorMsg: "查询失败，服务器内部错误"
                    });
                }

                if (results == undefined || results.length == 0 || results[0]['num'] <= 0) {
                    res.status(404);
                    return res.json({
                        code :404,
                        isSuccess : false,
                        msg : '操作失败，所要修改的菜单不存在'
                    });
                }
                //菜单存在
                menuService.menuUpdate(data,function (err,results) {
                    if(err){
                        res.status(500);
                        return res.json({
                            code :500,
                            isSuccess : false,
                            updateResults:results,
                            msg : '操作失败，服务器出错'
                        });
                    }

                    if(results !== undefined && results.affectedRows != 0){
                        res.status(200);
                        return res.json({
                            code : 200,
                            isSuccess : true,
                            updateResults : results,
                            msg : '菜单修改操作成功'
                        });

                    }else {
                        res.status(404);
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            msg: "菜单修改操作失败"
                        });
                    }
                });
            });
        }
    });
});

//逻辑删除
router.delete('/',function(req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuDel.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(results != undefined && results.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        //MenuID是主键，只需要此属性就可准确删除，不必传入其他参数
        var d = JSON.parse(req.query.d);
        var menuID = d.MenuID;

        if (menuID === undefined) {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: 'require menuID'
            });
        }

        if(isNaN(menuID)){
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: 'menuID不是数字'
            });
        }

        var data = {
            "MenuID" : menuID,
            "OperateUserID" : req.query.jitkey
        };

        var deleteData = {
            "MenuID" : menuID
        };

        // 判断要修改的菜单是否存在
        menuService.countAllMenus({"MenuID" : menuID}, function (err, results) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    errorMsg: "查询失败，服务器内部错误"
                });
            }

            if (results == undefined || results.length == 0 || results[0]['num'] <= 0) {
                res.status(404);
                return res.json({
                    code :404,
                    isSuccess : false,
                    msg : '操作失败，所要修改的菜单不存在'
                });
            }

            //菜单存在
            menuService.updateMenuIsActive(data,function (err,result) {
                if(err){
                    res.status(500);
                    return res.json({
                        code :500,
                        isSuccess : false,
                        msg : '操作失败，服务器出错'
                    });
                }

                if (result !== undefined && result.affectedRows != 0) {
                    //修改菜单表成功
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: "删除菜单成功"
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "删除菜单失败"
                    });
                }
            });
        });
    });
});

router.get('/allMenus',function (req,res) {
    var checkFuncData = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.memuManage.menuQuery.functionCode
    };

    userFuncService.checkUserFunc(checkFuncData, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(results != undefined && results.isSuccess)) {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: results.msg
            });
        }

        menuService.queryDistinctMenus(function (err, result) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "查询失败，服务器内部错误"
                });
            }

            if (result !== undefined && result.length != 0 && result.length != undefined) {
                var resultBack = {
                    code: 200,
                    isSuccess: true,
                    msg: '查询成功',
                    data: result
                };

                res.status(200);
                return res.json(resultBack);

            } else {
                res.status(400);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应菜单!"
                });
            }
        });
    });
});

module.exports = router;