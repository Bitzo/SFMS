/**
 * @Author: snail
 * @Date: 2016/12/10 11:00
 * @Last Modified by: 
 * @Last Modified time: 
 * @Function: redis模块测试
 */

require('../global_bootstrap')
var should = require('should');
var redisCache = appRequire('util/redishelper');

//键的名字以组织名_项目名_模块_键的名称组合
var key = 'jkbro_wechat_token';

describe("redis缓存单元测试", function() {
    var redis = new redisCache();

    it("键新增", function(done) {
        redis.set(key, 'hello', function(err, result) {
            if (err) return done(err);
            done();
        });
    });

    it("键查询", function(done) {
        redis.get(key, function(err, result) {
            if (err) return done(err);
            result.should.be.equal('hello').and.should.be.a.String;
            done();
        });
    });

    it("键删除", function(done) {
        redis.del(key, function(err, result) {
            if (err) return done(err);
            result.should.be.equal(1).and.should.be.a.Number;
        });

        redis.get(key, function(err, result) {
            if (err) return done(err);
            (result === null).should.be.true;
            done();
        });
    });

    /* 有问题，之后fix

        it("键新增并设置3秒过期时间", function(done) {
            redis.set(key, 'hello', function(err, result) {
                if (err) return done(err);
            });

            redis.expire(key, 3, function(err, result) {
                if (err) return done(err);
                done();
            });
        });

        it('等待4秒', function(done) {
            this.timeout(4000);
            setTimeout(done, 4000);
        });

        it("3秒后键过期再次查询", function(done) {
            redis.get(key, function(err, result) {
                if (err) return done(err);

                (result).should.be.exactly('null');

                done();
            });
        });
        */
});