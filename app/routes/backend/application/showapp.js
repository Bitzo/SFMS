/**
 * @Author: Spring
 * @Date: 16-11-14 下午9:34
 * @Last Modified by: Spring
 * @Last Modified time: 16-11-14 下午9:34
 * @Function: Show Application
 */

var express = require('express');
var router = express.Router();
var userSpring = appRequire('service/backend/application/applicationservice');
var logger = appRequire('util/loghelper').helper;
var config = appRequire('config/config');

router.get('/', function (req, res) {
    var data = ['ID', 'ApplicationCode', 'ApplicationName', 'Memo', 'IsActive'];
    var err = 'required: ';
    var page = req.query.page || 1;

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


    var data = {
        'page': page
    };

    //查找该应用
    var countNum = 0;

    userSpring.countAllapps(data, function (err, results) {
        if (err) {
            res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
            logger.writeError('查询应用,出错信息: ' + err);
            return;
        }

        if (results !==undefined && results.length != 0) {
            countNum = results[0]['num'];
            console.log(countNum);
        }
        userSpring.queryAllApp(data, function (err, results) {
            if (err) {
                res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '查询失败，服务器出错'
                });
                logger.writeError('查询应用,出错信息: ' + err);
                return;
            }

            if (results !== undefined && results.length != 0) {
                res.json({
                    code:200,
                    isSuccess: true,
                    currentpage: page,
                    countNum: countNum,
                    totlePage: Math.ceil(countNum/config.pageCount),
                    data: results,
                    msg: '查找成功'
                });
            } else {
                res.json({
                    code: 404,
                    isSuccess: false,
                    msg: '应用不存在'
                });
                logger.writeError('查询应用,出错信息: 查询用户不存在');
                return;
            }
        });
    });

});

module.exports = router;