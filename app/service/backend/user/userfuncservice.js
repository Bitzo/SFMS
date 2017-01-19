/**
 * @Author: bitzo
 * @Date: 2017/1/18 23:39
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/18 23:39
 * @Function:
 */

var userfuncDAL = appRequire('dal/backend/user/userfuncdal');

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