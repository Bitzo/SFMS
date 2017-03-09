/**
 * @Author: Cecurio
 * @Date: 2017/2/18 10:27
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/18 10:27
 * @Function:
 */
var db_jinkebro = appRequire('db/db_jinkebro'),
    staff = appRequire('model/jinkebro/staff/staffmodel'),
    logger = appRequire("util/loghelper").helper,
    moment = require('moment');

var addStaff = function (data,callback) {
    var staffData = {
        StaffName : data.StaffName,
        StaffType : data.StaffType,
        Phone : data.Phone,
        Sex : data.Sex,
        Position : data.Position,
        CreateTime : data.CreateTime,
        IsActive : data.IsActive
    };

    var insertSql = "insert into jit_staff set ";

    var sql = "";
    if (staffData != undefined) {
        for (var key in staffData) {
            if (staffData[key] != '') {
                if (sql.length == 0) {
                    if (!isNaN(staffData[key])) {
                        sql += " " + key + " = " + staffData[key] + " ";
                    } else {
                        sql += " " + key + " = '" + staffData[key] + "' ";
                    }
                } else {
                    if (!isNaN(staffData[key])) {
                        sql += ", " + key + " = " + staffData[key] + " ";
                    } else {
                        sql += ", " + key + " = '" + staffData[key] + "' ";
                    }
                }
            }
        }
    }
    insertSql += sql + ' ;';

    logger.writeInfo('员工增加：' + insertSql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }

        connection.query(insertSql, function(err, result) {
            connection.release();

            if (err) {               
                throw err;
                callback(true,'失败！');
                return;
            }

            logger.writeInfo('成功！');

            return callback(false, result);
        });
    });
};

var deleteStaff = function (data,callback) {
    var delete_sql = "update jit_staff set jit_staff.IsActive = 0 ,jit_staff.LeaveTime = '" + moment().format('YYYY-MM-DD HH:mm:ss') +
        "' where StaffID = " + data['StaffID'] + ";";

    logger.writeInfo("[deleteStaff func in staffdal]员工删除：" + delete_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }

        connection.query(delete_sql, function(err, result) {
            connection.release();

            if (err) {
                return callback(true,'服务器内部错误，员工删除失败！');
            }

            logger.writeInfo('员工删除成功！');

            return callback(false, result);
        });
    });
};

var updateStaff = function (data,callback) {
    var formdata = {
        StaffName : data.StaffName,
        StaffType : data.StaffType,
        Phone : data.Phone,
        Sex : data.Sex,
        Position : data.Position,
        CreateTime : data.CreateTime,
        IsActive : data.IsActive
    };

    var update_sql = 'update jit_staff set ';
    var sql = '';

    if (formdata !== undefined) {
        for (var key in formdata) {
            if (formdata[key] != '') {
                if (sql.length == 0) {
                    sql += " " + key + " = '" + formdata[key] + "' ";
                } else {
                    sql += ", " + key + " = '" + formdata[key] + "' ";
                }
            }
        }
    }

    if (data.LeaveTime == '') {
        sql += ", LeaveTime = NULL ";
    }

    sql += " where StaffID = " + data['StaffID'];

    update_sql = update_sql + sql + ";";

    logger.writeInfo("[updateStaff func in staffdal]员工修改：" + update_sql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }

        connection.query(update_sql, function(err, result) {
            connection.release();

            if (err) {
                return callback(true,'服务器内部错误！');
            }

            logger.writeInfo('员工更新成功！');

            return callback(false, result);
        });
    });
};

var getStaff = function (data,callback) {
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

    querySql += " order by StaffID desc ";

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    if (data['isPaging'] == 0) {
        querySql += " LIMIT " + (page - 1) * num + "," + num + " ;";
    } else {
        querySql += ';';
    }

    logger.writeInfo('查询员工信息:' + querySql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }

        connection.query(querySql, function(err, result) {
            connection.release();

            if (err) {
                throw err;
                callback(true,'失败！');
                return;
            }

            logger.writeInfo('成功！');
            
            return callback(false, result);
        });
    });
};

var countStaff = function (data,callback) {

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

    logger.writeInfo('员工计数：' + querySql);

    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query(querySql, function(err, result) {
            connection.release();

            if (err) {
                throw err;
                callback(true,'失败！');
                return;
            }

            logger.writeInfo('成功！');

            return callback(false, result);
        });
    });
};

var getStaffType = function (callback) {
    var querySql = "select distinct jit_staff.Position from jit_staff ;";
    db_jinkebro.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            logger.writeError("[staffdal]数据库连接错误：" + err);
            callback(true,'数据库连接失败！');
            return;
        }
        connection.query(querySql, function(err, result) {
            connection.release();
            if (err) {
                throw err;
                callback(true,'失败！');
                return;
            }

            logger.writeInfo('成功！');
            return callback(false, result);
        });
    });
};


exports.addStaff = addStaff;
exports.deleteStaff = deleteStaff;
exports.updateStaff = updateStaff;
exports.getStaff = getStaff;
exports.countStaff = countStaff;
exports.getStaffType = getStaffType;
