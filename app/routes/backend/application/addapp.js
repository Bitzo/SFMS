/**
 * @Author: Spring
 * @Date:   2016-11-14 18:42:38
 * @Last Modified by:
 * @Last Modified time:
 * @Function: Add Application
 */

var express = require('express');
var router = express.Router();

var userSpring = appRequire('service/backend/application/applicationservice');
var logger = appRequire('util/loghelper').helper;

router.post('/', function (req, res) {
    var data = ['ID', 'ApplicationCode', 'ApplicationName', 'Memo', 'IsActive'];
    var err = 'required: ';

    for(var index in data) {
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


    if (req.body.ApplicationCode !== undefined && req.body.ApplicationCode.length != 0) {
        var ApplicationCode = req.body.ApplicationCode;
    } else {
        res.json({
            code: 404,
            isSucess: false,
            msg: 'ApplicationCode没填'
        });
        logger.writeError('新增应用,出错信息: ApplicationCode没填');
        return;
    }

    if (req.body.ApplicationName !== undefined && req.body.ApplicationName.length != 0) {
        var ApplicationName = req.body.ApplicationName;
    } else {
        res.json({
            code: 404,
            isSucess: false,
            msg: 'ApplicationName没填'
        });
        logger.writeError('新增应用,出错信息: ApplicationName没填');
        return;
    }

    if (req.body.Memo !== undefined && req.body.Memo.length != 0) {
        var Memo = req.body.Memo;
    } else {
        var Memo = null;
    }

    if (req.body.IsActive !== undefined && req.body.IsActive.length != 0) {
        var IsActive = req.body.IsActive;
    } else {
        res.json({
            code: 404,
            isSucess: false,
            msg: 'IsActive没填'
        });
        logger.writeError('新增应用,出错信息: IsActive没填');
        return;
    }

    var data = {
        'ApplicationName': ApplicationName
    };

    //检查是否有该应用
    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
            logger.writeError('新增应用,出错信息: ' + err);
            return;
        }

        if (results === undefined || results.length == 0) {
            data = {
                'ApplicationCode': ApplicationCode,
                'ApplicationName': ApplicationName,
                'Memo': Memo,
                'IsActive': IsActive
            }
            userSpring.insert(data, function (err, results) {
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '插入失败， 服务器失败'
                    });
                    logger.writeError('新增应用,出错信息: ' + err);
                    return;
                }
                res.json({
                    code: 200,
                    isSuccess: true,
                    data: {
                        ID: results.insertId,
                        ApplicationCode: data.ApplicationCode,
                        ApplicationName: data.ApplicationName,
                        Memo: data.Memo,
                        IsActive: data.IsActive
                    },
                    msg: '插入成功'
                });
                console.log(results.insertId);
            });
        } else {
            res.json({
                code: 404,
                isSucess: false,
                msg: '应用已存在'
            });
            logger.writeError('新增应用,出错信息: 新增用户已存在');
            return;
        }
    });
});


module.exports = router;