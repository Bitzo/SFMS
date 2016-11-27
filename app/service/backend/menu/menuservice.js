/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:53
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/14 18:53
 * @Function:queryAllMenus()查询所有的菜单，菜单新增，菜单修改，菜单删除
 */
var menuDAl = appRequire('dal/backend/menu/menudal');
var logger = appRequire('util/loghelper').helper;

exports.queryAllMenusFormTree = function(data, callback){
    menuDAl.queryMenuByUserID(data,function (err,results) {
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
            if(k==i){
                results[i].children = arr;
            }
            if(results[i].MenuLevel == 1){
                tree.push(results[i]);

            }
        }

        console.log('queryAllMenusFormTree func in service');
        logger.writeInfo('queryAllMenusFormTree func in service');
        //返回菜单树形JSON
        callback(false,tree);
    });
};

//查询所有菜单，平面展示
exports.queryAllMenus = function(data, callback){
    menuDAl.queryAllMenus(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('queryAllMenus func in service');
        logger.writeInfo('queryAllMenus func in service');
        callback(false,results);
    });
};

//菜单新增
exports.menuInsert = function (data,callback) {

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

    menuDAl.menuInsert(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        logger.writeInfo('menuInsert func in service');
        logger.writeInfo('menuInsert func in service');
        callback(false,results);
    });
}

//菜单编辑
exports.menuUpdate = function (data,callback) {

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

    menuDAl.menuUpdate(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('menuUpdate func in service');
        logger.writeInfo('menuUpdate func in service');
        callback(false,results);
    });
}

//菜单删除
exports.menuDelete = function (data,callback) {
    menuDAl.menuDelete(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('menuDelete func in service');
        logger.writeInfo('menuDelete func in service');
        callback(false,results);
    });
}

//根据UserID显示出用户所有的菜单
exports.queryMenuByUserID = function (data,callback) {

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