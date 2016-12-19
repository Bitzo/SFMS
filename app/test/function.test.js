/**
 * @Author: luozQ
 * @Date: 2016/11/20 13:16
 * @Last Modified by:luozQ
 * @Last Modified time: 2016/11/20 13:44
 * @Function: 功能点单元测试
 */

require('../global_bootstrap')
var should = require('should');
var funcService = appRequire('service/backend/function/functionservice');

var data = {
    "ApplicationID": 1,
    "FunctionLevel": 1,
    "ParentID": 0,
    "FunctionCode": '单元测试代码',
    "FunctionName": "单元测试功能点",
    "Memo": '描述',
    "IsActive": 1
},
    insertFunctionID = -1;


describe("功能点单元测试", function () {

    it("功能点新增", function (done) {
        funcService.insert(data, function (err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertFunctionID = result.insertId;
            done();
        });
    });

    it("功能点查询", function (done) {
        funcService.queryAllFunctions(data, function (err, result) {
            if (err) return done(err);
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
    it("功能点修改", function (done) {
        data.FunctionID = insertFunctionID;
        data.Memo = '功能点修改描述';
        data.FunctionName = "功能点修改名称！";

        funcService.update(data, function (err, result) {
            if (err) return done(err);
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    var QueryData={
        "ApplicationID":1,
        "FunctionID":[99,100,101,102]
    }
    it("根据多个FunctionID判断功能点是否存在", function (done) {
        funcService.queryFuncByID(QueryData,function(err,result){
            if(err){
                return done(err);
            }
            console.log(result)
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
     it("根据FunctionID得到该功能点的值", function (done) {
         var data={
            'FunctionID':insertFunctionID  
         }
        funcService.getFuncByID(data,function(err,result){
            if(err){
                return done(err);
            }
            console.log(result)
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
    it("功能点逻辑删除", function (done) {
        data.FunctionID = insertFunctionID;
        funcService.delete(data, function (err, result) {
            if (err) {
                 if(result>0){
                  console.log('功能点下有子节点，不可删除!');
                  done();
                }else{
                 return done(err);
             }
            }
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

});