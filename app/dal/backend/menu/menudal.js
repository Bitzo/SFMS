/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:56
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/14 18:56
 * @Function: 查询所有菜单，菜单新增，菜单编辑，菜单删除，通过UserID(AccountID)查询所拥有的菜单、角色
 */

var db_backend = appRequire('db/db_backend');
var menuModel = appRequire('model/backend/menu/menumodel');


//查询目前所有菜单，提供所有菜单的信息，菜单属性展示
exports.queryAllMenus = function(data, callback) {
    var sql = 'select ApplicationID,MenuID,MenuLevel,ParentID,SortIndex,MenuName,IconPath,Url,Memo,IsActive from jit_menu where 1=1';
    if(data !== undefined){
        for(var key in data){
            //判断data[key]是否是数值类型
            if(!isNaN(data[key])){
                sql += ' and ' + key + ' = '+ data[key] + ' ';
            }else {
                sql += ' and ' + key + ' = "'+ data[key] + '" ';
            }

        }
    }
    console.log("【DAL】查询所有菜单：" + sql);
    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            console.log("数据库连接错误：" + err);
            callback(true);
            return;
        }
        connection.query(sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }

            callback(false, results);
            connection.release();
        });
    })
}

//菜单新增
exports.menuInsert = function (data,callback) {
    var arr = new Array();
    arr[0] = 'insert into jit_menu set ApplicationID = ?,' ;
    arr[1] = ' MenuLevel = ?, ';
    arr[2] = ' ParentID = ? , ';
    arr[3] = ' SortIndex =? ,';
    arr[4] = ' MenuName = ? , ';
    arr[5] = ' IconPath = ? ,' ;
    arr[6] = ' Url = ?,' ;
    arr[7] = ' Memo = ? ,' ;
    arr[8] = ' IsActive = ?';
    var sql = arr.join(' ');

    var value = [data.ApplicationID,data.MenuLevel,data.ParentID,data.SortIndex,data.MenuName,data.IconPath,data.Url,data.Memo,data.IsActive];

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            console.log("数据库连接错误：" + err);
            callback(true);
            return;
        }
        connection.query(sql, value, function(err, result) {
            if (err) {
                throw err;
                callback(true);
                return;
            }
            callback(false, result);
            connection.release();
        })
    })


}

//菜单编辑，即修改菜单
exports.menuUpdate = function(data, callback) {
    var sql = 'update jit_menu set ApplicationID = ? , MenuLevel = ?, ParentID = ?, MenuName = ?,Memo =?, IsActive=? where MenuID = ? ';

    var value = [data.ApplicationID,data.MenuLevel,data.ParentID,data.MenuName,data.Memo,data.IsActive,data.MenuID];

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err) {
            console.log("数据库连接错误：" + err);
            callback(true);
            return;
        }


        connection.query(sql, value, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return;
            }

            callback(false, results);
            connection.release();
        })

    });
}


//菜单删除
exports.menuDelete = function (data, callback) {
    var sql = 'delete from jit_menu where 1=1 and MenuID = ?';
    var value = [data.MenuID];
    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            console.log("数据库连接错误：" + err);
            callback(true);
            return ;
        }

        connection.query(sql, value, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return ;
            }

            callback(false, results);
            connection.release();
        })
    })
}



//根据UserID,获取用户的角色
exports.queryRoleByUserID = function (data,callback) {
    var arr = new Array();
    arr[0] = ' select  jit_role.ApplicationID,jit_role.RoleID,jit_role.RoleName,jit_roleuser.AccountID ';
    arr[1] = ' from jit_role ';
    arr[2] = ' left join jit_roleuser on  jit_role.RoleID = jit_roleuser.RoleID';
    arr[3] = '  where jit_roleuser.AccountID = ? ';

    var sql = arr.join(' ');
    var value = [data.userID];

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            console.log("数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(sql,value,function (err, results) {
            if(err){
                throw err;
                callback(true);
                return;
            }

            callback(false, results);
            connection.release();
        })
    })
}

//根据UserID,获取用户相应地菜单
exports.queryMenuByUserID = function (data,callback) {
    var arr = new Array();
    arr[0] = ' select  jit_menu.MenuID,jit_menu.MenuName,jit_usermenu.userID  ';
    arr[1] = ' from jit_menu ';
    arr[2] = ' left join jit_usermenu on jit_menu.MenuID = jit_usermenu.menuID ';
    arr[3] = ' where jit_usermenu.userID = ? ';

    var sql = arr.join(' ');
    var value = [data.userID];

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            console.log("数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(sql, value, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return;
            }
            console.log("sql: " + sql);
            callback(false,results);
            connection.release();
        })
    })
}