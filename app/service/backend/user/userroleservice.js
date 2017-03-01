/**
 * @Author: Duncan
 * @Date: 2016-11-15 14:22
 * @Last Modified by: Duncan
 * @Last Modified time: 2016-11-15 14:22
 * @Function: 角色对应功能点增加
 */


var userRoleDAL = appRequire('dal/backend/user/userroledal'),
	logger = appRequire("util/loghelper").helper,
    logModel = appRequire('model/backend/log/logmodel'),
    moment = require('moment'),
    config = appRequire('config/config'),
    operationConfig = appRequire('config/operationconfig'),
    logService = appRequire('service/backend/log/logservice');

logModel.ApplicationID = operationConfig.backendApp.applicationID;
logModel.ApplicationName = operationConfig.backendApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;


//勾选对应的功能,更改对应的功能

exports.insert = function (data, callback) {
	userRoleDAL.insert(data, function (err, results) {
		for (var key in data) {
			if (key == undefined) {
				console.log("传来的值有部分为空");
				return;
			}
		}
		
		if (err) {
			logModel.Type = 1;
            logModel.Memo = "插入用户角色的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("插入用户角色的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
			callback(true);
			return;
		}
		
		logModel.Type = 2;
        logModel.Memo = "插入用户角色成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("插入用户角色成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
		
		callback(false, results);
		return;
	});

};

exports.updateUserRole = function (data, callback) {
	userRoleDAL.updateUserRole(data, function (err, results) {
		if (err) {
			
			logModel.Type = 1;
            logModel.Memo = "更新用户角色的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("更新用户角色的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
			
			callback(true);
			return;
		}

		logModel.Type = 2;
        logModel.Memo = "插入用户角色成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("插入用户角色成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
		
		callback(false, results);
		return;
	})
}

//根据用户ID 查询所在的项目
exports.queryAppByUserID = function (data, callback) {
    /**
	 * data = {
	 * 	  UserID: id
	 * }
     */
	userRoleDAL.queryAppByUserID(data, function (err, results) {
		if (err) {
			
			logModel.Type = 1;
            logModel.Memo = "根据用户的ID,查询所在项目的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("根据用户的ID,查询所在项目的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
			callback(true, '查询失败');
			return;
		}

		logModel.Type = 2;
        logModel.Memo = "根据用户的ID,查询所在项目成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("根据用户的ID,查询所在项目，生成操作日志失败 " + logModel.CreateTime);
            }
        })
		
        callback(false, results);
		return ;
    })
};

//根据用户的AccountID 来获取用户角色的ID号
exports.query = function (data, callback) {
	//用来判断是否存在AccountID
	var k = 0;
	for (var key in data) {
		if (key == 'AccountID') {
			k++;
		}
	}

	if (k != 1) {
		console.log("不存在AccountID");
		return;
	}


	userRoleDAL.query(data, function (err, results) {
		if (err) {
			
			logModel.Type = 1;
            logModel.Memo = "根据用户的ID，获取用户角色的ID号的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("根据用户的ID,查询所在项目的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
			console.log("查询出错");
			return;
		}

		logModel.Type = 2;
        logModel.Memo = "根据用户的ID，获取用户角色的ID号的时候成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("根据用户的ID，获取用户角色的ID号的时候，生成操作日志失败 " + logModel.CreateTime);
            }
        })
		
		return callback(false, results);
	})
}

/**
 * @param data
 * @param callback
 * 删除用户角色的部分
 */
exports.delete = function (data, callback) {
	var formdata = {
		'AccountID': data.AccountID || '',
		'RoleID': data.roleID || ''
	}

	userRoleDAL.delete(formdata, function (err, results) {
		if (err) {
			logModel.Type = 1;
            logModel.Memo = "删除角色部分，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("删除角色部分，生成操作日志失败" + logModel.CreateTime);
                }
            });
			
			callback(true);
			return;
		}

		logModel.Type = 2;
        logModel.Memo = "删除角色部分成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("删除角色的时候，生成操作日志失败 " + logModel.CreateTime);
            }
        })
		
		callback(false, results);
		return;
	});
}

exports.addUserRole = function (data, callback) {
	function checkData(data) {
		for (var key in data) {
			if (data[key] === undefined) {
				console.log('undefined:' + key);
				return false;
			}
		}
		return true;
	}

	if (!checkData(data)) {
		callback(true);
		return;
	}

	userRoleDAL.addUserRole(data, function (err, results) {
        if (err) {
			
			logModel.Type = 1;
            logModel.Memo = "增加用户角色部分，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("删除角色部分，生成操作日志失败" + logModel.CreateTime);
                }
            });
			
            callback(true);
            return;
        }

logModel.Type = 2;
        logModel.Memo = "增加用户角色成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("增加用户角色的时候，生成操作日志失败 " + logModel.CreateTime);
            }
        })
		
        callback(false, results);
		return;
    });
}