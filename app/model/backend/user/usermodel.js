/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-05 11:14:38
 * @Function  用户模型
 */

var userModel = {
    ApplicationID: 0,
    AccountID: 0,
    Account: '',
    UserName:'',
    Pwd: '',
    CollegeID:0,
    GradeYear:'',
    Phone:'',
    ClassID:0,
    Memo:'',
    CreateTime: '1900-01-01',
    IsActive: true,
    PK:'AccountID'
}

module.exports = userModel;