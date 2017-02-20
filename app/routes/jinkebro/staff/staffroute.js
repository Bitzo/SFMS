/**
 * @Author: Cecurio
 * @Date: 2017/2/18 10:21
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/18 10:21
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url');

//员工业务逻辑组件
var staffService = appRequire('service/jinkebro/staff/staffservice'),
    logger = appRequire("util/loghelper").helper,
    config = appRequire('config/config'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    moment = require('moment');

router.post('/',function (req,res) {

});

router.delete('/',function (req,res) {

});

router.put('/',function (req,res) {

});

router.get('/',function (req,res) {
    var f = {};
    if (req.query.f == undefined) {
        f = {};
    } else {
        f = JSON.parse(req.query.f);
    }

    var page = (req.query.pageindex != undefined) ? (req.query.pageindex) : 1,
        pageNum = (req.query.pagesize != undefined) ? (req.query.pagesize) : (config.pageCount),
        isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 1;

    var data = {
        page : page || 1,
        pageNum :pageNum || (config.pageCount),
        isPaging : isPaging,
        StaffID : f.StaffID || '',
        StaffName : f.StaffName || '',
        StaffType : f.StaffType || '',
        Phone : f.Phone || '',
        Sex : f.Sex || '',
        Position : f.Position || '',
        CreateTime : f.CreateTime || '',
        LeaveTime : f.LeaveTime || '',
        IsActive : f.IsActive || '',
    };

    var countNum = -1;
    staffService.countStaff(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                errorMsg: "查询失败，服务器内部错误"
            });
        }
        if (results !== undefined && results.length != 0 && (results[0]['num']) > 0) {
            countNum = results[0]['num'];
            staffService.getStaff(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误！"
                    });

                } else {
                    if (result !== undefined && result.length != 0 && countNum != -1) {
                        var resultBack = {
                            code: 200,
                            isSuccess: true,
                            msg: '查询成功！',
                            dataNum: countNum,
                            curPage: page,
                            curPageNum: pageNum,
                            totalPage: Math.ceil(countNum / pageNum),
                            data: result
                        };
                        if (resultBack.curPage == resultBack.totalPage) {
                            resultBack.curPageNum = resultBack.dataNum - (resultBack.totalPage - 1) * pageNum;
                        }
                        res.status(200);
                        return res.json(resultBack);
                    } else {
                        res.status(200);
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            msg: "未查询到相应员工！"
                        });
                    }
                }
            });
        } else {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                msg: "未查询到相应员工！"
            });
        }
    });
});

module.exports = router;