/**
 * @Author: Cecurio
 * @Date: 2017/2/18 10:27
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/18 10:27
 * @Function:
 */
var db_jinkebro = appRequire('db/db_jinkebro'),
    staff = appRequire('model/jinkebro/staff/staffmodel'),
    logger = appRequire("util/loghelper").helper;

var addStaff = function (data,callback) {


    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query('', function(err, result) {
            if (err) {
                connection.release();
                throw err;
                callback(true,'失败！');
                return;
            }
            logger.writeInfo('成功！');
            connection.release();
            return callback(false, result);
        });
    });
};

var deleteStaff = function (data,callback) {


    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query('', function(err, result) {
            if (err) {
                connection.release();
                throw err;
                callback(true,'失败！');
                return;
            }
            logger.writeInfo('成功！');
            connection.release();
            return callback(false, result);
        });
    });
};

var updateStaff = function (data,callback) {


    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query('', function(err, result) {
            if (err) {
                connection.release();
                throw err;
                callback(true,'失败！');
                return;
            }
            logger.writeInfo('成功！');
            connection.release();
            return callback(false, result);
        });
    });
};

var getStaff = function (data,callback) {
    console.log(data);
    var queryData = {
        StaffID : data.StaffID,
        StaffName : data.StaffName,
        StaffType : data.StaffType,
        Phone : data.Phone,
        Sex : data.Sex,
        Position : data.Position,
        CreateTime : data.CreateTime,
        LeaveTime : data.LeaveTime,
        IsActive : data.IsActive,
    };

    var arr = new Array();
    arr.push('select jit_staff.StaffID,jit_staff.StaffName,jit_staff.StaffType,jit_staff.Phone,')
    arr.push('jit_staff.Sex,jit_staff.Position,jit_staff.CreateTime,jit_staff.LeaveTime,jit_staff.IsActive')
    arr.push('from jit_staff')
    arr.push('where 1=1')
    var querySql = arr.join(' ');

    if (queryData != undefined) {
        for(var key in queryData) {
            if (queryData[key] != '') {
                if (!isNaN(queryData[key])) {
                    querySql += ' and ' + key + ' = ' + queryData[key] + ' ';
                } else {
                    querySql += ' and ' + key + ' = "' + queryData[key] + '" ';
                }
            }
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    if (data['isPaging'] == 1) {
        querySql += " LIMIT " + (page - 1) * num + "," + num + " ;";
    } else {
        querySql += ';';
    }

    console.log(querySql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query(querySql, function(err, result) {
            if (err) {
                connection.release();
                throw err;
                callback(true,'失败！');
                return;
            }
            logger.writeInfo('成功！');
            connection.release();
            return callback(false, result);
        });
    });
};

var countStaff = function (data,callback) {
    console.log(data);
    var queryData = {
        StaffID : data.StaffID,
        StaffName : data.StaffName,
        StaffType : data.StaffType,
        Phone : data.Phone,
        Sex : data.Sex,
        Position : data.Position,
        CreateTime : data.CreateTime,
        LeaveTime : data.LeaveTime,
        IsActive : data.IsActive,
    };

    var arr = new Array();
    arr.push('select count(1) as num ');
    arr.push('from jit_staff');
    arr.push('where 1=1');

    var querySql = arr.join(' ');

    if (queryData != undefined) {
        for(var key in queryData) {
            if (queryData[key] != '') {
                if (!isNaN(queryData[key])) {
                    querySql += ' and ' + key + ' = ' + queryData[key] + ' ';
                } else {
                    querySql += ' and ' + key + ' = "' + queryData[key] + '" ';
                }
            }
        }
    }
    console.log(querySql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query(querySql, function(err, result) {
            if (err) {
                connection.release();
                throw err;
                callback(true,'失败！');
                return;
            }
            logger.writeInfo('成功！');
            connection.release();
            return callback(false, result);
        });
    });
};

exports.addStaff = addStaff;
exports.deleteStaff = deleteStaff;
exports.updateStaff = updateStaff;
exports.getStaff = getStaff;
exports.countStaff = countStaff;

