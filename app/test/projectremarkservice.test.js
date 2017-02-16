/**
 * @Author: bitzo
 * @Date: 2017/1/15 14:11
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/15 14:11
 * @Function:
 */
require('../global_bootstrap')
var should = require('should');
var projectremarkService = appRequire('service/sfms/project/projectremarkservice');

var data = {
        "projectID": 0,
        "projectName": "项目备注单元测试",
        "userID": 1,
        "userName": 'admin',
        "remark": '项目备注单元测试',
        "OperateUser": 'admin',
        "OperateUserID": 1,
    },
    insertID = -1;

describe("项目备注单元测试", function() {
    it("项目备注新增", function (done) {
        projectremarkService.addRemark(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = results.insertId;
            done();
        })
    });

    it("项目备注修改", function (done) {
        data.ID = insertID;
        data.remark = '项目备注单元测试-'
        projectremarkService.updateRemark(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目备注删除", function (done) {
        projectremarkService.delRemark({ID: insertID, OperateUserID: 1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目备注查询", function (done) {
        projectremarkService.queryRemark({"projectID": [],"OperateUserID": 1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].ID.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目备注查询统计", function (done) {
        projectremarkService.countRemark({"projectID": []}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].num.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });
});