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
/**
 * 员工新增
 * 新建一个员工
 */
router.post('/',function (req,res) {
    var formdata = req.body.formdata;

    // var staffModel = {
    //     StaffID : 0,
    //     StaffName : '',
    //     StaffType : 0,
    //     Phone : '',
    //     Sex : 0,
    //     Position : '',
    //     CreateTime : '',
    //     LeaveTime : '',
    //     IsActive : 0,
    //     PK : 'StaffID'
    // };

    var data = ['StaffName', 'StaffType','Phone','Sex','Position'];
    var err = 'require: ';
    for (var value in data) {
        if (!(data[value] in formdata)) {
            err += data[value] + ' ';
        }
    }
    if (err !== 'require: ') {
        logger.writeError(err);
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '存在未填写的必填的字段' + err
        });
    }

    var StaffName = formdata.StaffName,
        StaffType = formdata.StaffType,
        Phone = formdata.Phone,
        Sex = formdata.Sex,
        Position = formdata.Position,
        CreateTime = moment().format('YYYY-MM-DD HH:mm:ss'),
        LeaveTime = formdata.LeaveTime || '',
        IsActive = (formdata.IsActive != undefined) ? (formdata.IsActive) : 1;

    var intData = {
        StaffType : StaffType,
        Sex : Sex,
        Phone : Phone
    };
    for (var key in intData) {
        if (isNaN(intData[key])) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + intData[key] + '不是数字!'
            });
        }
    }

    //接收的数据进行object然后来插入
    var insertData = {
        StaffName : StaffName,
        StaffType : StaffType,
        Phone : Phone,
        Sex : Sex,
        Position : Position,
        CreateTime : CreateTime,
        IsActive : IsActive
    };
    for (var key in insertData) {
        if (insertData[key] == undefined) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '请设置' + key + '！'
            });
        }
    }

    var checkExist = {
        StaffName : StaffName,
        StaffType : StaffType,
        Phone : Phone,
        Sex : Sex,
        Position : Position,
    };

    staffService.countStaff(checkExist, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                errorMsg: "查询失败，服务器内部错误"
            });
        }

        if (results !== undefined && results.length != 0 && (results[0]['num']) == 0) {
            staffService.addStaff(insertData,function (err,result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        errorMsg: "查询失败，服务器内部错误"
                    });
                }

                if (result != undefined && result.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code : 200,
                        isSuccess: true,
                        data : {},
                        msg : '增加员工成功！'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code : 404,
                        isSuccess : false,
                        msg : '增加员工失败！'
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: true,
                msg: "此员工已经存在，请检查！"
            });
        }
    });

});

router.delete('/',function (req,res) {
    var d = JSON.parse(req.query.d);
    var StaffID = d.StaffID;
    if (StaffID === undefined) {
        res.status(404);
        return res.json({
            code: 404,
            isSuccess: false,
            msg: '需要员工编号！'
        });
    }
    if (isNaN(StaffID)) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '员工编号不是数字！'
        });
    }
    var deleteData = {
        "StaffID": StaffID
    };

    staffService.countStaff(deleteData, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                deleteResult: result,
                msg: '操作失败，服务器出错'
            });
        }

        if (result !== undefined &&  result.length != 0 && result[0]['num'] !== 0) {
            staffService.deleteStaff(deleteData, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错，操作失败'
                    });
                }

                if (results !== undefined && results.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        deleteResult: results,
                        msg: '员工删除操作成功!'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "员工删除操作失败!"
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                deleteResult: result,
                msg: '操作失败，所要删除的员工不存在'
            });
        }
    });

});

router.put('/',function (req,res) {
    var formdata = req.body.formdata;

    var data = ['StaffID','StaffName', 'StaffType','Phone','Sex','CreateTime','IsActive'];
    var err = 'require: ';
    for (var value in data) {
        if (!(data[value] in formdata)) {
            err += data[value] + ' ';
        }
    }
    if (err !== 'require: ') {
        logger.writeError(err);
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '存在未填写的必填的字段' + err
        });
    }

    var StaffID = formdata.StaffID,
        StaffName = formdata.StaffName,
        StaffType = formdata.StaffType,
        Phone = formdata.Phone,
        Sex = formdata.Sex,
        Position = formdata.Position,
        CreateTime = formdata.CreateTime,
        LeaveTime = formdata.LeaveTime,
        IsActive = formdata.IsActive;

    var intData = {
        StaffID : StaffID,
        StaffType : StaffType,
        Sex : Sex,
        IsActive : IsActive,
        Phone : Phone
    };
    for (var key in intData) {
        if (isNaN(intData[key])) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: key + ": " + intData[key] + '不是数字'
            });
        }
    }

    if (CreateTime != undefined) {
        CreateTime = moment(CreateTime).format('YYYY-MM-DD HH:mm:ss');
    } else {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '请设置创建时间！'
        });
    }

    if (LeaveTime != undefined) {
        LeaveTime = moment(LeaveTime).format('YYYY-MM-DD HH:mm:ss');
    } else {
        LeaveTime = '';
    }

    var mustData = {
        StaffID : StaffID,
        StaffName : StaffName,
        StaffType : StaffType,
        Phone : Phone,
        Sex : Sex,
        Position : Position,
        IsActive : IsActive
    };

    //接收的数据进行object然后来插入
    var updateData = {
        StaffID : StaffID,
        StaffName : StaffName,
        StaffType : StaffType,
        Phone : Phone,
        Sex : Sex,
        Position : Position,
        CreateTime : CreateTime,
        LeaveTime : LeaveTime,
        IsActive : IsActive
    };

    for (var key in mustData) {
        if (mustData[key] == undefined) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '请设置' + key + '！'
            });
        }
    }

    staffService.getStaff({staffID : StaffID}, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '操作失败，服务器出错'
            });
        }

        if (result !== undefined && result.length !== 0) {
            staffService.updateStaff(updateData, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    });
                }

                if (results !== undefined && results.affectedRows != 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        addProductResult: results,
                        msg: '修改员工成功！'
                    });
                } else {
                    res.status(404);
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "修改员工失败！"
                    });
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: false,
                msg: "修改的员工不存在，修改失败！"
            });
        }
    });
});

router.get('/',function (req,res) {
    console.log(req.query)
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
                        res.status(404);
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            msg: "未查询到相应员工！"
                        });
                    }
                }
            });
        } else {
            res.status(404);
            return res.json({
                code: 404,
                isSuccess: true,
                msg: "未查询到相应员工！"
            });
        }
    });
});

module.exports = router;