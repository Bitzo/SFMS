/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:56
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/23 17:11
 * @Function: 查询所有菜单，菜单新增，菜单编辑，菜单删除，通过UserID(AccountID)查询所拥有的菜单、角色
 */

var db_backend = appRequire('db/db_backend');
var menuModel = appRequire('model/backend/menu/menumodel');
var logger = appRequire('util/loghelper').helper;

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
    logger.writeInfo("[queryAllMenus func in menudal]查询所有菜单：" + sql);
    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[menudal]数据库连接错误：" + err);
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
    var insert_sql = 'insert into jit_menu set ';
    var sql = '';
    if(data !== undefined){
        for(var key in data){
            if(sql.length == 0){
                sql += " " + key + " = '" + data[key] + "' " ;
            }else{
                sql += ", " + key + " = '" + data[key] + "' " ;
            }
        }
    }

    insert_sql += sql;

    logger.writeInfo("[menuInsert func in menudal]菜单新增：" +insert_sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[menudal]数据库连接错误：" + err);
            callback(true);
            return;
        }
        connection.query(insert_sql, function(err, result) {
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
    var update_sql = 'update jit_menu set ';
    var sql = '';
    if(data !== undefined){
        for(var key in data){
            if(key != 'MenuID'){
                if(sql.length == 0){
                    sql += " " + key + " = '" + data[key] + "' " ;
                }else{
                    sql += ", " + key + " = '" + data[key] + "' " ;
                }
            }
        }
    }
    sql += " where MenuID = " + data['MenuID'];

    update_sql = update_sql + sql;

    logger.writeInfo("[menuUpdate func in menudal]菜单编辑:" + update_sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err) {
            logger.writeError("[menudal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(update_sql, function(err, results) {
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
    var sql = 'delete from jit_menu where 1=1 and MenuID = ';
    sql = sql + data.MenuID;

    logger.writeInfo("[menuDelete func in menudal]菜单删除：" + sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[menudal]数据库连接错误：" + err);
            callback(true);
            return ;
        }

        connection.query(sql, function(err, results) {
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
    arr.push(' select  jit_role.ApplicationID,jit_role.RoleID,jit_role.RoleName,jit_roleuser.AccountID ');
    arr.push(' from jit_role ');
    arr.push(' left join jit_roleuser on  jit_role.RoleID = jit_roleuser.RoleID');
    arr.push('  where jit_roleuser.AccountID = ');

    var sql = arr.join(' ');
    sql = sql + data.userID;

    logger.writeInfo("[queryRoleByUserID func in menudal]根据UserID查询角色: " + sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[menudal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(sql,function (err, results) {
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
    arr.push(' select  jit_menu.ApplicationID,jit_menu.MenuID,jit_menu.MenuLevel,jit_menu.ParentID, ');
    arr.push(' jit_menu.SortIndex,jit_menu.MenuName,jit_menu.IconPath,jit_menu.Url,jit_menu.Memo ');
    arr.push(' from jit_menu ');
    arr.push(' left join jit_usermenu on jit_menu.MenuID = jit_usermenu.menuID ');
    arr.push(' where jit_usermenu.userID =  ');

    var sql = arr.join(' ');
    sql = sql + data.userID;

    logger.writeInfo("[queryMenuByUserID func in menudal]根据UserID查询菜单: : " + sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[menudal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return;
            }

            callback(false,results);
            connection.release();
        });
    });
}