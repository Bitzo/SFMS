/**
 * @Author: Spring
 * @Date: 16-11-20 下午7:53
 * @Last Modified by: Spring
 * @Last Modified time: 16-11-20 下午7:53
 * @Function: application的单元测试
 */

require('../global_bootstrap')

var should = require('should');
var appService = appRequire('service/backend/application/applicationservice');

var data = {
    'ApplicationCode': '单元测试代码',
    'ApplicationName': '单元测试应用',
    'Memo': '描述',
    'IsActive': 1,
    'OperateUserID': 1
};

insertID = -1;

describe("应用单元测试", function () {
    it("应用查询", function (done) {
        appService.queryAllApp(data, function (err, results) {
            if (err) {
                done(err);
            }
            console.log(results);
            done();
        });
    });

    it("应用新增", function (done) {
        appService.insert(data, function (err, results) {
            if (err) {
                done(err);
            }
            results.insertId.should.be.above(0).and.should.be.a.Number;
            insertID = results.insertId;
            done();
        });
    });

    it("应用编辑", function (done) {
        data.ID = insertID;
        data.ApplicationCode = "应用编辑测试";
        data.ApplicationName = "应用编辑";
        data.Memo = "应用编辑描述";
        data.IsActive = 0;
        appService.update(data, function (err, results) {
            if (err) {
                done(err);
            }
            results.affectedRows.should.above(0).and.should.be.a.Number;
            done();
        });
    });
});