/**
 * @Author: bitzo
 * @Date: 2016/11/23 14:07
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/23 14:07
 * @Function:
 */

require('../global_bootstrap')
var should = require('should');
var supertest = require('supertest');
var api = supertest('http://localhost:3000');
var validauth = appRequire('util/validauth');

var data = {
    "username": "admin",
    "password": "123456",
};

describe("登录鉴权测试", function () {
    //测试之前先登录，获取token数据
    it("鉴权测试", function (done) {
        api.post('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send(data)
            .end(function (err, res) {
                if (err) return done(err);
                data = res.body;
                console.log(data);
                data = {
                    access_token: data.token,
                    jitkey: data.data.accountId
                }
                api.post('/api/v1/')
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send(data)
                    .end(function (err, res) {
                        if (err) return done(err);
                        console.log(res.body);
                        should.not.exist(res.body.status);
                        done();
                    })
            })
    })

})