/**
 * @Author: snail
 * @Date: 2016/11/18 22:32
 * @Last Modified by: 
 * @Last Modified time: 
 * @Function: 首页单元测试
 */
require('should');

var supertest = require('supertest')
var server = supertest.agent("http://localhost:3000");

describe("登录首页单元测试", function() {
  it("登陆页面返回200状态码", function() {
    server
      .get('/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
      });
  });
});