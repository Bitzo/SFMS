/**
 * @Author: Cecurio
 * @Date: 2017/2/18 10:21
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/18 10:21
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url'),
    staffService = appRequire('service/jinkebro/staff/staffservice'),
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
    var functionCode = functionConfig.jinkeBroApp.staff.staffAdd.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    };

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var formdata = req.body.formdata;

        var StaffName = formdata.StaffName,
            StaffType = formdata.StaffType,
            Phone = formdata.Phone,
            Sex = formdata.Sex,
            Position = formdata.Position,
            CreateTime = moment().format('YYYY-MM-DD HH:mm:ss'),
            LeaveTime = formdata.LeaveTime || '',
            IsActive = (formdata.IsActive != undefined) ? (formdata.IsActive) : 1;

        var insertData = {
            StaffName : StaffName,
            StaffType : StaffType,
            Phone : Phone,
            Sex : Sex,
            Position : Position,
            CreateTime : CreateTime,
            IsActive : IsActive
        };

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

            if (results != undefined && results.length != 0 && (results[0]['num']) > 0) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: true,
                    msg: "此员工已经存在，请检查！"
                });
            }

            if (results != undefined && results.length != 0) {
                staffService.addStaff(insertData,function (err,result) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            errorMsg: "查询失败，服务器内部错误"
                        });
                    }

                    if (result !== undefined && result.affectedRows != 0 && result.affectedRows != undefined && result.insertId != undefined) {
                        res.status(200);
                        return res.json({
                            code : 200,
                            isSuccess: true,
                            msg : '增加员工成功！'
                        });
                    } else {
                        res.status(404);
                        if (result.msg != undefined) {
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: result.msg
                            });
                        } else {
                            return res.json({
                                code : 404,
                                isSuccess : false,
                                msg : '增加员工失败！'
                            });
                        }
                    }
                });
            }
        });
    });
});

router.delete('/',function (req,res) {
    var functionCode = functionConfig.jinkeBroApp.staff.staffDel.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    };

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var d = JSON.parse(req.query.d);

        var StaffID = d.StaffID;

        var deleteData = {
            "StaffID": StaffID
        };

        staffService.countStaff(deleteData, function (err, result) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (result == undefined || result.length == 0 || result[0]['num'] == 0) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: '操作失败，所要删除的员工不存在'
                });
            }

            staffService.deleteStaff(deleteData, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错，操作失败'
                    });
                }

                if (results !== undefined && results.affectedRows != 0 && results.affectedRows != undefined) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '员工删除操作成功!'
                    });
                } else {
                    res.status(404);
                    if (results.msg != undefined) {
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            msg: results.msg
                        });
                    } else {
                        return res.json({
                            code : 404,
                            isSuccess : false,
                            msg : '员工删除操作失败！'
                        });
                    }
                }
            });
        });
    });
});

router.put('/',function (req,res) {
    var functionCode = functionConfig.jinkeBroApp.staff.staffEdit.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    };

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var formdata = req.body.formdata;

        var StaffID = formdata.StaffID,
            StaffName = formdata.StaffName,
            StaffType = formdata.StaffType,
            Phone = formdata.Phone,
            Sex = formdata.Sex,
            Position = formdata.Position,
            CreateTime = formdata.CreateTime,
            LeaveTime = formdata.LeaveTime,
            IsActive = formdata.IsActive;

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

        staffService.getStaff({staffID : StaffID}, function (err, result) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (result == undefined || result.length == 0) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "修改的员工不存在，修改失败！"
                });
            }

            staffService.updateStaff(updateData, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: results
                    });
                }

                if (results !== undefined && results.affectedRows != 0 && results.affectedRows != undefined) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '修改员工成功！'
                    });
                } else {
                    res.status(404);
                    if (results.msg != undefined) {
                        return res.json({
                            code: 404,
                            isSuccess: false,
                            msg: results.msg
                        });
                    } else {
                        return res.json({
                            code : 404,
                            isSuccess : false,
                            msg : '修改员工失败！'
                        });
                    }
                }
            });
        });
    });
});

router.get('/',function (req,res) {

    var functionCode = functionConfig.jinkeBroApp.staff.staffQuery.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    };

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        var f = {};
        if (req.query.f == undefined) {
            f = {};
        } else {
            f = JSON.parse(req.query.f);
        }

        var page = (req.query.pageindex != undefined) ? (req.query.pageindex) : 1,
            pageNum = (req.query.pagesize != undefined) ? (req.query.pagesize) : (config.pageCount),
            isPaging = (req.query.isPaging != undefined) ? (req.query.isPaging) : 0;

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
                    msg: "查询失败，服务器内部错误"
                });
            }

            if (results == undefined || results.length == 0 || (results[0]['num']) == 0) {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: true,
                    msg: "未查询到相应员工！"
                });
            }

            countNum = results[0]['num'];

            staffService.getStaff(data, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "查询失败，服务器内部错误！"
                    });

                }

                if (result !== undefined && result.length != 0 && result.length != undefined) {
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
            });
        });
    });
});

router.get('/staffType', function (req, res) {
    var functionCode = functionConfig.jinkeBroApp.staff.staffQuery.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    };

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器内部错误！'
            });
        }

        if (!(funcResult != undefined && funcResult.isSuccess)) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: funcResult.msg
            });
        }

        staffService.getStaffType(function (err, result) {
            if (err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: "查询失败，服务器内部错误！"
                });

            }

            if (result != undefined && result.length != 0 && result.length != undefined) {
                var resultBack = {
                    code: 200,
                    isSuccess: true,
                    msg: '查询成功！',
                    data: result
                };

                res.status(200);
                return res.json(resultBack);
            } else {
                res.status(404);
                return res.json({
                    code: 404,
                    isSuccess: false,
                    msg: "未查询到相应职位！"
                });
            }
        });
    });
});

module.exports = router;