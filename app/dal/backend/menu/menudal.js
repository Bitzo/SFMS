/**
 * @Author: Cecurio
 * @Date: 2016/11/14 18:56
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/11/23 17:11
 * @Function: 查询所有菜单，菜单新增，菜单编辑，菜单删除，通过UserID(AccountID)查询所拥有的菜单、角色
 */

var db_backend = appRequire('db/db_backend'),
    menuModel = appRequire('model/backend/menu/menumodel'),
    logger = appRequire('util/loghelper').helper;

/**
 * 查询目前所有菜单，提供所有菜单的信息，菜单属性展示
 * @param data
 * @param callback
 */
exports.queryAllMenus = function(data, callback) {
    var arr = new Array();

    arr.push(" select jit_menu.MenuName,jit_menu.IconPath,jit_menu.MenuID,jit_menu.MenuLevel, ");
    arr.push(" jit_menu.ParentID,B.MenuName as ParentMenuName,jit_menu.SortIndex, ")
    arr.push(" C.ApplicationName,jit_menu.ApplicationID,jit_menu.Url,jit_menu.Memo,jit_menu.IsActive ");
    arr.push(" from jit_menu ");
    arr.push(" left join jit_application C on jit_menu.ApplicationID = C.ID ");
    arr.push(" left join jit_menu B on jit_menu.ParentID = B.MenuID ");
    arr.push(" where 1=1 ");

    var sql = arr.join(' ');

    var MenuData = data.MenuManage;
    if(MenuData !== undefined){
        for(var key in MenuData){
            if (MenuData[key] != ''){
                //判断data[key]是否是数值类型
                if(!isNaN(MenuData[key])){
                    sql += ' and ' + 'jit_menu.' + key + ' = '+ MenuData[key] + ' ';
                }else {
                    sql += ' and ' + 'jit_menu.' + key + ' = "'+ MenuData[key] + '" ';
                }
            }
        }
    }

    var num = data.pageManage.pageNum; //每页显示的个数
    var page = data.pageManage.page || 1;
    var IsPaging = data.pageManage.isPaging;

    if (IsPaging == 1) {
        sql += " LIMIT " + (page-1)*num + "," + num;
    }

    logger.writeInfo("[queryAllMenus func in menudal]查询所有菜单：" + sql);
    console.log("in dal,查询所有的菜单：" + sql);

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

exports.queryAllParentMenus = function(data, callback) {
    var arr = new Array();

    arr.push(" select DISTINCT MenuName as ParentMenuName, MenuID as ParentID ");
    arr.push(" from jit_menu ")
    arr.push(" where 1= 1 and MenuLevel = 1 and ParentID = 0  ");
    
    var sql = arr.join(' ');

    if(data !== undefined){
        for(var key in data){
            if (key !== 'page' && key !== 'pageNum' && data[key] != ''){
                //判断data[key]是否是数值类型
                if(!isNaN(data[key])){
                    sql += ' and ' + key + ' = '+ data[key] + ' ';
                }else {
                    sql += ' and ' + key + ' = "'+ data[key] + '" ';
                }
            }
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    sql += " LIMIT " + (page-1)*num + "," + num + " ;";

    logger.writeInfo("[queryAllParentMenus func in menudal]查询所有父级菜单：" + sql);
    console.log("in dal,查询所有的父级菜单：" + sql);

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


//计数，查询菜单表的总个数
exports.countAllMenus = function (data, callback) {
    var sql =  'select count(1) AS num from jit_menu where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
                sql += " and " + key + " = '" + data[key] + "' ";
        }
    }

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");
        logger.writeInfo(sql);
        console.log(sql);

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            connection.release();
        })
    })
};

//菜单新增
exports.menuInsert = function (data,callback) {
    var insert_sql = 'insert into jit_menu set ';
    var sql = '';
    if(data !== undefined){
        for(var key in data){
            if (key !== undefined) {
                if(sql.length == 0){
                    sql += " " + key + " = '" + data[key] + "' " ;
                }else{
                    sql += ", " + key + " = '" + data[key] + "' " ;
                }
            }

        }
    }

    insert_sql += sql;

    logger.writeInfo("[menuInsert func in menudal]菜单新增：" +insert_sql);
    console.log("in dal, 菜单新增：" + insert_sql);

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
            if(key != 'MenuID' && key !== undefined){
                if(sql.length == 0){
                    sql += " " + key + " = '" + data[key] + "' " ;
                }else{
                    sql += ", " + key + " = '" + data[key] + "' " ;
                }
            }
        }
    }
    sql += " where IsActive = 1 and MenuID = " + data['MenuID'];

    update_sql = update_sql + sql;

    logger.writeInfo("[menuUpdate func in menudal]菜单编辑:" + update_sql);
    console.log("in dal,菜单编辑：" + update_sql);

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
    var update_sql = 'update jit_menu set IsActive = 0 where IsActive = 1 and MenuID = ' + data['MenuID'];

    logger.writeInfo("[menuDelete func in menudal]菜单删除：" + update_sql);
    console.log("in dal,菜单删除：" + update_sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[menudal]数据库连接错误：" + err);
            callback(true);
            return ;
        }

        connection.query(update_sql, function(err, results) {
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
    console.log("[queryRoleByUserID func in menudal]根据UserID查询角色: " + sql);

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
    arr.push(' select  jit_menu.ApplicationID,jit_application.ApplicationName,jit_menu.MenuID,jit_menu.MenuLevel,jit_menu.ParentID, ');
    arr.push(' jit_menu.SortIndex,jit_menu.MenuName,jit_menu.IconPath,jit_menu.Url,jit_menu.Memo ');
    arr.push(' from jit_menu ');
    arr.push(' left join jit_usermenu on jit_menu.MenuID = jit_usermenu.menuID ');
    arr.push(' left join jit_application on jit_menu.ApplicationID = jit_application.ID ')
    arr.push(' where jit_usermenu.userID =  ');

    var sql = arr.join(' ');
    sql = sql + data.userID;

    logger.writeInfo("[queryMenuByUserID func in menudal]根据UserID查询菜单: : " + sql);
    console.log("[queryMenuByUserID func in menudal]根据UserID查询菜单: : " + sql);

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

exports.queryMenuByID = function (data, callback) {
    var sql = 'select count(1) as count from jit_menu where IsActive=1';
    sql += " and (";
    var MenuID = data.MenuID;

    for (var i in MenuID) {
        if (i == MenuID.length - 1) {
            sql += "MenuID=" + MenuID[i] + " )";
        } else {
            sql += "MenuID=" + MenuID[i] + " or ";
        }
    }
    logger.writeInfo("判断菜单是否存在:" + sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(sql, function (err, results) {
            if (err) {
                logger.writeError('根据MenuID判断该菜单是否存在err:' + err);
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}