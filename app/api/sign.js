/**
 * @Author: bitzo
 * @Date:   2016-11-8 19:21:57
 * @Last Modified by:
 * @Last Modified time:
 */

var express = require('express');
var url = require("url");

var router = express.Router();
//用户签到签退业务
var signservice = appRequire('service/sfms/signservice');

router.post('/', function (req, res) {

    var data = ['AccountID', 'ip', 'UserAgent', 'mac', 'Longitude', 'Latitude', 'signType'];
    var err = 'required: ';
    for(var value in data)
    {
        if(!(data[value] in req.body))
        {
            console.log(1);
            err += data[value] + ' ';
        }
    }

    if(err!='required: ')
    {
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    };

    var userID = req.body.AccountID;
    var ip = req.body.ip;
    var UserAgent = req.body.UserAgent||'';
    var mac = req.body.mac;
    var Longitude = req.body.Longitude;
    var Latitude = req.body.Latitude;
    var signType = req.body.signType;

    data = {
        'AccountID': userID,
        'ip':ip,
        'UserAgent': UserAgent,
        'mac': mac,
        'Longitude': Longitude,
        'Latitude':Latitude,
        'signType':signType
    };

    signservice.signLog(data, function(err, result) {
        if (err) {
            res.json({
                code: '500',
                isSuccess: false,
                msg: '记录失败,连接数据库有误'
            });
            return;
        }
        console.log(result);
        if (result!==undefined&&result.affectedRows===1)
        {
            res.json({
                code:200,
                isSuccess: true,
                signTime: result.time,
                msg: "sign success"
            });
        }
    });
});

module.exports = router;