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
var functionConfig = appRequire('config/functionconfig');
var userFuncService = appRequire('service/backend/user/userfuncservice');

router.post('/', function (req, res) {
    var data = {
        userID: req.body.jitkey,
        functionCode: functionConfig.sfmsApp.SignManage.SignLogADD.functionCode
    };
    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '签到失败，稍后再试'
            });
        }

        if (results !== undefined && results.isSuccess === true) {
            data = ['jitkey', 'IP', 'userAgent', 'MAC', 'longitude', 'latitude', 'signType'];
            err = 'required: ';

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
                    msg: '缺少字段'
                });
                return;
            }

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
                        msg: '记录失败,稍后再试'
                    });
                    return;
                }

                if (results[0] === undefined) results[0] = {SignType: 1};

                var signStatus = results[0].SignType==1?0:1;

                if (results[0].SignType == data.SignType) {
                    res.status(400);
                    res.json({
                        code: 400,
                        isSuccess: false,
                        signType: results[0].SignType,
                        signStatus:signStatus,
                        msg: '记录失败,签到信息有误'
                    })
                } else {
                    //如果是签退,判断是否已经跨天,若跨天则更改签退时间为签到当日的22：00：00
                    if (data.SignType == 1) {
                        if(!moment(results[0].CreateTime).isSame(data.CreateTime, 'day')) {
                            results[0].CreateTime = moment(results[0].CreateTime).set({
                                'hour':22,
                                'minute':0,
                                'second': 0
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
                                msg: '记录失败,稍后再试'
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
                                signType: signType,
                                signStatus: signType==1?0:1,
                                msg: "签到成功"
                            });
                        }
                    });
                }
            })
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    });
});

module.exports = router;