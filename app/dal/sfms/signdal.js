/**
 * @Author: bitzo
 * @Date:   2016-11-09 10:32:38
 * @Last Modified by:
 * @Last Modified time:
 */

var db = appRequire('db/db_sfms');
var signModel = appRequire('model/sfms/signmodel');

exports.signLogInsert = function (data, callback) {
    var sql = 'insert into sfms_signinfo set UserId = ?, ip = ?, UserAgent = ?, mac = ?, Longitude = ?, Latitude = ?, CreateTime = ?, signType = ?';
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

    var value = [data.AccountID, data.ip, data.UserAgent, data.mac, data.Longitude, data.Latitude, time, data.signType];
    console.log("VALUE: "+value);
    console.log("记录签到信息："+sql);
    console.log(value);

    db.mysqlPool.getConnection(function (err, connection) {
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
