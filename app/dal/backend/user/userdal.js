/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:  Duncan
 * @Last Modified time: 2016-11-16 18:30
 */

var db_backend = appRequire('db/db_backend');
var userModel = appRequire('model/backend/user/usermodel');
var config = appRequire('config/config')
var logger = appRequire('util/loghelper').helper;

//根据Account,pwd查询单一有效用户
exports.querySingleUser = function (account, pwd, callback) {
    var arr = new Array();
    arr.push("select  ApplicationID,AccountID,Account,UserName,CollegeID,GradeYear,Phone,ClassID,Memo,CreateUserID,CreateTime");
    arr.push("from jit_user where IsActive=1 and Account= ? and Pwd = ? ");

    var querySql = arr.join(" ");

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError('[dal/user/userdal]数据库链接的时候出错');
            return;
        }

        connection.query(querySql, [account, pwd], function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError('[dal/user/userdal]数据库查询用户的时候出错');
                return;
            }
            callback(false, results);
            return;
        });
    });
}

exports.querySingleID = function (accountid, callback) {
    var sql = 'select  ApplicationID,AccountID,Account,UserName,CollegeID,GradeYear,Phone,';
    sql += 'ClassID,Memo,CreateUserID,CreateTime from jit_user where IsActive=1 and AccountID = ' + accountid;

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError('[dal/user/userdal]数据库链接的时候出错');
            return;
        }

        connection.query(sql, [accountid], function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError('[dal/user/userdal]数据库查询用户的时候出错');
                return;
            }

            callback(false, results);
            return;
        });
    });
}

//查询目前所有用户
exports.queryAllUsers = function (data, callback) {
    var arr = new Array();
    arr.push('select distinct A.ApplicationID,A.Account,A.AccountID,A.UserName,A.Pwd,A.CollegeID,A.GradeYear,A.Phone,A.ClassID,A.Memo,A.CreateTime,A.CreateUserID,A.EditUserID,A.EditTime,A.IsActive,A.Email,A.Address');
    arr.push(',B.UserName as CreateUserName,C.ApplicationName,D.DictionaryValue as College,E.DictionaryValue as Class from jit_user A left join  jit_user B on A.CreateUserID=B.AccountID');
    arr.push('left join jit_application C on A.ApplicationID = C.ID left join jit_datadictionary D on A.CollegeID = D.DictionaryID ');
    arr.push('left join jit_datadictionary E on A.ClassID = E.DictionaryID left join jit_roleuser F on');
    arr.push('A.AccountID = F.AccountID  where 1=1');
    var sql = arr.join(' ');

    for (var key in data) {
        if (key != 'page' && key != 'pageNum' && key != 'IsPage') {
            if (key == 'ApplicationName') {
                sql += ' and C.' + key + " = '" + data[key] + "' ";
                continue;
            }
            else if (key == 'CreateUserName') {
                sql += ' and B.UserName' + " = '" + data[key] + "' ";

            } else {
                sql += ' and A.' + key + " = '" + data[key] + "' ";
            }
        }
    }

    var num = data['pageNum']; //每一页要显示的数据量
    sql += ' order by A.AccountID ';

    if (data['IsPage'] == '' && data['IsPage'] !== 1) {
        sql += " limit " + (data['page'] - 1) * num + " , " + num;
    }

    logger.writeInfo("查询用户:" + sql);
    console.log(sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError('[dal/user/userdal] 数据库链接错误');
            return;
        }

        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError('[dal/user/userdal]数据库的查询出错');
                return;
            }

            callback(false, results);
            return;
        });
    });
};

//新增用户
exports.insert = function (data, callback) {
    var insert_sql = 'insert into jit_user set';

    var i = 0;
    for (var key in data) {
        if (i == 0) {
            insert_sql += " " + key + " = " + " '" + data[key] + "' ";
            i++;
        } else {
            insert_sql += ", " + key + " = " + " '" + data[key] + "' ";
        }
    }

    logger.writeInfo("新增用户: " + insert_sql);
    console.log(insert_sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError("[dal/user/userdal]数据库的链接错误");
            return;
        }

        connection.query(insert_sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError("[dal/user/userdal]数据库的插入错误");
                return;
            }

            callback(false, results);
            return;
        });
    });
};

//修改用户
exports.update = function (data, callback) {
    var upd_sql = 'update jit_user set ';
    var i = 0; //判断是否为第一个参数
    
    for (var key in data) {
        if (key != 'AccountID') {
            if (i == 0) {
                upd_sql += key + " = '" + data[key] + "' ";
                i++;
            } else {
                upd_sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }

    upd_sql += " WHERE " + userModel.PK + " = '" + data[userModel.PK] + "' ";
    logger.writeInfo("修改用户: " + upd_sql);
    console.log(upd_sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError("[dal/user/userdal]数据库的链接失败");
            return;
        }

        connection.query(upd_sql, function (err, results) {
            connection.release();
            if (err) {
                logger.writeError("[dal/user/userdal]数据库修改用户的失败");
                callback(true);
                return;
            }

            callback(false, results);
            return;
        });
    });
};

//删除用户
exports.delete = function (data, callback) {
    var del_sql = 'delete from jit_user where AccountID in ';
    del_sql += "(";
    del_sql += data.toString();
    del_sql += ")";

    console.log("删除用户: " + del_sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError("[dal/user/userdal]数据库的链接出错")
            return;
        }

        connection.query(del_sql, function (err) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError("[dal/user/userdal]数据库的删除时出错")
                return;
            }

            callback(false, '');
            return;
        });
    });
};

//获取数量
exports.countUser = function (data, callback) {
    var sql = 'select count(1) as num from jit_user where 1=1';
    for (var key in data) {
        if (key != 'page' && key != 'pageNum' && key != 'CreateUserName' && key != 'ApplicationName')
            sql += " and " + key + " = '" + data[key] + "' ";
    }

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            logger.writeError("[dal/user/userdal]数据库的链接出错")
            return;
        }

        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError("[dal/user/userdal]数据库获取数量时出错");
                return;
            };

            callback(false, results);
            return;
        })
    })
}

exports.queryAccount = function (data, callback) {

    var sql = 'select ApplicationID,AccountID,Account,UserName,Pwd,CollegeID,GradeYear,Phone,ClassID,';
    sql += 'Memo,CreateUserID,CreateTime,IsActive from jit_user where 1=1 ';

    for (var key in data) {
        sql += ' and Account = "' + data[key] + '" ';
        
    }
    
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError("[dal/user/userdal]数据库链接的错误");
            callback(true);
            return;
        }
        
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError("[dal/user/userdal]数据库查询账户失败")
                return;
            }
            
            callback(false, results);
            return;
        });
    });
}

//根据AccountID 多用户查询
exports.queryAccountByID = function (data, callback) {

    var sql = 'select ApplicationID,AccountID,Account,UserName,Pwd,CollegeID,GradeYear,Phone,ClassID,';
        sql += 'Memo,CreateUserID,CreateTime,IsActive from jit_user where 1=0 ';
        
    for (var key in data) {
        sql += 'or AccountID = "' + data[key] + '" ';
        
    }

    logger.writeInfo('查询多个用户：' + sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            logger.writeError("[dal/user/userdal]数据库链接的错误");
            callback(true);
            return;
        }
        
        connection.query(sql, function (err, results) {
            connection.release();
            if (err) {
                callback(true);
                logger.writeError("[dal/user/userdal]数据库的多用户查询出错");
                return;
            }
            
            callback(false, results);
            return;
        });

    });
}