/**
 * @Author: bitzo
 * @Date: 2017/1/18 23:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/18 23:39
 * @Function:
 */

var userfuncDAL = appRequire('dal/backend/user/userfuncdal');
var userRoleService = appRequire('service/backend/user/userroleservice');
var userfuncService = appRequire('service/backend/user/userfuncservice');
var logger = appRequire("util/loghelper").helper;


exports.queryUserFunc = function (data, callback) {
    if (data.RoleID === undefined || data.RoleID.length == 0) {
        return callback(true)
    }
    userfuncDAL.queryUserFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('根据用户查询功能代码');
        callback(false, results);
    })

};

exports.checkUserFunc = function (data, callback) {
    /**
     * data = {
     *   'userID': 1,
     *   'functionCode': 'TEST'
     * }
     */
    var accountID = data.userID,
        functionCode = data.functionCode,
        checkResult = {
            isSuccess: false,
            msg: ''
        };

    if (accountID === undefined || isNaN(accountID)) {
        checkResult.msg = '用户ID错误！'
        return callback(false, checkResult);
    }

    if (functionCode === undefined || functionCode.trim() == '') {
        checkResult.msg = '功能点Code有误！'
        return callback(false, checkResult);
    }

    functionCode = functionCode.trim();

    userRoleService.query({AccountID: accountID}, function(err, results) {
        if (err) {
            checkResult.msg = '服务器内部错误！'
            return callback(true, checkResult);
        }
        if (results!==undefined && results.length>0) {
            var roleID = [];
            for (var i in results) {
                roleID[i] = results[i].RoleID;
            }
            userfuncService.queryUserFunc({RoleID:roleID}, function (err, results) {
                if (err) {
                    checkResult.msg = '服务器内部错误！'
                    return callback(true, checkResult);
                }
                if (results!==undefined && results.length > 0) {
                    for (var i in results) {
                        if (functionCode === results[i].FunctionCode) {
                            checkResult.msg = '权限正确！'
                            checkResult.isSuccess = true;
                            return callback(false, checkResult);
                        }
                    }
                    checkResult.msg = '无权限！'
                    return callback(false, checkResult);
                } else {
                    checkResult.msg = '无权限！'
                    return callback(false, checkResult);
                }
            })
        } else {
            checkResult.msg = '无权限！'
            return callback(false, checkResult);
        }
    })
}