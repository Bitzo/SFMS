/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:53
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/14 18:53
 * @Function:queryAllMenus()查询所有的菜单，菜单新增，菜单修改，菜单删除
 */
var menuDAl = appRequire('dal/backend/menu/menudal');

exports.queryAllMenusFormTree = function(data, callback){
    menuDAl.queryAllMenus(data,function (err,results) {
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
        //返回菜单树形JSON
        callback(false,tree);
    });
};

exports.queryAllMenus = function(data, callback){
    menuDAl.queryAllMenus(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        console.log('queryAllMenus func in service');
        callback(false,results);
    });
};

//菜单新增
exports.menuInsert = function (data,callback) {

    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined || data[key] === null){
                console.log("【service】传入的值存在空值");
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
        console.log('menuInsert func in service');
        callback(false,results);
    });
}

//菜单编辑
exports.menuUpdate = function (data,callback) {

    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined || data[key] === null){
                console.log("【service】传入的值存在空值");
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
        callback(false,results);
    })
}

//菜单删除
exports.menuDelete = function (data,callback) {
    menuDAl.menuDelete(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        console.log('menuDelete func in service');
        callback(false,results);
    })
}

//根据UserID显示出用户所有的菜单
exports.queryMenuByUserID = function (data,callback) {

    menuDAl.queryMenuByUserID(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        console.log('queryMenuByUserID func in service');
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
        callback(false,results);

    })
}