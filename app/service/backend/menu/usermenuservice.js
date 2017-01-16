/**
 * @Author: bitzo
 * @Date: 2017/1/12 12:47
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/1/12 12:47
 * @Function:
 */
var usermenuDAl = appRequire('dal/backend/menu/usermenudal'),
    logger = appRequire('util/loghelper').helper;

var db_backend = appRequire('db/db_backend'),
    usermenuModel = appRequire('model/backend/menu/usermenumodel'),
    logger = appRequire('util/loghelper').helper;

exports.delUserMenu = function (data, callback) {
    var formdata = {
        'userID': data.userID,
        'isActive': data.isActive
    }
    usermenuDAl.delUserMenu(formdata, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
}

exports.addUserMenu = function (data, callback) {
    var formdata = {
        'userID': data.userID,
        'menuData': data.menuData
    }

    usermenuDAl.addUserMenu(formdata, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
}