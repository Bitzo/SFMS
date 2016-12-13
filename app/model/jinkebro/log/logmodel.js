/**
 * @Author: Duncan
 * @Date: 16-12-11 
 * @Last Modified by: 
 * @Last Modified time: 
 * @Function: 操作的错误日志
 */
 var moment = require('moment');
 var logModel = 
 {
    ApplicationID: 1,
    ApplicationName: '金科小哥',
    OperationName: '',
    OldValue: '',
    OperationUrl: '',
    NewValue:'',
    Action: '',
    Type: 1,
    ObjName: '',
    Identifier: 1,
    CmdStr: '',
    Memo: '',
    CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    CreateUserID: 0,
    PDate: moment().format('YYYY-MM-DD'),
};
module.exports = logModel;