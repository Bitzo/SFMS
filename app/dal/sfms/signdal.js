/**
 * @Author: bitzo
 * @Date:   2016-11-09 10:32:38
 * @Last Modified by:
 * @Last Modified time:
 */

var db_sfms = appRequire('db/db_sfms');
var signModel = appRequire('model/sfms/signmodel');

exports.signLogInsert = function (data, callback) {

    var sql = "insert into jit_signinfo set UserId = ?, IP = ?, UserAgent = ?, MAC = ?, Longitude = ?, Latitude = ?,CreateTime = ?, SignType = ?"
    var time = new Date();

    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                console.log(key);
                return false;
            }
        }
        return true;
    }
    if(!checkData(data))
    {
        callback(true);
        return;
    }

    var value = [data.AccountId, data.IP, data.UserAgent, data.MAC, data.Longitude, data.Latitude, time, data.SignType];
    console.log("VALUE: "+value);
    console.log("记录签到信息："+sql);
    console.log(value);

    db_sfms.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        connection.query(sql, value, function (err, result) {
            if (err) {
                throw err;
                callback(true);
                return;
            }
            result.time = time;

            callback(false, result);
            connection.release();
        })
    })
};
