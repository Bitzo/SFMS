/**
 * @Author: Cecurio
 * @Date: 2017/1/17 17:40
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/17 17:40
 * @Function:
 */
require('../global_bootstrap')
var should = require('should');
var datadictService = appRequire('service/backend/datadictionary/datadictionaryservice');

describe("字典功能单元测试", function() {

    it("字典查询", function(done) {
        var queryData = {
            "page": 1,
            "pageNum": 20,
            "ApplicationID" : '',
            "DictionaryID" : '',
            "DictionaryLevel" : '',
            "ParentID" : '',
            "Category" : 'dc_academy',
            "DictionaryCode" : '',
            "DictionaryValue" : '',
            "IsActive" : 1,
            "isPaging" : 0
        };
        datadictService.queryDatadictionary(queryData, function(err, result) {
            if (err) return done(err);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
});
