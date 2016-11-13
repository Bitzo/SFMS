/**
 * @Author: snail
 * @Date:   2016-11-05 11:14:38
 * @Last Modified by:   snail
 * @Last Modified time: 2016-11-05 11:14:38
 */

var express = require('express');
var url = require("url");

var router = express.Router();
//用户业务逻辑组件
var userBiz = appRequire('service/backend/userservice');

router.get('/:user_id', function(req, res) {
    var userid = req.params.user_id;
    //测试代码
    var data = {
        'AccountID': userid
    };

    userBiz.queryAllUsers(data, function(err, result) {
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