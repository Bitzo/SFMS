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
var signservice = appRequire('service/sfms/sign/signservice');

router.post('/', function (req, res) {

    var data = ['jitkey', 'IP', 'userAgent', 'MAC', 'longitude', 'latitude', 'signType'];
    var err = 'required: ';
    for(var value in data)
    {
        if(!(data[value] in req.body))
        {
            console.log(data[value]);
            err += data[value] + ' ';
        }
    }

    if(err != 'required: ')
    {
        res.status(400);
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    };

    var userID = req.body.jitkey;
    var ip = req.body.IP;
    var userAgent = req.body.userAgent || '';
    var mac = req.body.MAC;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var signType = req.body.signType;

    data = {
        'AccountId': userID,
        'IP': ip,
        'UserAgent': userAgent,
        'MAC': mac,
        'Longitude': longitude,
        'Latitude': latitude,
        'SignType': signType
    };

    signservice.signLog(data, function(err, result) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: '记录失败,连接数据库有误'
            });
            return;
        }
        console.log(result);
        if (result!==undefined&&result.affectedRows===1)
        {
            res.status(200);
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