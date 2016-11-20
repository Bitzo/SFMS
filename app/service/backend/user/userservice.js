/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:  Duncan
 * @Last Modified time: 2016-11-17 20:00
 */
var userDAL = appRequire('dal/backend/user/userdal');

//查询目前所有用户
exports.queryAllUsers = function(data, callback) {
    userDAL.queryAllUsers(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//新增用户
exports.insert = function(data, callback) {
    userDAL.insert(data, function(err) {
        if (err) {
            callback(true);
            return;
        }
        callback(false);
    });
};

//修改用户
exports.update = function(data, callback) {
    userDAL.update(data, function(err,results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false,results);
    });
};

//修改用户
exports.delete = function(data, callback) {
    userDAL.delete(data, function(err) {
        if (err) {
            callback(true);
            return;
        }
        callback(false);
    });
};

//登录,模拟
exports.login = function(data, callback) {
    var userObj = {
        username: 'snail'
    };

    callback(false, userObj);
};


exports.countUser=function(data,callback)
{
    userDAL.countUser(data,function(err,results)
    {
        if(err)
        {
            callback(true);
            return;
        }
        callback(false,results);
    });
}