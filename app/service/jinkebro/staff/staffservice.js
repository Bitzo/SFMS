/**
 * @Author: Cecurio
 * @Date: 2017/2/18 10:25
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/18 10:25
 * @Function:
 */
var staffDal = appRequire('dal/jinkebro/staff/staffdal.js');
var staffModel = appRequire('model/jinkebro/staff/staffmodel');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;
var config = appRequire('config/config');
var logModel = appRequire('model/backend/log/logmodel');
var logService = appRequire('service/backend/log/logservice');
var operationConfig = appRequire('config/operationconfig');
var moment = require('moment');

var Staff = function () {

};

Staff.prototype.addStaff = function (data,callback) {
    var formdata = {
        StaffName : data.StaffName,
        StaffType : data.StaffType,
        Phone : data.Phone,
        Sex : data.Sex,
        Position : data.Position,
        CreateTime : data.CreateTime,
        IsActive : data.IsActive
    };

    staffDal.addStaff(formdata, function (err, result) {
        if (err) {
            callback(true,'失败！');
            return;
        }

        logger.writeInfo('');
        return callback(false, result);
    });
};

Staff.prototype.deleteStaff = function (data,callback) {
    var formdata = {
        StaffID : data.StaffID
    };
    staffDal.deleteStaff(formdata, function (err, result) {
        if (err) {
            callback(true,'失败！');
            return;
        }

        logger.writeInfo('');
        return callback(false, result);
    });
};

Staff.prototype.updateStaff = function (data,callback) {
    var formdata = {
        StaffID : data.StaffID,
        StaffName : data.StaffName || '',
        StaffType : data.StaffType || '',
        Phone : data.Phone || '',
        Sex : data.Sex || '',
        Position : data.Position || '',
        CreateTime : data.CreateTime || '',
        LeaveTime : data.LeaveTime || '',
        IsActive : data.IsActive || ''
    };
    staffDal.updateStaff(formdata, function (err, result) {
        if (err) {
            callback(true,'失败！');
            return;
        }

        logger.writeInfo('');
        return callback(false, result);
    });
};

Staff.prototype.getStaff = function (data,callback) {
    var formdata = {
        StaffID : data.StaffID || '',
        StaffName : data.StaffName || '',
        StaffType : data.StaffType || '',
        Phone : data.Phone || '',
        Sex : data.Sex || '',
        Position : data.Position || '',
        CreateTime : data.CreateTime || '',
        LeaveTime : data.LeaveTime || '',
        IsActive : data.IsActive || '',
        page : data.page || 1,
        pageNum : data.pageNum || (config.pageCount),
        isPaging : (data.isPaging != undefined) ? data.isPaging : 1
    };

    staffDal.getStaff(formdata, function (err, result) {
        if (err) {
            callback(true,'失败！');
            return;
        }

        logger.writeInfo('');

        for (var i = 0; i < result.length; i++) {
            if (result[i].CreateTime != undefined) {
                result[i].CreateTime = moment(result[i].CreateTime).format('YYYY-MM-DD');
            }
            if (result[i].LeaveTime != undefined) {
                result[i].LeaveTime = moment(result[i].LeaveTime).format('YYYY-MM-DD');
            }
        }

        return callback(false, result);
    });
};


Staff.prototype.countStaff = function (data,callback) {
    var formdata = {
        StaffID : data.StaffID || '',
        StaffName : data.StaffName || '',
        StaffType : data.StaffType || '',
        Phone : data.Phone || '',
        Sex : data.Sex || '',
        Position : data.Position || '',
        CreateTime : data.CreateTime || '',
        LeaveTime : data.LeaveTime || '',
        IsActive : data.IsActive || '',
    };

    staffDal.countStaff(formdata, function (err, result) {
        if (err) {
            callback(true,'失败！');
            return;
        }

        logger.writeInfo('');
        return callback(false, result);
    });
};

module.exports = new Staff();