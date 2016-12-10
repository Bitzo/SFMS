/**
 * @Author: Spring
 * @Date: 16-11-27 下午6:58
 * @Last Modified by: Spring
 * @Last Modified time: 16-11-27 下午6:58
 * @Function: application router
 */

var express = require('express'),
    router = express.Router(),
    userSpring = appRequire('service/backend/application/applicationservice'),
    logger = appRequire('util/loghelper').helper,
    config = appRequire('config/config');


router.post('/', function (req, res) {
    var query = JSON.parse(req.query.formdata);
        data = ['ApplicationCode', 'ApplicationName', 'IsActive'],
        err = 'required: ';

    for(var index in data) {
        if (!(data[index] in query)) {
            console.log(data[index]);
            err += data[index] + ' ';
        }
    }

    if (err != 'required: ') {
        res.status(400);
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    }

    if (query.ApplicationCode !== undefined && query.ApplicationCode.length != 0) {
        var ApplicationCode = query.ApplicationCode;
    } else {
        res.status(404);
        res.json({
            code: 404,
            isSucess: false,
            msg: 'ApplicationCode没填'
        });
        logger.writeError('新增应用,出错信息: ApplicationCode没填');
        return;
    }

    if (query.ApplicationName !== undefined && query.ApplicationName.length != 0) {
        var ApplicationName = query.ApplicationName;
    } else {
        res.status(404);
        res.json({
            code: 404,
            isSucess: false,
            msg: 'ApplicationName没填'
        });
        logger.writeError('新增应用,出错信息: ApplicationName没填');
        return;
    }

    if (query.Memo !== undefined && query.Memo.length != 0) {
        var Memo = query.Memo;
    } else {
        var Memo = null;
    }

    if (query.IsActive !== undefined && query.IsActive.length != 0) {
        var IsActive = query.IsActive;
    } else {
        res.status(404);
        res.json({
            code: 404,
            isSucess: false,
            msg: 'IsActive没填'
        });
        logger.writeError('新增应用,出错信息: IsActive没填');
        return;
    }

    var data = {
        'ApplicationName': ApplicationName,
        'pageNum': config.pageCount
    };
    //检查是否有该应用
    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
            res.status(500);
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
                    res.status(500);
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '插入失败， 服务器失败'
                    });
                    logger.writeError('新增应用,出错信息: ' + err);
                    return;
                }
                res.status(200);
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
            res.status(404);
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

router.get('/', function (req, res) {
    console.log(req.query);
    var page = req.query.pageindex || 1,
        pageNum = req.query.pagesize,
        ID,
        ApplicationName,
        ApplicationCode;

    var query = JSON.parse(req.query.f);
    if (query.ID !== undefined) {
        ID = query.ID;
    }
    if (query.ApplicationName) {
        ApplicationName = query.ApplicationName;
    }
    if (pageNum === undefined) {
        pageNum = config.pageCount;
    }

    var data = {
        'page': page
    };

    //查找该应用
    var countNum = 0;

    userSpring.countAllapps(data, function (err, results) {
        if (err) {
            res.status(500);
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
        data = {
            'page': page,
            'pageNum': pageNum,
            'IsActive': 1
        };
        if (ID !== undefined) {
            data.ID = ID;
        }
        if (ApplicationName !== undefined) {
            data.ApplicationName = ApplicationName;
        }
        if (ApplicationCode !== undefined) {
            data.ApplicationCode = ApplicationCode;
        }
        userSpring.queryAllApp(data, function (err, results) {
            if (err) {
                res.status(500);
                res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '查询失败，服务器出错'
                });
                logger.writeError('查询应用,出错信息: ' + err);
                return;
            }
            if (page == Math.ceil(countNum/pageNum)) {
                var curpageNum = countNum - (page-1) * pageNum;
            } else {
                var curpageNum = pageNum;
            }
            if (results !== undefined && results.length != 0) {
                res.status(200);
                res.json({
                    code:200,
                    isSuccess: true,
                    curPage: page,
                    dataNum: countNum,
                    curPageNum: curpageNum,
                    totlePage: Math.ceil(countNum/pageNum),
                    data: results,
                    msg: '查找成功'
                });
                console.log(results);
            } else {
                res.status(404);
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

//编辑应用
router.put('/', function(req, res) {
    var data = ['ApplicationCode', 'ApplicationName', 'IsActive'],
        err = 'required: ',
        query = JSON.parse(req.query.f);
    for (var index in data) {
        if (!(data[index] in query)) {
            console.log(data[index]);
            err += data[index] + ' ';
        }
    }

    if (err != 'required: ') {
        res.status(400);
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        return;
    }
    var ID = query.ID;
    var data = {
        'ID': ID,
        'pageNum': config.pageCount
    }

    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
            logger.writeError('编辑应用,出错信息: ' + err);
            return;
        }
        console.log(results);
        if (results !== undefined && results.length != 0) {

            var ID = results[0].ID;

            if (query.ApplicationCode != undefined && query.ApplicationCode.length != 0) {
                var ApplicationCode = query.ApplicationCode;
            } else {
                var ApplicationCode = results[0].ApplicationCode;
            }

            if (query.ApplicationName !== undefined && query.ApplicationName.length != 0) {
                var ApplicationName = query.ApplicationName;
            } else {
                var ApplicationName = results[0].ApplicationName;
            }

            if (query.Memo !== undefined && query.Memo.length != 0) {
                var Memo = query.Memo;
            } else {
                var Memo = results[0].Memo
            }

            if (query.IsActive !== undefined && query.IsActive.length != 0) {
                var IsActive = query.IsActive;
            } else {
                var IsActive = results[0].IsActive;
            }
            data = {
                'ID': ID,
                'ApplicatioCode': ApplicationCode,
                'ApplicationName': ApplicationName,
                'Memo': Memo,
                'IsActive': IsActive
            }
            userSpring.update(data, function (err, results) {
                if (err) {
                    res.status(500);
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '更新失败,服务器失败'
                    });
                    logger.writeError('编辑应用,出错信息: ' + err);
                    return;
                }
                res.status(200);
                res.json({
                    code:200,
                    isSuccess: true,
                    data: {
                        ID: data.ID,
                        ApplicationCode: data.ApplicationCode,
                        ApplicationName: data.ApplicationName,
                        Memo: data.Memo,
                        IsActive: data.IsActive
                    },
                    msg: '更新成功'
                });
                console.log(results);
            });
        } else {
            res.status(404);
            res.json({
                code: 404,
                isSuccess: false,
                msg: '应用不存在'
            });
            logger.writeError('编辑应用,出错信息: 编辑应用不存在');
            return;
        }
    });

});

//删除应用
router.delete('/', function (req, res) {
    var query = JSON.parse(req.query.d),
        ID = query.ID;
    var data = {
        'ID': ID,
        'pageNum': config.pageCount
    }

    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
            res.status(500);
            res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
            logger.writeError('删除应用,出错信息: ' + err);
            return;
        }
        if (results !== undefined && results.length != 0) {
            data = {
                'ID': results[0].ID,
                'ApplicationCode': results[0].ApplicationCode,
                'ApplicationName': results[0].ApplicationName,
                'Memo': results[0].Memo,
                'IsActive': 0
            }
            userSpring.update(data, function (err, results) {
                if (err) {
                    res.status(500);
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '更新失败,服务器失败'
                    });
                    logger.writeError('删除应用,出错信息: ' + err);
                    return;
                }
                res.status(200);
                res.json({
                    code: 200,
                    isSuccess: true,
                    data: {
                        ID: data.ID,
                        ApplicationCode: data.ApplicationCode,
                        ApplicationName: data.ApplicationName,
                        Memo: data.Memo,
                        IsActive: data.IsActive
                    },
                    msg: '删除成功'
                });
            });

        } else {
            res.status(404);
            res.json({
                code: 404,
                isSuccess: false,
                msg: '应用不存在'
            });
            logger.writeError('删除应用,出错信息: 删除应用不存在');
            return;
        }
    });
});

module.exports = router;