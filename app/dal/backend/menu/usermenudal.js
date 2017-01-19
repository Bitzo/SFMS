/**
 * @Author: bitzo
 * @Date: 2017/1/12 12:48
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/12 12:48
 * @Function:
 */
var db_backend = appRequire('db/db_backend'),
    usermenuModel = appRequire('model/backend/menu/usermenumodel'),
    logger = appRequire('util/loghelper').helper;

//修改用户菜单
exports.delUserMenu = function (data, callback) {
    var sql =  'update jit_usermenu set isActive = ' + data.isActive + ' where ';

    if (data.userID !== '') sql += 'userID = ' + data.userID;
    if (data.menuID !== '') {
        sql += 'menuID = ' + data.menuID;
        sql += ' or meneID in select MenuID from jit_menu where ParentID = ' + data.menuID;
    }

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");
        logger.writeInfo(sql);

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

//新增用户菜单
exports.addUserMenu = function (data, callback) {
    var insert_sql = 'insert into jit_usermenu (userID,menuID,isActive) VALUES ';
    var sql = '';

    var userID = data.userID;
    var menuID = data.menuData;
    for (var key in menuID) {
        sql += "( " + userID + ", " + menuID[key].MenuID + ", 1)";
        if(key < menuID.length-1) sql += ", ";
    }

    insert_sql += sql;

    logger.writeInfo("新增用户菜单：" + insert_sql);

    db_backend.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(insert_sql, function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
};
