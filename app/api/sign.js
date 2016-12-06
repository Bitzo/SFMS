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
var moment = require('moment');
var logger = appRequire("util/loghelper").helper;

router.post('/', function (req, res) {

    var data = ['jitkey', 'IP', 'userAgent', 'MAC', 'longitude', 'latitude', 'signType'];
    var err = 'required: ';
    for(var value in data)
    {
        if(!(data[value] in req.body))
        {
            console.log('require:' + data[value]);
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
    var time = moment().format('YYYY-MM-DD HH:mm:ss');

    data = {
        'UserID': userID,
        'IP': ip,
        'UserAgent': userAgent,
        'MAC': mac,
        'Longitude': longitude,
        'Latitude': latitude,
        'SignType': signType,
        'CreateTime': time
    };
    //先验证签到信息
    signservice.signCheck({'UserID':userID}, function (err, results) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: '记录失败,连接数据库有误'
            });
            return;
        }
        logger.writeInfo('前一次签到信息：' + results);
        if (results[0] === undefined) results[0] = {SignType: 1};
        if (results[0].SignType == data.SignType) {
            res.status(400);
            res.json({
                code: 400,
                isSuccess: false,
                signType: results[0].SignType,
                msg: '记录失败,签到信息有误'
            })
        } else {
            //如果是签退,判断是否已经垮天,若垮天则更改签退时间为签到当日的23：59：59
            if (data.SignType == 1) {
                if(!moment(results[0].CreateTime).isSame(data.CreateTime, 'day')) {
                    results[0].CreateTime = moment(results[0].CreateTime).set({
                        'hour':23,
                        'minute':59,
                        'second': 59
                    }).format('YYYY-MM-DD HH:mm:ss');
                    data.CreateTime = results[0].CreateTime;
                }
            }
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
        }
    })
});

module.exports = router;