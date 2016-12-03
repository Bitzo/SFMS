/**
 * @Author: snail
 * @Date:   2016-12-03 
 * @Last Modified by:   
 * @Last Modified time: 
 * @Function  操作日志模型
 */

var operationLogModel = {
    ID: 0,
    ApplicationID: 0,
    ApplicationName: '',
    OperationName:'',
    OldValue: '',
    OperationUrl:'',
    NewValue:'',
    Action:'',
    Type:0,
    ObjName:'',
    Identifier: 0,
    CmdStr: '',
    Memo:'',
    CreateTime:'1900-01-01',
    CreateUserID:0,
    PDate:'1900-01-01'
}

module.exports = operationLogModel;