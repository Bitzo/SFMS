/**
 * @Author: Spring
 * @Date: 16-12-9 下午7:02
 * @Last Modified by: Spring
 * @Last Modified time: 16-12-9 下午7:02
 * @Function: 消费者服务
 */

var customerDAL = appRequire('dal/jinkebro/customer/customerdal');

exports.insert = function (data, callback) {
    customerDAL.insert(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
}