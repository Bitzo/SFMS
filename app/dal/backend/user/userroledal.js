/**
 * @Author: Duncan
 * @Date: 2016/11/15 13:50
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/15 13:50
 * @Function:用户添加角色
 */

var db_backend = appRequire('db/db_backend');
var userModel = appRequire('model/backend/user/userrolemodel');
var logger = appRequire('util/loghelper').helper;
exports.insert = function (data, callback) {
	var insert_sql = 'insert into jit_roleuser set';
	var i = 0;
	for (var key in data) {
		if (i == 0) {
			insert_sql += ' ' + key + " = '" + data[key] + "' ";
			i++;
		}
		else {
			insert_sql += " , " + key + " = '" + data[key] + "' ";
		}
	}
	console.log('用户新增角色：' + insert_sql);
	db_backend.mysqlPool.getConnection(function (err, connection) {
		if (err) {
			callback(true);
			logger.writeError("[dal/user/userroledal----------------28行]数据库的链接失败");
			return;
		}

		connection.query(insert_sql, function (err, results) {
			if (err) {
				callback(true);
				logger.writeError("[dal/user/userroledal-----------------35行]用户角色的新增失败");
				return;
			}
			callback(false, results);
			connection.release();
			return;
		});
	});
}

exports.updateUserRole = function (data, callback) {
	var sql = 'update jit_roleuser set ';
	var i = 0;
	for (var key in data) {
		if (i == 0) {
			sql += key + "= '" + data[key] + "' ";
			i++;
		}
		else {
			sql += ", " + key + " = '" + data[key] + "' ";
		}
	}
	sql += " where " + userModel.PK + " = '" + data[userModel.PK] + "' ";
	console.log(sql);
	db_backend.mysqlPool.getConnection(function (err, connection) {
		if (err) {
			callback(true);
			connection.release();
			logger.writeError("[dal/user/userroledal---------------63行]数据库的链接失败");
			return;
		}
		connection.query(sql, function (err, results) {
			if (err) {
				callback(true);
				logger.writeError("[dal/user/userrolrdal--------------69行]用户角色的更新失败");
				return;
			}
			callback(false, results);
			connection.release();
			return;
		});
	});

}

//查询用户所在的项目
exports.queryAppByUserID = function (data, callback) {
	var sql = 'select distinct ApplicationID from jit_role where RoleID in ( select distinct RoleID from jit_roleuser where AccountID = ';

	sql += data.UserID + ')';
	console.log('查询用户所在项目' + sql);

	db_backend.mysqlPool.getConnection(function (err, connection) {
		if (err) {
			callback(true);
			connection.release();
			logger.writeError("[dal/user/userrole-------------91行]数据库的链接失败");
			return;
		}
		connection.query(sql, function (err, results) {
			if (err) {
				callback(true);
				logger.writeError("[dal/user/userrole-----------------97行]用户角色的查询");
				return;
			}
			callback(false, results);
			connection.release();
			return;
		});
	});
} 

//查询用户角色表的ID
exports.query = function (data, callback) {
    var sql = 'select  jit_role.ApplicationID,jit_role.RoleID,jit_role.RoleName,jit_roleuser.AccountID '; 
		sql += 'from jit_role left join jit_roleuser on  jit_role.RoleID = jit_roleuser.RoleID ';
		sql += 'where jit_roleuser.AccountID = ' + data.AccountID;

	console.log('查询用户所在项目' + sql);

	db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
			logger.writeError("[dal/user/userrole-----------------117行]数据库链接失败");
            return;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
				logger.writeError("[dal/user/userrole----------------124行]用户角色查询失败");
                return;
            }
            callback(false, results);
            connection.release();
			return;
        });
	});

}

/**
 * 删除用户角色
 */
 exports.delete = function (data, callback) {
	 var sql = 'delete from jit_roleuser where AccountID = ' + data.AccountID;
	 console.log('删除用户角色表的信息' + sql);
	 
	 db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            connection.release();
			logger.writeError("[dal/user/userrole]数据库链接失败");
            return;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
				logger.writeError("[dal/user/userrole行]用户角色删除失败");
                return;
            }
            callback(false, results);
            connection.release();
			return;
        });
	});	  
 }
 
 /**
 * @param {Array} data
 * @param callback
 * 增加用户的角色
 */
 exports.addUserRole = function (data, callback) {
	 var insert_sql = 'insert into jit_roleuser (AccountID,RoleID) VALUES ';
	 var sql = '';
	 var accountID = data.AccountID;
	 var roleID = data.data;
	 
	 for(var key in roleID) {
		 sql += '(' + accountID + ', ' + roleID[key].RoleID + ')';
		 if(key < roleID.length-1) sql += ", ";
	 }
	 
	 insert_sql += sql;
	 
	 logger.writeInfo('新增用户角色：' + insert_sql);
	 
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
	 
 }