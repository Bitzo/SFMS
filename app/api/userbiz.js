
var express = require('express');
var url = require("url");

var router = express.Router();
//用户业务逻辑组件
var userService = appRequire('service/backend/user/userservice');
var dataservice = appRequire('service/backend/datadictionary/datadictionaryservice');

router.get('/:user_id', function(req, res) {
    var userid = req.params.user_id;

    userService.queryAllUsers({AccountID:userid}, function(err, result) {
        if (err) {
            res.status(500);
            res.json({
                status: 500,
                isSuccess: false,
                msg: '查询失败'
            })
            return;
        }
        //成功获取用户基本信息
        if (result !== undefined && result.length > 0) {
            var data = {
                status: 200,
                isSuccess: true,
                data: {
                    ApplicationID: result[0].ApplicationID,
                    AccountID: result[0].AccountID,
                    Account: result[0].Account,
                    UserName: result[0].UserName,
                    CollegeName: result[0].College,
                    GradeYear: result[0].GradeYear,
                    Phone: result[0].Phone,
                    ClassName: result[0].Class,
                    Memo: result[0].Memo
                }
            };
            res.status(200);
            res.json(data);
        } else {
            res.status(200);
            res.json({
                status: 404,
                isSuccess: false,
                msg: '查询失败'
            })
        }
    });
});

//更新用户信息
router.put('/:user_id', function(req, res) {

});

//逻辑删除用户
router.delete('/:user_id', function(req, res) {

});

//新增用户
router.post('/', function(req, res) {

});

module.exports = router;