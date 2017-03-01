/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:  Duncan
 * @Last Modified time: 2016-11-17 20:00
 */
var userDAL = appRequire('dal/backend/user/userdal'),
    logger = appRequire('util/loghelper').helper;

var operationConfig = appRequire('config/operationconfig'),
    logService = appRequire('service/backend/log/logservice'),
    moment =  moment = require('moment'),
    logModel = appRequire('model/jinkebro/log/logmodel');

logModel.ApplicationID = operationConfig.backendApp.applicationID;
logModel.ApplicationName = operationConfig.backendApp.applicationName;
logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
logModel.PDate = moment().format('YYYY-MM-DD');
delete logModel.ID;

//根据Account,密码查询单一有效用户
exports.querySingleUser = function (accountid, pwd, callback) {

    if (accountid == undefined || accountid == null) {
        logModel.Type = 1;
        logModel.Memo = "查询用户的时候，用户的账户不能为空";
        logModel.CreateUserID = 0; //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("查询单一用户的时候，生成操作日志失败" + logModel.CreateTime);
            }
        });

        callback(true, {
            msg: "帐号不能为空!"
        });
    }

    if (pwd == undefined || pwd == null) {
        logModel.Type = 1;
        logModel.Memo = "查询用户的时候，密码不能为空";
        logModel.CreateUserID = 0;   //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("查询单一用户的时候，生成操作日志失败" + logModel.CreateTime);
            }
        });

        callback(true, {
            msg: "密码不能为空!"
        });
    }

    userDAL.querySingleUser(accountid, pwd, function (err, results) {
        if (err) {

            logModel.Type = 1;
            logModel.Memo = "查询用户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询单一用户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户查询成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })

        callback(false, results);
        return;
    });
};

exports.querySingleID = function (accountid, callback) {
    if (accountid == undefined && accountid == null) {
        logModel.Type = 1;
        logModel.Memo = "查询用户的时候，用户的账户不能为空";
        logModel.CreateUserID = 0; //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("查询单一用户的时候，生成操作日志失败" + logModel.CreateTime);
            }
        });

        callback(true, {
            msg: "账户ID不能为空！"
        });

    }

    userDAL.querySingleID(accountid, function (err, result) {
        if (err) {

            logModel.Type = 1;
            logModel.Memo = "查询用户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询单一用户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户查询成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        return callback(false, result);
    });
};

//查询目前所有用户
exports.queryAllUsers = function (data, callback) {
    //保证传到dal里面的值中page肯定有值
    var page = 'add: '
    for (var key in data) {

        if (key == 'page') {
            page += 'exit ';
        }

        if (key == undefined) {
            console.log("传来的值有部分为空")
            return;
        }
    }

    if (page == 'add: ') {
        data['page'] = 1;
    }

    userDAL.queryAllUsers(data, function (err, results) {
        
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "查询用户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询单一用户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户查询成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户查询成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        callback(false, results);
        return;
    });
};

//新增用户
exports.insert = function (data, callback) {
    for (var key in data) {

        if (key == undefined) {
            console.log("传来的值有部分为空");
            return;
        }
    }

    userDAL.insert(data, function (err, results) {

        if (err) {
            logModel.Type = 1;
            logModel.Memo = "插入用户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("插入用户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户插入成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户插入成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })

        return callback(false, results);
    });
};

//修改用户
exports.update = function (data, callback) {
    userDAL.update(data, function (err, results) {
        if (err) {

            logModel.Type = 1;
            logModel.Memo = "修改用户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("修改用户的时候，生成操作日志失败" + logModel.CreateTime);
                }

            });
            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户修改成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })

        return callback(false, results);
    });
};

//修改用户
exports.delete = function (data, callback) {
    for (var key in data) {
        if (key == undefined) {
            console.log("传来的值有部分为空");
            return;
        }
    }

    userDAL.delete(data, function (err) {

        if (err) {

            logModel.Type = 1;
            logModel.Memo = "修改用户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("修改用户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户修改成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户修改成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        return callback(false);
    });
};

//登录,模拟
exports.login = function (data, callback) {
    var userObj = {
        username: 'snail'
    };

    return callback(false, userObj);
};

//查询数量的service
exports.countUser = function (data, callback) {
    userDAL.countUser(data, function (err, results) {
        if (err) {

            logModel.Type = 1;
            logModel.Memo = "查询用户数量的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询用户数量的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "用户查询数量的时候成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("用户查询数量的时候成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })

        return callback(false, results);
    });
}

//查询账户
exports.queryAccount = function (data, callback) {

    for (var key in data) {
        if (key == undefined) {
            console.log("传来的值有部分为空");
            return;
        }
    }

    userDAL.queryAccount(data, function (err, results) {
        if (err) {

            logModel.Type = 1;
            logModel.Memo = "查询用户账户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("查询用户账户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });
            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "查询用户账户的时候成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("查询用户账户的时候成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })
        return callback(false, results);
    });
}

//通过账户的ID进行的查询
exports.queryAccountByID = function (data, callback) {

    userDAL.queryAccountByID(data, function (err, results) {
        if (err) {
            logModel.Type = 1;
            logModel.Memo = "通过账户的ID,查询用户账户的时候，数据库操作失败";
            logModel.CreateUserID = 0; //0代表的是管理员的操作
            logService.insertOperationLog(logModel, function (err, insertID) {
                if (err) {
                    logger.writeError("通过账户的ID，查询用户账户的时候，生成操作日志失败" + logModel.CreateTime);
                }
            });

            callback(true);
            return;
        }

        logModel.Type = 2;
        logModel.Memo = "通过账户的ID，查询用户账户的时候成功";
        logModel.CreateUserID = 0;  //0代表的是管理员的操作
        logService.insertOperationLog(logModel, function (err, insertID) {
            if (err) {
                logger.writeError("通过账户的ID，查询用户账户的时候成功，生成操作日志失败 " + logModel.CreateTime);
            }
        })

        return callback(false, results);
    });
}