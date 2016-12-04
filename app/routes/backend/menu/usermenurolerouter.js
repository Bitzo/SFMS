/**
 * @Author: Cecurio
 * @Date: 2016/11/26 22:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/26 22:23
 * @Function:
 */

var express = require('express'),
    router = express.Router(),
    url = require('url');

//菜单业务、用户业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice'),
    userService = appRequire('service/backend/user/userservice');

//根据UserID获取用户的菜单和角色信息
router.get('/:userID',function (req,res) {
    var userID = req.params.userID;
    if (userID === undefined || userID === '') {
        return res.json({
            code: 404,
            isSuccess: false,
            msg: 'require userID'
        });
    }
    if(isNaN(userID)){
        return res.json({
            code: 500,
            isSuccess: false,
            msg: 'userID不是数字'
        });
    }
    var uniqueData = {
        "userID" : userID
    };

    //判断user是否存在
    userService.querySingleID(userID,function (err,result) {
        if(err){
            return res.json({
                code : 500,
                isSuccess :false,
                msg : '服务器出错'
            });
        }
        //user存在，则可以进行查询
        if(result !== undefined && result.length != 0){
            menuService.queryMenuAndRoleByUserID(uniqueData,function (err, results) {
                if(err){
                    return res.json({
                        code : 500,
                        isSuccess :false,
                        msg : '服务器出错'
                    });

                }

                if(results.Menu !== undefined && results.Menu.length != 0 ){
                    if(results.Role !== undefined &&  results.Role.length != 0){
                        return res.json({
                            code : 200,
                            isSuccess :true,
                            data : {
                                MenuAndRole : results
                            },
                            msg : '查询菜单和角色成功'
                        });
                    }else {
                        return res.json({
                            code : 404,
                            isSuccess :false,
                            msg : '未查到角色'
                        });
                    }

                }else {
                    return res.json({
                        code : 404,
                        isSuccess :false,
                        msg : '未查到菜单'
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



module.exports = router;