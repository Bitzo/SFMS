/**
 * @Author: Cecurio
 * @Date: 2017/2/18 10:25
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/18 10:25
 * @Function:
 */
var staffDal = appRequire('dal/jinkebro/staff/staffdal.js'),
    staffModel = appRequire('model/jinkebro/staff/staffmodel'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config'),
    logModel = appRequire('model/backend/log/logmodel'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    moment = require('moment'),
    validator = require('validator'),
    dataCheck = appRequire('util/dataverify');

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

    var returnResult = {
        "msg": "参数不能为空!"
    };

    var indispensableKeyArr = [
        formdata.StaffName,
        formdata.StaffType,
        formdata.Phone,
        formdata.Sex,
        formdata.Position,
        formdata.CreateTime,
        formdata.IsActive
    ];

    var indispensableValueArr = [
        '员工姓名',
        '员工类型',
        '员工电话',
        '员工性别',
        '员工职位',
        '创建时间',
        '是否有效'
    ];

    var undefinedCheck = dataCheck.isUndefinedArray(indispensableKeyArr,indispensableValueArr);
    if (!(undefinedCheck.isRight)) {
        returnResult.msg = undefinedCheck.msg;
        return callback(false,returnResult);
    }

    var shouldBeNumericKeyArr = [
        formdata.StaffType,
        formdata.Phone,
        formdata.Sex,
        formdata.IsActive
    ];

    var shouldBeNumericValueArr = [
        '员工类型',
        '员工电话',
        '员工性别',
        '是否有效'
    ];

    var shouldBeNumeric = dataCheck.isNumericArray(shouldBeNumericKeyArr,shouldBeNumericValueArr);
    if (!(shouldBeNumeric.isRight)) {
        returnResult.msg = shouldBeNumeric.msg;
        return callback(false,returnResult);
    }

    if (!(validator.isLength((formdata.StaffName),{min:1,max:50}))) {
        returnResult.msg = '员工姓名长度应该小于50位！';
        return callback(false,returnResult);
    }

    if ((formdata.Phone).toString().length != 11) {
        returnResult.msg = '电话长度应该等于11位！';
        return callback(false,returnResult);
    }

    return ;
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

Staff.prototype.getStaffType = function (callback) {

    staffDal.getStaffType(function (err, result) {
        if (err) {
            callback(true,'失败！');
            return;
        }

        logger.writeInfo('获得产品类型！');
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
