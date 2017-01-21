/**
 * @Author: bitzo
 * @Date: 2017/1/20 11:41
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/20 11:41
 * @Function: 用户功能单元测试
 */

require('../global_bootstrap')
var should = require('should');
var userfuncservice = appRequire('service/backend/user/userfuncservice');


var data = {
    "userID": 123125,
    "functionCode": "USERVIEWFUNC",
};

describe("用户功能点测试", function () {
    it("用户功能点鉴权", function(done) {
        userfuncservice.checkUserFunc(data, function(err, result) {
            if (err) return done(err);
            result.isSuccess.should.be.exist;
            done();
        });
    });
})