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
    var data = ['ApplicationCode', 'ApplicationName', 'IsActive'];
    var err = 'required: ';

    for(var index in data) {
        if (!(data[index] in req.body)) {
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
        'ApplicationName': ApplicationName,
        'pageNum': config.pageCount
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

router.get('/', function (req, res) {
    var page = req.query.pageindex || 1,
        pageNum = req.query.pagesize,
        ID,
        ApplicationName,
        ApplicationCode;

    if (req.query.ID !== undefined) {
        ID = req.query.ID;
    }
    if (req.query.ApplicationName) {
        ApplicationName = req.query.ApplicationName;
    }
    if (req.query.ApplicationCode) {
        ApplicationName = req.query.ApplicationCode;
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
router.put('/:app_id', function(req, res) {
    var data = ['ApplicationCode', 'ApplicationName', 'IsActive'];
    var err = 'required: ';

    for (var index in data) {
        if (!(data[index] in req.body)) {
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
        'ID': ID,
        'pageNum': config.pageCount
    }

    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
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
                'ApplicationName': ApplicationName,
                'pageNum' : config.pageCount
            }
            userSpring.queryAllApp(data, function (err, results) {
                if (err) {
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '查询失败，服务器出错'
                    });
                    logger.writeError('编辑应用,出错信息: ' + err);
                    return;
                }
                if (results === undefined || results.length == 0) {
                    data = {
                        'ID': ID,
                        'ApplicationCode': ApplicationCode,
                        'ApplicationName': ApplicationName,
                        'Memo': Memo,
                        'IsActive': IsActive
                    }
                    userSpring.update(data, function (err, results) {
                        if (err) {
                            res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '更新失败,服务器失败'
                            });
                            logger.writeError('编辑应用,出错信息: ' + err);
                            return;
                        }
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
                    res.json({
                        code: 404,
                        isSuccess: false,
                        msg: '应用名已经存在'
                    });
                    logger.writeError('编辑应用,出错信息: 编辑应用名已经存在');
                    return;
                }
            });
        } else {
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
    var ID = req.body.ID;
    var data = {
        'ID': ID,
        'pageNum': config.pageCount
    }

    userSpring.queryAllApp(data, function (err, results) {
        if (err) {
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
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '更新失败,服务器失败'
                    });
                    logger.writeError('删除应用,出错信息: ' + err);
                    return;
                }
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