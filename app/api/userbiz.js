
var express = require('express');
var url = require("url");

var router = express.Router();
//用户业务逻辑组件
var userService = appRequire('service/backend/userservice');

router.get('/:user_id', function(req, res) {
    var userid = req.params.user_id;
    //测试代码
    var data = {
        'AccountID': userid
    };

    userService.queryAllUsers(data, function(err, result) {
        if (err) {
            res.json({
                msg: '查询失败'
            });
            return;
        }

        res.json(result);
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