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
    var sql = 'Select distinct ID, RoleID from jit_roleuser where AccountID = ' + data.AccountID;

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