/**
 * @Author: Cecurio
 * @Date: 2016/11/15 14:38
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/15 14:38
 * @Function:修改MenuID对应元祖的信息
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');

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
        res.json({
            code:400,
            isSuccess: false,
            msg: '存在未填写的必填字段',
            errorMsg: err
        });
        return ;
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


    var requiredvalue = '缺少输入的修改参数：';
    for(var key in data){
        if(data[key].length == 0){
            requiredvalue += key + ' ';
            res.json({
                code :300,
                isSuccess : false,
                errMsg : requiredvalue
            })
        }
    }

    // 修改MenuID之前，先判断是否存在这个MenuID,MenuID不可以更改
    var JudgeData = {
        "MenuID" : menuID
    }

    menuService.queryAllMenus(JudgeData,function (err,result) {
        if(err){
            res.json({
                code : 500,
                isSuccess : false,
                updateResult: result,
                msg : '查询失败，服务器出错'
            });
            return ;
        }
        // 所要修改的菜单存在
        if(result !== undefined && result.length !== 0){
            menuService.menuUpdate(data,function (err,results) {
                if(err){
                    res.json({
                        code :500,
                        isSuccess : false,
                        updateResults:results,
                        msg : '修改菜单失败'
                    });
                    return ;
                }


                if(results !== undefined && results.affectedRows === 1){
                    res.json({
                        code : 200,
                        isSuccess : true,
                        updateResults : results,
                        msg : '菜单修改成功'
                    });
                }
            });
        }else{
            // 所要修改的菜单不存在
            res.json({
                code :404,
                isSuccess : false,
                updateResult:result,
                msg : '所要修改的菜单不存在'
            });
        }
    });

});


module.exports = router;
