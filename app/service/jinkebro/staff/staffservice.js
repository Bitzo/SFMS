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

    if (!validator.isMobilePhone(formdata.Phone.toString(),'zh-CN')) {
        returnResult.msg = '电话格式不正确，请检查！';
        return callback(false,returnResult);
    }

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

    var returnResult = {
        msg : '参数不能为空'
    };

    if (formdata.StaffID == undefined) {
        returnResult.msg = '员工编号为必填项，请检查！';
        return callback(false,returnResult);
    }

    if (formdata.StaffID != '') {
        if (!validator.isNumeric(formdata.StaffID.toString())) {
            returnResult.msg = '员工编号应该为数字！';
            return callback(false,returnResult);
        }
    }

    staffDal.deleteStaff(formdata, function (err, result) {
        if (err) {
            logger.writeError(result);
            return callback(true,result);
        }

        logger.writeInfo('删除员工成功');

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

    var returnResult = {
        msg : '参数不能为空'
    };

    if (formdata.StaffID == undefined) {
        returnResult.msg = '员工编号为必填项，请检查！';
        return callback(false,returnResult);
    }

    if (formdata.StaffID != '') {
        if (!validator.isNumeric(formdata.StaffID.toString())) {
            returnResult.msg = '员工编号应该为数字！';
            return callback(false,returnResult);
        }
    }

    if (formdata.StaffType != '') {
        if (!validator.isNumeric(formdata.StaffType.toString())) {
            returnResult.msg = '员工类型编号应该为数字！';
            return callback(false,returnResult);
        }
    }

    if (formdata.Sex != '') {
        if (!validator.isNumeric(formdata.Sex.toString())) {
            returnResult.msg = '性别编号应该为数字！';
            return callback(false,returnResult);
        }
    }

    if (formdata.IsActive != '') {
        if (!validator.isNumeric(formdata.IsActive.toString())) {
            returnResult.msg = '是否有效应该为数字！';
            return callback(false,returnResult);
        }
    }

    if (formdata.StaffName != '') {
        if (!validator.isLength(formdata.StaffName.toString(),{max:50})) {
            returnResult.msg = '员工姓名应该小于50位！';
            return callback(false,returnResult);
        }
    }

    if (formdata.Position != '') {
        if (!validator.isLength(formdata.Position.toString(),{max:50})) {
            returnResult.msg = '职位长度应该小于50位！';
            return callback(false,returnResult);
        }
    }

    if (formdata.Phone != '') {
        if (!validator.isMobilePhone(formdata.Phone.toString(),'zh-CN')) {
            returnResult.msg = '电话格式不正确，请检查！';
            return callback(false,returnResult);
        }
    }

    if (formdata.CreateTime != '') {
        formdata.CreateTime = moment(formdata.CreateTime).format('YYYY-MM-DD HH:mm:ss');
    }

    if (formdata.LeaveTime != '') {
        formdata.LeaveTime = moment(formdata.LeaveTime).format('YYYY-MM-DD HH:mm:ss');
    }

    if (formdata.IsActive == 1) {
        formdata.LeaveTime = '';
    }

    staffDal.updateStaff(formdata, function (err, result) {
        if (err) {
            logger.writeError(result);
            return callback(true,result);
        }

        logger.writeInfo('in service,员工修改成功！');

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
        isPaging : (data.isPaging != undefined) ? data.isPaging : 0
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
            callback(true,'获得员工类型失败！');
            return;
        }

        logger.writeInfo('获得员工类型成功！');
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
