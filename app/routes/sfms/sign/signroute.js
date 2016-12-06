/**
 * @Author: bitzo
 * @Date: 2016/12/2 12:54
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/2 12:54
 * @Function: 签到信息查询
 */
var express = require('express');
var router = express.Router();
var signservice = appRequire('service/sfms/sign/signservice');
var config = appRequire('config/config');

//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//签到信息记录查询
router.get('/', function (req, res) {
    var userID = req.query.userID,
        userAgent = req.query.userAgent,
        createTime = req.query.createTime,
        signType = req.query.signType,
        totalNum = 0,
        page = req.query.page > 0 ? req.query.pageindex : 1,
        pageNum = req.query.pagesize || 20;

    if (pageNum === undefined) pageNum = config.pageCount;

    var data = {
        'UserID': userID,
        'UserAgent': userAgent,
        'CreateTime': createTime,
        'SignType': signType,
        'page': page,
        'pageNum': pageNum
    }

    signservice.countQuery(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                status: 500,
                isSuccess: false,
                msg: '服务器出错'
            })
        }
        logger.writeInfo(results);
        totalNum = results[0].num;
        if(totalNum > 0) {
            //查询所需的详细数据
            signservice.querySign(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    })
                }
                if (results !== undefined && results.length > 0) {
                    var result = {
                        status: 200,
                        isSuccess: true,
                        totalNum: totalNum,
                        curPage: page,
                        totalPage: Math.ceil(totalNum/pageNum),
                        curNum: pageNum,
                        data: results
                    };
                    if(result.curPage == result.totalPage) {
                        result.curNum = result.totalNum - (result.totalPage-1)*pageNum;
                    }
                    res.status(200);
                    return res.json(result);
                } else {
                    res.status(404);
                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '无数据'
                    })
                }
            })
        } else {
            res.status(404);
            return res.json({
                status: 404,
                isSuccess: false,
                msg: '无数据'
            })
        }
    })
})

module.exports = router;