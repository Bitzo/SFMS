
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
            console.log(result)
            result = result[0];
            var data = {
                status: 200,
                isSuccess: true,
                data: {
                    ApplicationID: result.ApplicationID,
                    AccountID: result.AccountID,
                    Account: result.Account,
                    UserName: result.UserName,
                    CollegeName: result.College,
                    GradeYear: result.GradeYear,
                    Phone: result.Phone,
                    ClassName: result.Class,
                    Memo: result.Memo
                }
            }
            for (var key in data.data) {
                if(data.data[key] === undefined ||data.data[key] === null) {
                    data.data[key] = '暂无数据';
                }
            }
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