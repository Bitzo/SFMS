/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:53
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/14 18:53
 * @Function:queryAllMenus()查询所有的菜单，菜单新增，菜单修改，菜单删除
 */
var menuDAl = appRequire('dal/backend/menu/menudal'),
    getTreeMenu = appRequire('service/backend/menu/gettreemenu'),
    logger = appRequire('util/loghelper').helper,
    logModel = appRequire('model/jinkebro/log/logmodel'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    moment = require('moment');

logModel.ApplicationID = operationConfig.backendApp.applicationID;
logModel.ApplicationName = operationConfig.backendApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

/**
 * 树形展示某一用户（userID）菜单
 * @param data
 * @param callback
 */
exports.queryMenuTreeByUserID = function(data, callback){
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.backendApp.applicationID;
    logModel.ApplicationName = operationConfig.backendApp.applicationName;
    logModel.OperationName = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.identifier;
    menuDAl.queryMenuByUserID(data,function (err,results) {
        if(err){
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = data.userID || 0;  //0代表系统管理员操作
            logModel.Memo = "通过jitkey查询菜单失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("通过jitkey查询菜单失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });

            callback(true,'通过jitkey查询菜单失败');
            return ;
        }
        //形成菜单树形结构
        var tree = [];
        var k;
        for(var i=0;i<results.length;i++){
            var arr = [];
            for(var j=0;j<results.length;j++){
                if(results[i].MenuID == results[j].ParentID){
                    k = i;
                    results[i].children = [];
                    arr.push(results[j]);
                }
            }
            if(k == i){
                results[i].children = arr;
            }
            if(results[i].MenuLevel == 1){
                tree.push(results[i]);
            }
        }

        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = data.userID || 0; //0代表系统管理员操作
        logModel.Memo = "通过jitkey查询菜单成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("通过jitkey查询菜单成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('通过jitkey查询菜单成功');

        console.log('queryAllMenusFormTree func in service');
        logger.writeInfo('queryAllMenusFormTree func in service');
        //返回菜单树形JSON
        callback(false,tree);
    });
};

/**
 * 展示所有菜单
 * @param data
 * @param callback
 */
exports.queryAllMenusFormTreeInTable = function(data, callback){
    //要写入operationlog表的
    logModel.ApplicationID = operationConfig.backendApp.applicationID;
    logModel.ApplicationName = operationConfig.backendApp.applicationName;
    logModel.OperationName = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.identifier;
    //接收的data数据形式如下：
    // {
    //     page: 1,
    //     pageNum: 20,
    //     ApplicationID: '',
    //     MenuID: '',
    //     ParentID: '',
    //     MenuLevel: '',
    //     MenuName: '',
    //     IsActive: ''
    // }
    console.log('树形展示所有菜单');
    console.log(data);
    var formdata = {
        pageManage : {
            page: data.page,
            pageNum: data.pageNum,
            isPaging : 0
        },
        MenuManage : {
            ApplicationID: '',
            MenuID: '',
            ParentID: '',
            MenuLevel: '',
            MenuName: '',
            IsActive: ''
        }
    };

    menuDAl.queryAllMenus(formdata,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        //形成菜单树形结构
        var tree = [];
        var k;
        for(var i=0;i<results.length;i++){
            var arr = [];
            for(var j=0;j<results.length;j++){
                if(results[i].MenuID == results[j].ParentID){
                    k = i;
                    results[i].children = [];
                    arr.push(results[j]);
                }
            }
            if(k == i){
                results[i].children = arr;
            }
            if(results[i].MenuLevel == 1){
                tree.push(results[i]);
            }
        }

        console.log('queryAllMenusFormTreeInTable func in service');
        logger.writeInfo('queryAllMenusFormTreeInTable func in service');
        //返回菜单树形JSON
        callback(false,tree);
    });
};

/**
 * 通过递归形成菜单树
 * @param data
 * @param callback
 */
exports.queryAllMenusFormTreeIByRecursion  = function(data, callback){
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.identifier;
    menuDAl.queryAllMenus(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        results = getTreeMenu.getTreeMenu(data,0);

        console.log('queryAllMenusFormTreeIByRecursion func in service');
        logger.writeInfo('queryAllMenusFormTreeIByRecursion func in service');
        //返回菜单树形JSON
        callback(false,results);
    });
};

/**
 * 查询对应菜单个数
 * @param data
 * @param callback
 */
exports.countAllMenus = function (data, callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.identifier;
    menuDAl.countAllMenus(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('countAllMenus');
        callback(false, results);
    });
}

/**
 * 查询所有菜单，平面展示
 * @param data
 * @param callback
 */
exports.queryAllMenus = function(data, callback){
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.identifier;

    var formdata = {
        pageManage : {
            page: data.page,
            pageNum: data.pageNum,
            isPaging : 1
        },
        MenuManage : {
            ApplicationID: '',
            MenuID: '',
            ParentID: '',
            MenuLevel: '',
            MenuName: '',
            IsActive: ''
        }
    };

    menuDAl.queryAllMenus(formdata,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('queryAllMenus func in service');
        logger.writeInfo('queryAllMenus func in service');
        callback(false,results);
    });
};

/**
 * 查询所有父级菜单，平面展示
 * @param data
 * @param callback
 */
exports.queryAllParentMenus = function(data, callback){
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuTreeQueryByjitkey.identifier;
    menuDAl.queryAllParentMenus(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        results.unshift({"ParentMenuName" : "无","ParentID":0});

        console.log('queryAllParentMenus func in service');
        logger.writeInfo('queryAllParentMenus func in service');
        callback(false,results);
    });
};


/**
 * 菜单新增
 * @param data
 * @param callback
 */
exports.menuInsert = function (data,callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuAdd.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuAdd.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuAdd.identifier;
    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                console.log("[service]menu insert 传入的值存在空值");
                return false;
            }
        }
        return true;
    }

    //传入的值存在空值
    if(!checkData(data)){
        callback(true);
        return ;
    }
    var tempId = data.jitkey;
    delete data.jitkey;
    menuDAl.menuInsert(data,function (err,results) {
        if(err){
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = tempId || 0;  //0代表系统管理员操作
            logModel.Memo = "菜单新增失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("菜单新增失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'菜单新增失败');
            return ;
        }

        //新增成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = tempId || 0; //0代表系统管理员操作
        logModel.Memo = "菜单新增成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("菜单新增成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('菜单新增成功');

        logger.writeInfo('menuInsert func in service');
        logger.writeInfo('menuInsert func in service');
        callback(false,results);
    });
}

/**
 * 菜单编辑
 * @param data
 * @param callback
 */
exports.menuUpdate = function (data,callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuUpd.identifier;
    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                console.log("[service]menuupdate func 传入的值存在空值");
                console.log(data[key]);
                return false;
            }
        }
        return true;
    }

    //传入的值存在空值
    if(!checkData(data)){
        callback(true);
        return ;
    }
    var tempId = data.jitkey;
    delete data.jitkey;
    menuDAl.menuUpdate(data,function (err,results) {
        if(err){
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID = tempId || 0;  //0代表系统管理员操作
            logModel.Memo = "菜单修改失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("菜单修改失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'菜单修改失败');

            return ;
        }

        //修改成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID = tempId || 0; //0代表系统管理员操作
        logModel.Memo = "菜单修改成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("菜单修改成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('菜单修改成功');

        console.log('menuUpdate func in service');
        logger.writeInfo('menuUpdate func in service');
        return callback(false,results);
    });
}

/**
 * 菜单删除
 * @param data
 * @param callback
 */
exports.menuDelete = function (data,callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuDel.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuDel.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuDel.identifier;
    menuDAl.menuDelete(data,function (err,results) {
        if(err){
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateUserID =  0;  //0代表系统管理员操作
            logModel.Memo = "菜单删除失败";
            logService.insertOperationLog(logModel, function (err, logResult) {
                if (err) {
                    logger.writeError("菜单删除失败，生成操作日志失败 " + logModel.CreateTime);
                }
            });
            callback(true,'菜单删除失败');
            return ;
        }

        //修改成功
        logModel.Type = operationConfig.operationType.operation;
        logModel.CreateUserID =  0; //0代表系统管理员操作
        logModel.Memo = "菜单删除成功";
        logService.insertOperationLog(logModel, function (err, logResult) {
            if (err) {
                logger.writeError("菜单删除成功，生成操作日志失败" + logModel.CreateTime);
            }
        });
        logger.writeInfo('菜单删除成功');

        console.log('menuDelete func in service');
        logger.writeInfo('menuDelete func in service');
        return callback(false,results);
    });
}

//根据UserID显示出用户所有的菜单
exports.queryMenuByUserID = function (data,callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuUpd.identifier;
    menuDAl.queryMenuByUserID(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('queryMenuByUserID func in service');
        logger.writeInfo('queryMenuByUserID func in service');
        callback(false,results);
    });

}

//根据UserID显示出用户的角色
exports.queryRoleByUserID = function (data,callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuUpd.identifier;
    menuDAl.queryRoleByUserID(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('queryRoleByUserID func in service');
        logger.writeInfo('queryRoleByUserID func in service');
        callback(false,results);

    });
}

exports.queryMenuAndRoleByUserID = function (data,callback) {
    //要写入operationlog表的
    logModel.OperationName = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Action = operationConfig.backendApp.memuManage.menuUpd.actionName;
    logModel.Identifier = operationConfig.backendApp.memuManage.menuUpd.identifier;
    menuDAl.queryMenuByUserID(data,function (err, menuResults) {
        if(err){
            callback(true);
            return ;
        }

        if(menuResults !== undefined && menuResults.length !== 0){
            var tempJson = {
                "Menu":menuResults
            };

            //已经得到userID用户的menu，下一步得到用户的role
            menuDAl.queryRoleByUserID(data,function (err, roleResults) {
                if(err){
                    callback(true);
                    return;
                }

                if(roleResults !== undefined && roleResults.length !== 0){

                    //合并两次查询的结果，一次性返回给前台
                    tempJson = {
                        "Menu": menuResults,
                        "Role":roleResults
                    };

                    console.log('queryMenuAndRoleByUserID func in service');
                    logger.writeInfo('queryMenuAndRoleByUserID func in service');
                    callback(false,tempJson);

                }else {
                    callback(false,tempJson);
                    return ;
                }
            });
        }else{
            callback(false,menuResults);
            return ;
        }
    });
}

//校验菜单
exports.queryMenuByID = function (data, callback) {
    menuDAl.queryMenuByID(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        callback(false, results);
    });
}