/**
 * @Author: bitzo
 * @Date: 2017/1/18 23:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/18 23:39
 * @Function:
 */

var userFuncDAL = appRequire('dal/backend/user/userfuncdal');
var userRoleService = appRequire('service/backend/user/userroleservice');
var userFuncService = appRequire('service/backend/user/userfuncservice');
var logger = appRequire("util/loghelper").helper;

/**
 * @function 根据RoleID查询用户的功能点数据
 * @param data
 * @param callback
 * @returns {*}
 */
exports.queryUserFunc = function (data, callback) {
    if (data.RoleID === undefined || data.RoleID.length == 0) {
        return callback(true);
    }
    userFuncDAL.queryUserFunc(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('根据用户查询功能代码');
        callback(false, results);
    })
};

/**
 * @function 用户功能的鉴定
 * @param data {userID: 1, functionCode: 'CODE'}
 * @param callback
 * @returns {isSuccess: true/false, msg: ''}
 */
exports.checkUserFunc = function (data, callback) {
    /**
     * data = {
     *   'userID': 1,
     *   'functionCode': 'TEST'
     * }
     */
    var accountID = data.userID || '',
        functionCode = data.functionCode || '',
        checkResult = {
            isSuccess: false,
            msg: ''
        };
    if (accountID === undefined || accountID === '' || isNaN(accountID)) {
        checkResult.msg = '用户ID错误！';
        return callback(false, checkResult);
    }

    if (functionCode === undefined || functionCode === '') {
        checkResult.msg = '功能点Code有误！';
        return callback(false, checkResult);
    }

    if (functionCode === '') {
        checkResult.msg = '功能点Code有误！';
        return callback(false, checkResult);
    }

    userRoleService.query({AccountID: accountID,IsActive: 1}, function(err, results) {
        if (err) {
            checkResult.msg = '服务器内部错误！';
            return callback(true, checkResult);
        }
        if (results!==undefined && results.length>0) {
            var roleID = [],k=0;
            for (var i in results) {
                if (results[i].IsActive === 1)
                    roleID[k++] = results[i].RoleID;
            }
            if (roleID.length == 0) {
                checkResult.msg = '您无此操作的权限！';
                return callback(false, checkResult);
            }
            userFuncService.queryUserFunc({RoleID:roleID}, function (err, results) {
                if (err) {
                    checkResult.msg = '服务器内部错误！';
                    return callback(true, checkResult);
                }
                if (results!==undefined && results.length > 0) {
                    for (var i in results) {
                        if (functionCode === results[i].FunctionCode) {
                            checkResult.msg = '权限正确！';
                            checkResult.isSuccess = true;
                            return callback(false, checkResult);
                        }
                    }
                    checkResult.msg = '您无此操作的权限！';
                    return callback(false, checkResult);
                } else {
                    checkResult.msg = '您无此操作的权限！';
                    return callback(false, checkResult);
                }
            })
        } else {
            checkResult.msg = '您无此操作的权限！';
            return callback(false, checkResult);
        }
    })
};