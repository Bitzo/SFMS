/**
 * @Author: bitzo
 * @Date: 2016/11/19 22:33
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/19 22:33
 * @Function: 角色模块测试
 */

require('../global_bootstrap')
var should = require('should');
var roleService = appRequire('service/backend/role/roleservice');

var data = {
    "ApplicationID": 1,
    "RoleCode": "TestName",
    "RoleName": "单元测试角色",
    "IsActive": 1
}
insertRoleID = -1;

describe("角色单元测试", function() {
    it("角色新增", function(done) {
        roleService.addRole(data, function(err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertRoleID = result.insertId;
            done();
        });
    });

    it("角色查询", function(done) {
        data.RoleID = insertRoleID;
        roleService.queryAllRoles({}, function(err, result) {
            if (err) {
                return done(err);
            }
            result[0].RoleID.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("角色查询计数", function(done) {
        roleService.countAllRoles(data, function(err, result) {
            if (err) {
                return done(err);
            }
            result[0].num.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("角色逻辑删除（修改角色信息）", function(done) {
        data.RoleID = insertRoleID;
        data.IsActive=0;
        roleService.updateRole(data, function(err, result) {
            if (err) {
                return done(err);
            }
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
});