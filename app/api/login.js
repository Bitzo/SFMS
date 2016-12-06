/**
 * @Author: bitzo
 * @Date:   2016-11-8 17:44:34
 * @Last Modified by: bitzo
 * @Last Modified time: 2016-11-28 18:20:34
 */

var express = require('express');
var url = require("url");
var router = express.Router();

var userService = appRequire('service/backend/user/userservice');
var signservice = appRequire('service/sfms/sign/signservice')
var jwtHelper = appRequire('util/jwthelper');

//用户登录
router.post('/', function(req, res) {
    var resultData = {
        "data": {
            "isSuccess": false,
            "accountId": -1,
            "signType": -1,
            "msg": "登录失败，请刷新后重试!"
        }
    };

    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
        res.status(401);
        resultData.data.isSuccess = false;
        resultData.data.msg = "帐号密码不能为空!";
        return res.json(resultData);
    }

    var data = {
        "account": username,
        "password": password,
    };

    userService.querySingleUser(username, password, function(err, user) {
        if (err) {
            res.status(500);
            return res.json({
                "status": 500,
                "message": "应用程序异常!",
                "error": err
            });
        }

        if (!user || user.length == 0) {
            res.status(401);
            resultData.data.msg = "帐号密码不对,请重试!";
            return res.json(resultData);
        }

        if (user.length > 0 && user[0].AccountID > 0) {
            //签到信息验证
            data = {
                'UserID': user[0].AccountID
            };
            signservice.signCheck(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        "status": 500,
                        "message": "应用程序异常!",
                        "error": err
                    });
                }
                console.log(results);
                resultData.data.isSuccess = true;
                resultData.data.accountId = user[0].AccountID;
                resultData.data.msg = "登录成功";
                if(results[0] !== undefined) {
                    resultData.data.signType = results[0].SignType;
                } else {
                    resultData.data.signType = 1;
                }
                return res.json(jwtHelper.genToken(resultData.data));
            })
        } else {
            return res.json(resultData);
        }
    })
});
module.exports = router;