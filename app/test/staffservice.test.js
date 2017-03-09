/**
 * @Author: Cecurio
 * @Date: 2017/3/9 11:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/3/9 11:23
 * @Function:
 */
require('../global_bootstrap')
var should = require('should'),
    staffService = appRequire('service/jinkebro/staff/staffservice'),
    moment = require('moment'),
    config = appRequire('config/config');

var data = {
        StaffName : "shankai",
        StaffType : 1,
        Phone : 13260905960,
        Sex : 1,
        Position : '员工',
        CreateTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        IsActive : 1
    },
    insertStaffID = -1;

describe("员工单元测试", function () {

    it("员工新增", function (done) {
        staffService.addStaff(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertStaffID = result.insertId;
            done();
        });
    });

    it("员工修改", function (done) {
        var updateData = {
            StaffID : insertStaffID,
            StaffName : 'shankai1996',
            StaffType : 1,
            Phone : 13260905960,
            Sex : 1,
            Position : '经理',
            CreateTime : '',
            LeaveTime : moment().format('YYYY-MM-DD HH:mm:ss'),
            IsActive : 1
        };

        staffService.updateStaff(updateData, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("员工查询", function (done) {
        var queryData = {
            StaffID : insertStaffID,
            StaffName : '',
            StaffType : '',
            Phone : '',
            Sex : '',
            Position : '',
            CreateTime : '',
            LeaveTime : '',
            IsActive : '',
            page : data.page || 1,
            pageNum : data.pageNum || config.pageCount,
            isPaging : 1
        };

        staffService.getStaff(queryData, function (err, result) {
            if (err) return done(err);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("员工删除", function (done) {
        staffService.deleteStaff({StaffID : insertStaffID}, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
});