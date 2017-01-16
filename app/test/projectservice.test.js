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
var projectService = appRequire('service/sfms/project/projectservice');
var moment = require('moment');

var data = {
        "ProjectName": '项目单元测试',
        "ProjectDesc": "项目单元测试",
        "ProjectManageID": 1,
        "ProjectManageName": 'admin',
        "ProjectEndTime": moment().format('YYYY-MM-DD HH:mm:ss'),
        "ProjectTimeLine": '项目单元测试',
        "ProjectStatus": '项目单元测试',
        "ProjectPrice": 0,
        "OperateUser": 'admin',
        "OperateUserID": 1,
        "IsActive": 1,
        "EditUser": 1,
        "EditTime": 0,
        "CreateTime": 0
    },
    insertID = -1;

describe("项目单元测试", function() {
    it("项目新增", function (done) {
        projectService.addProject(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = results.insertId;
            done();
        })
    });

    it("项目查询", function (done) {
        projectService.queryProject({"OperateUserID": 1}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].ID.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目查询统计", function (done) {
        projectService.countQuery({}, function (err, results) {
            if (err) {
                return done(err);
            }
            results[0].num.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });

    it("项目修改（逻辑删除）", function (done) {
        data.ID = insertID;
        data.IsActive = 0;
        projectService.updateProject(data, function (err, results) {
            if (err) {
                return done(err);
            }
            results.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        })
    });
})