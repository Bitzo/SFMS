/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:  Duncan
 * @Last Modified time: 2016-11-17 20:00
 */
var userDAL = appRequire('dal/backend/user/userdal');
logger = appRequire('util/loghelper').helper;

//根据Account,密码查询单一有效用户
exports.querySingleUser = function (accountid, pwd, callback) {
    if (accountid == undefined || accountid == null) {
        callback(true, {
            msg: "帐号不能为空!"
        });
    }

    if (pwd == undefined || pwd == null) {
        callback(true, {
            msg: "密码不能为空!"
        });
    }

    userDAL.querySingleUser(accountid, pwd, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

exports.querySingleID = function (accountid, callback) {
    if (accountid == undefined && accountid == null) {
        callback(true, {
            msg: "账户ID不能为空！"
        });

    }
    
    userDAL.querySingleID(accountid, function (err, result) {
        if (err) {
            callback(true);
            return;
        }
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
            callback(true);
            return;
        }
        
        callback(false, results);
        return ;
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
            callback(true);
            return;
        }
        return callback(false, results);
    });
};

//修改用户
exports.update = function (data, callback) {
    for (var key in data) {
        if (key == undefined) {
            console.log("传来的值有部分为空");
            return;
        }
    }
    userDAL.update(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
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
            callback(true);
            return;
        }
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
            callback(true);
            return;
        }
        return callback(false, results);
    });
}

exports.queryAccount = function (data, callback) {

    for (var key in data) {
        if (key == undefined) {
            console.log("传来的值有部分为空");
            return;
        }
    }

    userDAL.queryAccount(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        return callback(false, results);
    });
}

exports.queryAccountByID = function (data, callback) {

    userDAL.queryAccountByID(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
         return callback(false, results);
    });
}