/**
 * @Author: Cecurio
 * @Date: 2016/11/26 22:23
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/12 11:50
 * @Function:
 */

var express = require('express'),
    router = express.Router(),
    url = require('url'),
    logger=appRequire('util/loghelper').helper;

//菜单业务、用户业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice'),
    userService = appRequire('service/backend/user/userservice'),
    usermenuService = appRequire('service/backend/menu/usermenuservice');
var functionConfig = appRequire('config/functionconfig');
var userFuncService = appRequire('service/backend/user/userfuncservice');

//根据UserID获取用户的菜单和角色信息
router.get('/',function (req,res) {
    var userID = req.query.jitkey;
    if (userID === undefined || userID === '') {
        res.status(400)
        return res.json({
            code: 400,
            isSuccess: false,
            msg: 'require userID'
        });
    }
    if(isNaN(userID)){
        res.status(400)
        return res.json({
            code: 400,
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
            res.status(500)
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
                    res.status(500)
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

router.get('/userID/:userID',function (req,res) {
    var userID = req.params.userID;
    if (userID === undefined || userID === '') {
        res.status(400)
        return res.json({
            code: 404,
            isSuccess: false,
            msg: 'require userID'
        });
    }
    if(isNaN(userID)){
        res.status(400)
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
            res.status(500)
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
                    res.status(500)
                    return res.json({
                        code : 500,
                        isSuccess :false,
                        msg : '服务器出错'
                    });

                }
                if (results!==undefined) {
                    results.UserInfo = result;
                    results.UserInfo[0].UserID = result[0].AccountID;
                    if(results.Menu !== undefined && results.Menu.length != 0 ){
                        if(results.Role !== undefined &&  results.Role.length != 0){
                            return res.json({
                                code : 200,
                                isSuccess :true,
                                data : results,
                                msg : '查询菜单和角色成功'
                            });
                        }else {
                            return res.json({
                                code : 404,
                                isSuccess :false,
                                data: results,
                                msg : '未查到角色'
                            });
                        }
                    }else {
                        return res.json({
                            code : 404,
                            isSuccess :false,
                            data: results,
                            msg : '未查到菜单'
                        });
                    }
                } else {
                    result.UserInfo = result;
                    return res.json({
                        code : 404,
                        isSuccess :false,
                        data: result,
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

router.post('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.backendApp.userMenuManage.userMenuAdd.functionCode
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
            var userID = req.body.AccountID,
                menuData = req.body.data,
                data = ['AccountID', 'MenuID'],
                err = 'required: ';

            for(var value in data)
            {
                if (req.body.data.length>0) {
                    if((!(data[value] in req.body.data[0]))&&(!(data[value] in req.body)))
                    {
                        logger.writeError("require " + data[value]);
                        err += data[value] + ' ';
                    }
                }
            }

            if(err!='required: ')
            {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: err
                });
            };

            var menuID = [],
                i = 0;

            for (i=0;i<menuData.length;++i) {
                menuID[i] = menuData[i].MenuID;
            }

            data = {
                'MenuID' : menuID
            }
            if (i==0) {
                usermenuService.delUserMenu({userID: userID, isActive: 0}, function (err, results) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: "用户菜单增加操作失败，服务器出错"
                        })
                    }
                    if (results!==undefined) {
                        res.status(200);
                        return res.json({
                            code: 200,
                            isSuccess: true,
                            msg: "操作成功"
                        })
                    }
                })
            } else {
                //验证菜单是否都存在且有效
                menuService.queryMenuByID(data, function (err, results) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: "用户菜单增加操作失败，服务器出错"
                        })
                    }
                    var count = results[0]['count'];
                    if (results!==undefined && count == i) {
                        //数据相同可以添加菜单
                        data = {
                            'userID': userID,
                            'menuData': menuData
                        }
                        //先删除原来的用户菜单
                        usermenuService.delUserMenu({userID: userID, isActive: 0}, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    code: 500,
                                    isSuccess: false,
                                    msg: "用户菜单增加操作失败，服务器出错"
                                })
                            }
                            if (results!==undefined) {
                                //新增用户菜单
                                if (menuData.length>0) {
                                    usermenuService.addUserMenu(data, function (err, results) {
                                        if (err) {
                                            res.status(500);
                                            return res.json({
                                                code: 500,
                                                isSuccess: false,
                                                msg: "用户菜单增加操作失败，服务器出错"
                                            })
                                        }
                                        if (results !== undefined && results.insertId > 0) {
                                            res.status(200);
                                            return res.json({
                                                code: 200,
                                                isSuccess: true,
                                                msg: "操作成功"
                                            })
                                        } else {
                                            res.status(400);
                                            return res.json({
                                                code: 400,
                                                isSuccess: false,
                                                msg: "操作失败"
                                            })
                                        }
                                    })
                                } else {
                                    res.status(200);
                                    return res.json({
                                        code: 200,
                                        isSuccess: true,
                                        msg: "操作成功"
                                    })
                                }
                            }
                        })
                    } else {
                        res.status(400);
                        return res.json({
                            code: 400,
                            isSuccess: false,
                            msg: "用户菜单增加操作失败，菜单数据有误"
                        })
                    }
                })
            }
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