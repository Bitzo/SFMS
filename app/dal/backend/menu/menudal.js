/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:56
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/14 18:56
 * @Function: queryAllMenus()
 * @Function: menuInsert()
 * @Function: menuUpdate()
 */

var db_backend = appRequire('db/db_backend');
var menuModel = appRequire('model/backend/menu/menumodel');


//查询目前所有菜单，提供所有菜单的信息，菜单属性展示
exports.queryAllMenus = function (data,callback) {
    var sql = 'select ApplicationID,MenuID,MenuLevel,ParentID,SortIndex,MenuName,IconPath,Url,Memo,IsActive from jit_menu where 1=1';
    if(data !== undefined){
        for(var key in data){
            sql += ' and ' + key + ' = "'+ data.MenuID + '" ';
        }
    }
    console.log("查询所有菜单：" + sql);
    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            callback(true);
            return ;
        }
        connection.query(sql,function (err,results) {
            if(err){
                callback(true);
                return ;
            }

            callback(false,results);
            connection.release();
        });
    })
}

//菜单新增
exports.menuInsert = function (data,callback) {
    var sql = 'insert into jit_menu set ApplicationID = ?,' +
                            ' MenuLevel = ?, '+
                            ' ParentID = ? , '+
                            ' SortIndex =? ,'+
                            ' MenuName = ? , '+
                            ' IconPath = ? ,' +
                            ' Url = ?,' +
                            ' Memo = ? ,' +
                            ' IsActive = ?';

    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                //console.log(key);
                return false;
            }
        }
        return true;
    }

    if(!checkData(data)){
        callback(true);
        return ;
    }

    var value = [data.ApplicationID,data.MenuLevel,data.ParentID,data.SortIndex,data.MenuName,data.IconPath,data.Url,data.Memo,data.IsActive];
    //console.log("value : " + value);
    //console.log("记录新增信息：" + sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            callback(true);
            return ;
        }
        connection.query(sql,value,function (err,result) {
            if(err){
                throw err;
                callback(true);
                return ;
            }
            callback(false,result);
            connection.release();
        })
    })
        
    
}

//菜单编辑，即修改菜单
exports.menuUpdate = function (data,callback) {
    var sql = 'update jit_menu set ApplicationID = ? , MenuLevel = ?, ParentID = ?, MenuName = ?,Memo =?, IsActive=? where MenuID = ? ';

    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                //console.log(key);
                return false;
            }
        }
        return true;
    }

    if(!checkData(data)){
        callback(true);
        return ;
    }

    var value = [data.ApplicationID,data.MenuLevel,data.ParentID,data.MenuName,data.Memo,data.IsActive,data.MenuID];

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err) {
            callback(true);
            return ;
        }

        connection.query(sql,value,function (err,results) {
            if(err) {
                throw err;
                callback(true);
                return ;
            }

            callback(false,results);
            connection.release();
        })

    });
}

