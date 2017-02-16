/**
 * @Author: bitzo
 * @Date: 2016/11/20 14:18
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/20 14:18
 * @Function: 角色功能点模块测试
 */

require('../global_bootstrap')
var should = require('should');
var rolefuncService = appRequire('service/backend/role/rolefuncservice');

var data = {
    "RoleID": 1,
    "data": [
        {
            "FunctionID":1
        },
        {
            "FunctionID":2
        }
    ],
    "OperateUserID": 1
};

describe("角色功能点单元测试", function() {
    it("角色功能点新增", function (done) {
        rolefuncService.addRoleFunc(data, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("角色功能点查询", function (done) {
        rolefuncService.queryRoleFunc(data, function (err, result) {
            if (err) return done(err);
            result[0].FunctionID.should.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("角色功能点删除", function (done) {
        rolefuncService.delRoleFunc(data, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

});