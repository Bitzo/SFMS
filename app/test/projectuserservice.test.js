/**
 * @Author: bitzo
 * @Date: 2017/1/15 13:50
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/15 13:50
 * @Function:
 */
/**
 * @Author: bitzo
 * @Date: 2017/1/15 13:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/15 13:39
 * @Function:
 */
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
var projectService = appRequire('service/sfms/project/projectuserservice');
var moment = require('moment');

var data = [
        {
            "projectID": 0,
            "projectName": "项目人员单元测试",
            "editName": "admin",
            "userID": 1,
            "userName": "admin",
            "operateUser": 'admin',
            "isActive": 1,
            "duty": "项目人员单元测试"
        }
    ],
    insertID = -1;

describe("项目人员单元测试", function() {
    it("项目人员新增", function (done) {
        projectService.addProjectUser(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = results.insertId;
            done();
        })
    });

    it("项目人员查询", function (done) {
        projectService.queryProjectUser({"OperateUserID": 1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].ID.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目人员查询统计", function (done) {
        projectService.countQuery({}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].num.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("根据人员查询项目", function (done) {
        projectService.queryProjectByUserID({}, function (err, results) {
            if (err) {
                return done(err);
            }
            console.log(results)
            results.length.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目人员修改（逻辑删除）", function (done) {
        projectService.updateProjectUser([{ID: insertID, IsActive:0}], function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });
})