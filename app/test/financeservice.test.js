/**
 * @Author: bitzo
 * @Date: 2017/1/15 12:43
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/15 12:43
 * @Function:
 */

require('../global_bootstrap')
var should = require('should');
var financeService = appRequire('service/sfms/finance/financeservice');

var data = {
    "FIName": '财务单元测试',
    "FIType": "单元测试",
    "InOutType": "单元测试",
    "FIPrice": 0,
    "ProjectID": 0,
    "UserID": 0,
    "UserName": '单元测试',
    "OperateUser": 'admin',
    "OperateUserID": 1,
    "FIStatu": '财务单元测试',
    "Remark": '财务单元测试',
    "IsActive": 1
},
insertID = -1;

describe("财务单元测试", function() {
    it("财务新增", function (done) {
        financeService.addFinance(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = results.insertId;
            done();
        })
    });

    it("财务查询", function (done) {
        financeService.queryFinance({"OperateUserID": 1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].ID.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("财务查询统计", function (done) {
        financeService.countQuery({}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].num.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("财务审核", function (done) {
        var formdata = {
            ID: insertID,
            CheckUser: 1,
            FIStatu: '通过',
        }
        financeService.checkFinance(formdata, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("财务修改（逻辑删除）", function (done) {
        data.ID = insertID;
        data.IsActive = 0;
        financeService.updateFinance(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("财务统计", function (done) {
        financeService.financeCount({OperateUserID:1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results.length.should.be.a.num;
            done();
        })
    });
})