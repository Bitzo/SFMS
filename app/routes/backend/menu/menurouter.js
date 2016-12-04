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
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config');

router.get('/tree',function (req,res) {
    var page = req.query.page || 1,
        pageNum = req.query.pageNum;

    page = page>0 ? page : 1;

    if (pageNum === undefined){
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    var data = {
        'page': page,
        'pageNum': pageNum
    };

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
        if (results !==undefined && results.length != 0) {
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

                if (result !== undefined && result.length != 0 && countNum != -1) {
                    var resultBack = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:pageNum,
                        totlePage: Math.ceil(countNum/pageNum),
                        data: result
                    };
                    if(resultBack.curPage == resultBack.totlePage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totlePage-1)*pageNum;
                    }
                    //res.status(404);
                    return res.json(resultBack);
                } else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相关信息"
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
        }
    });

});

router.get('/plain',function (req,res) {
    var page = req.query.page || 1,
        pageNum = req.query.pageNum;

    page = page>0 ? page : 1;

    if (pageNum === undefined){
        pageNum = config.pageCount;
    }

    //用于查询结果总数的计数
    var countNum = 0;

    var data = {
        'page': page,
        'pageNum': pageNum
    };

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
        if (results !==undefined && results.length != 0) {
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

                if (result !== undefined && result.length != 0 && countNum != -1) {
                    var resultBack = {
                        code: 200,
                        isSuccess: true,
                        msg: '查询成功',
                        dataNum: countNum,
                        curPage: page,
                        curPageNum:pageNum,
                        totlePage: Math.ceil(countNum/pageNum),
                        data: result
                    };
                    if(resultBack.curPage == resultBack.totlePage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totlePage-1)*pageNum;
                    }
                    //res.status(404);
                    return res.json(resultBack);
                } else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相关信息"
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
        }
    });

});

//获得树形Menu结构
router.get('/:userID',function (req,res) {

    var userID = req.params.userID;

    if (userID === undefined) {
        return res.json({
            code: 500,
            isSuccess: false,
            msg: 'require userID'
        });

    }

    if(isNaN(userID)){
        return res.json({
            code: 404,
            isSuccess: false,
            msg: 'userID不是数字'
        });
    }
    var data = {
        "userID":userID
    };

    userService.querySingleID(userID,function (err,result) {
        if(err){
            return res.json({
                code : 500,
                isSuccess :false,
                msg : '服务器出错'
            });
        }
        if(result !== undefined && result.length != 0){
            menuService.queryAllMenusFormTree(data,function (err,results) {
                if(err){
                    return res.json({
                        code : 500,
                        isSuccess : false,
                        msg : '服务器连接错误'
                    });
                }

                if(results !== undefined && results.length !== 0){
                    return res.json({
                        code : 200,
                        isSuccess : true,
                        data : {
                            Menu : results
                        },
                        msg : '读取所有菜单成功！'
                    });
                }else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: '未查到相应菜单'
                    });
                }
            });
        }else{
            return res.json({
                code : 404,
                isSuccess :false,
                msg : '用户不存在'
            });
        }
    });
});

//新增菜单
router.post('/',function(req,res,next) {

    // 检查所需要的字段是否都存在
    var data = ['ApplicationID','MenuLevel','ParentID','SortIndex','MenuName','IconPath','Url','Memo','IsActive'];
    var err = 'require: ';
    for (var value in data){
        if(!(data[value] in req.body)){
            err += data[value] + ' ';
        }
    }
    //如果要求的字段不在req的参数中
    if(err !== 'require: ') {
        logger.writeError(err);
        return res.json({
            code:400,
            isSuccess: false,
            msg: '存在未填写的必填字段',
            errorMsg: err
        });


    }

    var applicationID = req.body.ApplicationID;
    var menuLevel = req.body.MenuLevel;
    var parentID = req.body.ParentID;
    var sortIndex = req.body.SortIndex;
    var menuName = req.body.MenuName;
    var iconPath = req.body.IconPath;
    var url = req.body.Url;
    var memo = req.body.Memo;
    var isActive = req.body.IsActive;

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
        "IsActive" : isActive
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
            return res.json({
                code: 500,
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
                return res.json({
                    code :300,
                    isSuccess : false,
                    errMsg : requiredvalue
                });
            }
        }

    }

    //执行插入操作
    menuService.menuInsert(data,function (err,result) {
        if(err){
            return res.json({
                code : 500,
                isSuccess : false,
                addMenuResult:result,
                msg : '菜单新增失败，服务器出错'
            });
        }


        if(result !== undefined && result.affectedRows != 0){
            return res.json({
                code : 200,
                isSuccess : true,
                addMenuResult:result,
                msg : '一条菜单记录添加成功'
            });
        }else {
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "菜单添加失败"
            });
        }
    });

});

router.put('/',function (req,res) {

    // 检查所需要的字段是否都存在
    var data = ['ApplicationID','MenuID','MenuLevel','ParentID','SortIndex','MenuName','IconPath','Url','Memo','IsActive'];
    var err = 'require: ';
    for (var value in data){
        if(!(data[value] in req.body)){
            err += data[value] + ' ';
        }
    }
    //如果要求的字段不在req的参数中
    if(err !== 'require: ') {
        logger.writeError(err);
        return res.json({
            code:400,
            isSuccess: false,
            msg: '存在未填写的必填字段',
            errorMsg: err
        });
    }

    //接收前台数据
    var menuID = req.body.MenuID;
    var applicationID = req.body.ApplicationID;
    var menuLevel = req.body.MenuLevel;
    var parentID = req.body.ParentID;
    var sortIndex = req.body.SortIndex;
    var menuName = req.body.MenuName;
    var iconPath = req.body.IconPath;
    var url = req.body.Url;
    var memo = req.body.Memo;
    var isActive = req.body.IsActive;
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
        "IsActive" : isActive
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
            return res.json({
                code: 500,
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
                return res.json({
                    code :300,
                    isSuccess : false,
                    errMsg : requiredvalue
                });
            }
        }

    }

    // 修改MenuID之前，先判断是否存在这个MenuID,MenuID不可以更改
    var JudgeData = {
        "MenuID" : menuID
    }

    menuService.queryAllMenus(JudgeData,function (err,result) {
        if(err){
            return res.json({
                code : 500,
                isSuccess : false,
                updateResult: result,
                msg : '查询失败，服务器出错'
            });
        }
        // 所要修改的菜单存在
        if(result !== undefined && result.length !== 0){
            menuService.menuUpdate(data,function (err,results) {
                if(err){
                    return res.json({
                        code :500,
                        isSuccess : false,
                        updateResults:results,
                        msg : '修改菜单失败'
                    });
                }


                if(results !== undefined && results.affectedRows != 0){
                    return res.json({
                        code : 200,
                        isSuccess : true,
                        updateResults : results,
                        msg : '菜单修改成功'
                    });

                }else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "菜单修改失败"
                    });
                }
            });
        }else{
            // 所要修改的菜单不存在
            return res.json({
                code :404,
                isSuccess : false,
                updateResult:result,
                msg : '所要修改的菜单不存在'
            });
        }
    });

});

router.delete('/',function(req,res,next) {
    //MenuID是主键，只需要此属性就可准确删除，不必传入其他参数
    var menuID = req.body.MenuID;

    if (menuID === undefined) {
        return res.json({
            code: 404,
            isSuccess: false,
            msg: 'require menuID'
        });
    }
    if(isNaN(menuID)){
        return res.json({
            code: 500,
            isSuccess: false,
            msg: 'menuID不是数字'
        });
    }
    var data = {
        "MenuID" : menuID
    };

    //查询要删除的菜单是否存在
    menuService.queryAllMenus(data,function (err,result) {
        if(err){
            return res.json({
                code : 500,
                isSuccess : false,
                deleteResult:result,
                msg : '查询失败，服务器出错'
            });
        }
        //所要删除的菜单存在，执行删除操作
        if(result !== undefined && result.length !== 0){
            menuService.menuDelete(data,function (err,results) {
                if(err){
                    return res.json({
                        code :500,
                        isSuccess : false,
                        deleteResults: results,
                        msg : '菜单删除失败'
                    });
                }

                //判断是否删除成功
                if(results !== undefined && results.affectedRows != 0){
                    return res.json({
                        code : 200,
                        isSuccess : true,
                        deleteResult : results,
                        msg : '菜单删除成功'
                    });
                }else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "菜单删除失败"
                    });
                }
            });
        }else{
            // 所要删除的菜单不存在
            return res.json({
                code :404,
                isSuccess : false,
                deleteResult:result,
                msg : '所要删除的菜单不存在'
            });
        }
    });
});


module.exports = router;