/**
 * @Author: Cecurio
 * @Date: 2016/11/19 22:44
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/19 22:44
 * @Function:删除菜单
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');

router.delete('/',function(req,res,next) {
    //MenuID是主键，只需要此属性就可准确删除，不必传入其他参数
    var menuID = req.body.MenuID;

    if (menuID === undefined) {
        res.json({
            code: 404,
            isSuccess: false,
            msg: 'require menuID'
        })
        return;
    }

    var data = {
        "MenuID" : menuID
    };

    //查询要删除的菜单是否存在
    menuService.queryAllMenus(data,function (err,result) {
        if(err){
            res.json({
                code : 500,
                isSuccess : false,
                deleteResult:result,
                msg : '查询失败，服务器出错'
            });
            return ;
        }
        //所要删除的菜单存在，执行删除操作
        if(result !== undefined && result.length !== 0){
            menuService.menuDelete(data,function (err,results) {
                if(err){
                    res.json({
                        code :500,
                        isSuccess : false,
                        deleteResults: results,
                        msg : '修改删除失败'
                    });
                    return ;
                }

                //判断是否删除成功
                if(results !== undefined && results.affectedRows === 1){
                    res.json({
                        code : 200,
                        isSuccess : true,
                        deleteResult : results,
                        msg : '菜单删除成功'
                    });
                }
            });
        }else{
            // 所要删除的菜单不存在
            res.json({
                code :404,
                isSuccess : false,
                deleteResult:result,
                msg : '所要删除的菜单不存在'
            });
        }
    });
});

module.exports = router;