/**
 * @Author: bitzo
 * @Date:   2016-11-8 17:44:34
 * @Last Modified by:
 * @Last Modified time:
 */

var express = require('express');
var url = require("url");

var router = express.Router();
//用户业务逻辑组件
var userBiz = appRequire('service/backend/userservice');

router.post('/', function (req, res) {

    //检查所需要的字段是否都存在
    var data = ['account', 'password'];
    var err = 'required: ';
    for(var value in data)
    {
        console.log(data[value]);
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

    var account = req.body.account;
    var password = req.body.password;

    var data = {
        'Account': account
    };

    //先检查是否有该用户
    userBiz.queryAllUsers(data, function(err, result) {
        if (err) {
            console.log("err1");
            res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
            return;
        }

        if (result !== undefined && result.length != 0) {

            data = {
                'Account': account,
                'Pwd': password
            };

            //帐号名有效状态下验证密码
            userBiz.queryAllUsers(data, function(err, result) {
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '查询失败，服务器出错'
                    });
                    return;
                };
                //账号密码有效下返回数据
                if (result !== undefined && result.length != 0) {
                    res.json({
                        code: 200,
                        isSuccess: true,
                        data:{
                            AccountID: result[0].AccountID,
                            Account: result[0].Account,
                            UserName: result[0].UserName,
                            CollegeID: result[0].CollegeID,
                            GradeYear: result[0].GradeYear,
                            Phone: result[0].Phone,
                            ClassID: result[0].ClassID
                        },
                        msg: "login success"
                    });
                } else {
                    res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "密码错误"
                    })
                }
            });

        }else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: "账号不存在"
            });
        }
    });
});

module.exports = router;