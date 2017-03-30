/**
 * @Author: bitzo
 * @Date: 2017/3/30 15:49
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/3/30 15:49
 * @Function:
 */

var express = require('express'),
    router = express.Router(),
    config = appRequire('config/config'),
    moment = require('moment'),
    userservice = appRequire('service/backend/user/userservice'),
    messageService = appRequire('service/sfms/message/messageservice'),
    logger = appRequire("util/loghelper").helper;

//消息通知的新增
router.post('/', function (req, res) {
   var formdata =  req.body.formdata,
       title = formdata.MessageTitle,
       content = formdata.MessageContent,
       userID = req.query.jitkey,
       date = moment().format("YYYY-MM-DD HH:mm:ss"),
       isActive = 1;

   if (!title||title.trim().length<=0){
       res.status(400);
       return res.json({
           status: 400,
           isSuccess: false,
           msg: '请填写通知标题！'
       })
   }

   if (title.trim().length>100){
       res.status(400);
       return res.json({
           status: 400,
           isSuccess: false,
           msg: '通知标题过长,请勿超过100字符！'
       })
   }

    if (!content||content.trim().length<=0){
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '请填写通知内容！'
        })
    }

    if (content.trim().length>300){
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '通知内容过长,请勿超过300字符！'
        })
    }

    userservice.queryAccountByID({ID:userID}, function (err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if(results.length<=0){
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作用户有误！'
            });
        }

        formdata = {
            'title': title,
            'content': content,
            'createTime': date,
            'createUserID': userID,
            'username': results[0].UserName,
            'isActive': isActive
        };

        messageService.addMessage(formdata, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '查询失败，服务器出错'
                });
            }

            if (results!==undefined&&results.insertId>0) {
                res.status(200);
                return res.json({
                    status: 200,
                    isSuccess: true,
                    msg: '操作成功'
                });
            }else{
                res.status(500);
                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '服务器错误'
                });
            }
        })
    });
});

//通知查询-管理员
router.get('/', function (req, res) {
    var query = JSON.parse(req.query.f),
        ID = query.ID,
        title = query.title,
        content = query.content,
        startTime = query.startTime,
        endTime = query.endTime,
        isActive = query.isActive,
        page = req.query.pageindex>0 ?req.query.pageindex:1,
        pageNum = req.query.pagesize || config.pageCount,
        totalNum = 0;

    var data = {
        'ID': ID,
        'title': title,
        'content': content,
        'startTime': startTime,
        'endTime': endTime,
        'isActive': isActive,
        'OperateUserID': req.query.jitkey,
        'page': page,
        'pageNum': pageNum
    };
    
    //查询数据量
    messageService.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);

            return res.json({
                status: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            });
        }

        totalNum = results[0].num;

        if (totalNum <= 0) {
            res.status(200);

            return res.json({
                status: 200,
                isSuccess: false,
                data: [],
                msg: '无数据'
            });
        }

        messageService.queryMessage(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (!(results !== undefined && results.length > 0)) {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    data:[],
                    msg: '无数据'
                });
            }

            for (var i in results) {
                if (results[i].CreateTime != null)
                    results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD');
            }

            var result = {
                status: 200,
                isSuccess: true,
                dataNum: totalNum,
                curPage: page,
                totalPage: Math.ceil(totalNum/pageNum),
                curPageNum: pageNum,
                data: results
            };

            if(result.curPage == result.totalPage) {
                result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
            }

            res.status(200);

            return res.json(result);
        })
    })
});


//消息通知的修改
router.put('/', function (req, res) {
    var formdata =  req.body.formdata,
        ID = formdata.ID,
        title = formdata.MessageTitle,
        content = formdata.MessageContent,
        userID = req.query.jitkey,
        date = moment().format("YYYY-MM-DD HH:mm:ss"),
        isActive = 1;

    if (!title||title.trim().length<=0){
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '请填写通知标题！'
        })
    }

    if (title.trim().length>100){
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '通知标题过长,请勿超过100字符！'
        })
    }

    if (!content||content.trim().length<=0){
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '请填写通知内容！'
        })
    }

    if (content.trim().length>300){
        res.status(400);
        return res.json({
            status: 400,
            isSuccess: false,
            msg: '通知内容过长,请勿超过300字符！'
        })
    }

    userservice.queryAccountByID({ID:userID}, function (err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            });
        }

        if(results.length<=0){
            res.status(400);
            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作用户有误！'
            });
        }

        formdata = {
            'ID': ID,
            'title': title,
            'content': content,
            'createTime': date,
            'createUserID': userID,
            'username': results[0].UserName,
            'IsActive': isActive
        };

        messageService.updateMessage(formdata, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '修改失败，服务器出错'
                });
            }

            if (results!==undefined&&results.affectedRows>0) {
                res.status(200);
                return res.json({
                    status: 200,
                    isSuccess: true,
                    msg: '操作成功'
                });
            }else{
                res.status(500);
                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '服务器错误'
                });
            }
        })
    });
});

//通知重新启用
router.put('/restart',function (req,res) {
    var ID = req.body.formdata.ID || '';

    if (ID === '' || isNaN(ID)) {
        res.status(400);

        return res.json({
            code: 400,
            isSuccess: false,
            msg: '通知ID有误！'
        });
    }

    var data = {
        ID: ID,
        IsActive:1,
        OperateUserID: req.query.jitkey
    };

    messageService.updateMessage(data, function(err, results){
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (results!==undefined && results.affectedRows>0) {
            res.status(200);

            return res.json({
                code: 200,
                isSuccess: true,
                msg: '操作成功'
            });
        } else {
            res.status(40);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: '操作失败'
            });
        }
    })
});

//通知禁用
router.delete('/', function (req, res) {
    var ID = JSON.parse(req.query.d).ID;

    if (ID == '' || ID === undefined) {
        res.status(400);

        return res.json({
            status: 400,
            isSuccess: false,
            msg: '缺少通知ID'
        })
    }

    var data = {
        'ID': ID,
        'OperateUserID': req.query.jitkey,
        'IsActive': 0
    };

    messageService.updateMessage(data, function (err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: "操作失败，服务器出错"
            });
        }

        if(results !== undefined && results.affectedRows > 0) {
            res.status(200);

            return res.json({
                status: 200,
                isSuccess: true,
                msg: "操作成功"
            })
        } else {
            res.status(400);

            return res.json({
                status: 400,
                isSuccess: true,
                msg: "操作失败"
            });
        }
    });

});

module.exports = router;