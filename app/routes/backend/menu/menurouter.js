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
    var query = JSON.parse(req.query.f);
    var page = (req.query.pageindex || query.pageindex) ? (req.query.pageindex || query.pageindex) : 1,
        pageNum = (req.query.pagesize || query.pagesize) ? (req.query.pagesize || query.pagesize) : 20,
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
            console.log(data);
            menuService.queryAllMenusFormTreeIByRecursion(data, function (err, result) {
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
                        appCount : result.length,
                        data: result
                    };
                    if(resultBack.curPage == resultBack.totlePage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totlePage-1)*pageNum;
                    }
                    res.status(200);
                    return res.json(resultBack);
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相应菜单"
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "未查询到相应菜单"
            });
        }
    });

});

router.get('/plain',function (req,res) {
    var query = JSON.parse(req.query.f);
    var page = (req.query.pageindex || query.pageindex) ? (req.query.pageindex || query.pageindex) : 1,
        pageNum = (req.query.pagesize || query.pagesize) ? (req.query.pagesize || query.pagesize) : 20,
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
                        totalPage: Math.ceil(countNum/pageNum),
                        data: result
                    };
                    if(resultBack.curPage == resultBack.totlePage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totlePage-1)*pageNum;
                    }
                    res.status(200);
                    //console.log(resultBack);
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

});

router.get('/parent',function (req,res) {
    var query = JSON.parse(req.query.f);
    var page = (req.query.pageindex || query.pageindex) ? (req.query.pageindex || query.pageindex) : 1,
        pageNum = (req.query.pagesize || query.pagesize) ? (req.query.pagesize || query.pagesize) : 500,
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
                    if(resultBack.curPage == resultBack.totlePage) {
                        resultBack.curPageNum = resultBack.dataNum - (resultBack.totlePage-1)*pageNum;
                    }
                    res.status(200);
                    //console.log(resultBack);
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

});


//获得树形Menu结构
router.get('/',function (req,res) {

    var userID = req.query.jitkey;

    if (userID === undefined) {
        res.status(404);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: 'require userID'
        });

    }

    if(isNaN(userID)){
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: 'userID不是数字'
        });
    }
    var data = {
        "userID":userID
    };

    userService.querySingleID(userID,function (err,result) {
        if(err){
            res.status(500);
            return res.json({
                code : 500,
                isSuccess :false,
                msg : '服务器出错'
            });
        }
        if(result !== undefined && result.length != 0){
            menuService.queryAllMenusFormTree(data,function (err,results) {
                if(err){
                    res.status(500);
                    return res.json({
                        code : 500,
                        isSuccess : false,
                        msg : '服务器连接错误'
                    });
                }

                if(results !== undefined && results.length !== 0){
                    res.status(200);
                    return res.json({
                        code : 200,
                        isSuccess : true,
                        data : {
                            Menu : results
                        },
                        msg : '读取所有菜单成功！'
                    });
                }else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: '未查到相应菜单'
                    });
                }
            });
        }else{
            res.status(404);
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

router.put('/',function (req,res) {

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

    // 修改MenuID之前，先判断是否存在这个MenuID,MenuID不可以更改
    var JudgeData = {
        "MenuID" : menuID,
        "pageNum": 1,
        "page": 1
    }

    menuService.queryAllMenus(JudgeData,function (err,result) {
        if(err){
            res.status(500);
            return res.json({
                code : 500,
                isSuccess : false,
                updateResult: result,
                msg : '操作失败，服务器出错'
            });
        }
        // 所要修改的菜单存在
        if(result !== undefined && result.length !== 0){
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
        }else{
            // 所要修改的菜单不存在
            res.status(404);
            return res.json({
                code :404,
                isSuccess : false,
                updateResult:result,
                msg : '操作失败，所要修改的菜单不存在'
            });
        }
    });

});

//逻辑删除
router.delete('/',function(req,res) {
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
        "IsActive" : 0
    };
    var deleteData = {
        "MenuID" : menuID
    };
    //查询要删除的菜单是否存在
    menuService.countAllMenus(deleteData,function (err,result) {
        if(err){
            res.status(500);
            return res.json({
                code : 500,
                isSuccess : false,
                deleteResult:result,
                msg : '操作失败，服务器出错'
            });
        }
        //所要删除的菜单存在，执行删除操作
        if(result !== undefined && result.length !== 0){
            menuService.menuUpdate(data,function (err,results) {
                if(err){
                    res.status(500);
                    return res.json({
                        code :500,
                        isSuccess : false,
                        deleteResults: results,
                        msg : '操作失败，服务器出错'
                    });
                }

                //判断是否删除成功
                if(results !== undefined && results.affectedRows != 0){
                    res.status(200);
                    return res.json({
                        code : 200,
                        isSuccess : true,
                        deleteResult : results,
                        msg : '菜单删除操作成功'
                    });
                }else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "菜单删除操作失败"
                    });
                }
            });
        }else{
            // 所要删除的菜单不存在
            res.status(404);
            return res.json({
                code :404,
                isSuccess : false,
                deleteResult:result,
                msg : '操作失败，所要删除的菜单不存在'
            });
        }
    });
});


module.exports = router;