/**
 * @Author: luozQ
 * @Date: 2016/12/13 上午 10：31
 * @Last Modified by:luozQ
 * @Last Modified time: 2016/12/13 上午 10：31
 * @Function: 产品类别单元测试
 */

require('../global_bootstrap')
var should = require('should');
var proTypeService = appRequire('service/jinkebro/productype/productypeservice');

var data={
    'ProductTypeName':'产中类别1'
};
 
insertProTypeID=-1;

describe("产品类别单元测试", function () {

    it("产品类别新增", function (done) {
        proTypeService.insert(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertProTypeID = result.insertId;
            done();
        });
    });

    it("产品类别查询", function (done) {
        proTypeService.queryAllProType(data, function (err, result) {
            if (err) return done(err);
            console.log(result);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("产品类别修改", function (done) {
        data.ID = insertProTypeID;
        data.ProductTypeName = "产品类别修改名称！";

        proTypeService.update(data, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
 
    it("产品类别删除", function (done) {
        data.ID = insertProTypeID;
        proTypeService.delete(data, function (err, result) {
            if (err) {
                return done(err);
            }
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

});