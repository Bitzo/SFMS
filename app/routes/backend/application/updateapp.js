/**
 * @Author: Spring
 * @Date: 16-11-14 下午8:46
 * @Last Modified by: Spring
 * @Last Modified time: 16-11-14 下午8:46
 * @Function: UpDate Application
 */

var express = require('express');
var router = express.Router();

var userSpring = appRequire('service/backend/applicationservice');

router.put('/:app_id', function(req, res) {
    var data = ['ID', 'ApplicationCode', 'ApplicationName', 'Memo', 'IsActive'];
    var err = 'required: ';

    for (var index in data) {
        if (!data[index] in req.body) {
            console.log(data[index]);
            err += data[index] + ' ';
        }
    }

    if (err != 'required: ') {
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    }

    var ID = req.params.app_id;


    var data = {
        'ID': ID
    }

    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
            return;
        }
        console.log(results);
        if (results !== undefined && results.length != 0) {

            var ID = results[0].ID;

            if (req.body.ApplicationCode != undefined && req.body.ApplicationCode.length != 0) {
                var ApplicationCode = req.body.ApplicationCode;
            } else {
                var ApplicationCode = results[0].ApplicationCode;
            }

            if (req.body.ApplicationName !== undefined && req.body.ApplicationName.length != 0) {
                var ApplicationName = req.body.ApplicationName;
            } else {
                var ApplicationName = results[0].ApplicationName;
            }

            if (req.body.Memo !== undefined && req.body.Memo.length != 0) {
                var Memo = req.body.Memo;
            } else {
                var Memo = results[0].Memo
            }

            if (req.body.IsActive !== undefined && req.body.IsActive.length != 0) {
                var IsActive = req.body.IsActive;
            } else {
                var IsActive = results[0].IsActive;
            }
            data = {
                'ID': ID,
                'ApplicationCode': ApplicationCode,
                'ApplicationName': ApplicationName,
                'Memo': Memo,
                'IsActive': IsActive
            }
            userSpring.update(data, function (err) {
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '更新失败,服务器失败'
                    });
                    return;
                }
                res.json({
                    code:200,
                    isSuccess: true,
                    msg: '更新成功'
                });
            })
        } else {
            res.json({
                code: 404,
                isSuccess: false,
                msg: '应用不存在'
            });
        }
    });

});

module.exports = router;

