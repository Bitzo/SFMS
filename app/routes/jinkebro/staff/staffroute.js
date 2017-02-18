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

    var data = {
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
    var successResponceJson = {
        code : 200,
        isSuccess : true
    };

    staffService.getStaff(data, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: "查询失败，服务器内部错误！"
            });
        } else {
            successResponceJson['data'] = result;
            res.status(200);
            return res.json(successResponceJson);
        }
    });
});
module.exports = router;