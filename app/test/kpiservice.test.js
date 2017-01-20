/**
 * @Author: bitzo
 * @Date: 2017/1/15 13:34
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/15 13:34
 * @Function:
 */
/**
 * @Author: bitzo
 * @Date: 2017/1/15 12:43
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/15 12:43
 * @Function:
 */

require('../global_bootstrap')
var should = require('should');
var KPIService = appRequire('service/sfms/kpi/kpiservice');

var data = {
        "KPIName": '绩效单元测试',
        "KPIType": "单元测试",
        "KPIScore": "单元测试",
        "ProjectId": 0,
        "UserID": 0,
        "UserName": '单元测试',
        "OperateUser": 'admin',
        "OperateUserID": 1,
        "KPIStatus": '绩效单元测试',
        "Remark": '绩效单元测试',
        "IsActive": 1
    },
    insertID = -1;

describe("绩效单元测试", function() {
    it("绩效新增", function (done) {
        KPIService.addKPI(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = results.insertId;
            done();
        })
    });

    it("绩效查询", function (done) {
        KPIService.queryKPI({"OperateUserID": 1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].ID.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("绩效查询统计", function (done) {
        KPIService.countQuery({}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].num.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("绩效审核", function (done) {
        var formdata = {
            ID: insertID,
            CheckUser: 1,
            KPIStatus: '通过',
        }
        KPIService.checkKPI(formdata, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("绩效修改（逻辑删除）", function (done) {
        data.ID = insertID;
        data.IsActive = 0;
        KPIService.updateKPI(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    })

    it("绩效统计", function (done) {
        KPIService.countKPI({OperateUserID:1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results.length.should.be.a.num;
            done();
        })
    });
})