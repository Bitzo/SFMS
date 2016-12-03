/**
 * @Author: snail
 * @Date: 2016-12-03
 * @Last Modified by: 
 * @Last Modified time: 
 * @Function: 操作日志的单元测试
 */
require('../global_bootstrap');
//日期组件
var moment = require('moment');

var should = require('should');
var logService = appRequire('service/backend/log/logservice');

var logModel = {
    ApplicationID: 1,
    ApplicationName: 'jit1320',
    OperationName: '测试',
    OldValue: '',
    OperationUrl: '',
    NewValue: '',
    Action: '日志测试',
    Type: 1,
    ObjName: '',
    Identifier: 1,
    CmdStr: '',
    Memo: '日志测试',
    CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    CreateUserID: 1,
    PDate: moment().format('YYYY-MM-DD'),
};

describe("日志功能单元测试", function() {
    it("日志新增", function(done) {
        logService.insertOperationLog(logModel, function(err, insertId) {
            if (err) return done(err);
            insertId.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });
});