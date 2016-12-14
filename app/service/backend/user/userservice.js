/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:  Duncan
 * @Last Modified time: 2016-11-17 20:00
 */
var userDAL = appRequire('dal/backend/user/userdal');
    logger = appRequire('util/loghelper').helper;

//根据Account,密码查询单一有效用户
exports.querySingleUser = function(accountid, pwd, callback) {
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

    userDAL.querySingleUser(accountid, pwd, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

exports.querySingleID=function(accountid,callback)
{
    if(accountid==undefined&&accountid==null)
    {
        callback(true,{
            msg:"账户ID不能为空！"
        });

    }
    userDAL.querySingleID(accountid,function(err,result)
    {
        if(err)
        {
            callback(true);
            return;
        }
        callback(false,result);
    });
};

//查询目前所有用户
exports.queryAllUsers = function(data, callback) {
    var page = 'add: '
    for (var key in data) {
        if (key == 'page') {
            page += 'exit ';
        }
    }
    if (page == 'add: ') {
        data['page'] = 1;
    }
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
    userDAL.insert(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//修改用户
exports.update = function(data, callback) {
    userDAL.update(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
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


exports.countUser = function(data, callback) {
    userDAL.countUser(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
}

exports.queryAccount=function(data,callback)
{
    
    userDAL.queryAccount(data,function(err,results)
    {
        if(err)
        {
            callback(true);
            return;
        }
        callback(false,results);
    });
}