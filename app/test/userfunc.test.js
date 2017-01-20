/**
 * @Author: bitzo
 * @Date: 2017/1/20 11:41
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/20 11:41
 * @Function: 用户功能单元测试
 */

require('../global_bootstrap')
var should = require('should');
var supertest = require('supertest');
var api = supertest('http://localhost:1320');
var validauth = appRequire('util/validauth');

var userdata = {
    "username": "admin",
    "password": "123456",
};

describe("用户功能点测试", function () {
    //测试之前先登录，获取token数据
    it("用户功能点测试", function (done) {
        api.post('/api/v1/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send(userdata)
            .end(function (err, res) {
                if (err) return done(err);
                var data = res.body;
                data = {
                    access_token: data.access_token,
                    jitkey: data.data.accountId
                }
                api.get('/userfunc')
                    .expect(200)
                    .query({
                        accountID:1,
                        functionCode:'USERVIEWFUNC'
                    })
                    .send(data)
                    .end(function (err, res) {
                        if (err) return done(err);
                        console.log(res.body)
                        res.body.code.should.be.equal(200);
                        done();
                    })
            })
    })
})