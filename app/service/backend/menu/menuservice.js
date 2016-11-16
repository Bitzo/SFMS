/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:53
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/14 18:53
 * @Function:
 */
var menuDAl = appRequire('dal/backend/menu/menudal');

exports.queryAllMenus = function(data, callback){
    menuDAl.queryAllMenus(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        console.log('queryAllMenus func');
        callback(false,results);
    });
};

//菜单新增
exports.menuInsert = function (data,callback) {
    menuDAl.menuInsert(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        console.log('menuInsert func');
        callback(false,results);
    });
}

//菜单编辑
exports.menuUpdate = function (data,callback) {
    menuDAl.menuUpdate(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }
        console.log('menuUpdate func');
        callback(false,results);
    })
}
