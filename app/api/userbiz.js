
var express = require('express');
var url = require("url");

var router = express.Router();
//用户业务逻辑组件
var userService = appRequire('service/backend/user/userservice');
var dataservice = appRequire('service/backend/datadictionary/datadictionaryservice');

router.get('/:user_id', function(req, res) {
    var userid = req.params.user_id;

    userService.querySingleID(userid, function(err, result) {
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
            result = result[0];
            //开始处理初始的数据
            var collegeName = result.CollegeID,
                gradeYear = result.GradeYear,
                className = result.ClassID;
            var query = {
                'DictionaryID': [collegeName, gradeYear, className]
            }
            dataservice.queryDatadictionaryByID(query, function (err, results) {
                if (err) {
                    res.status(500);
                    res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '查询失败'
                    })
                    return;
                }
                if(results.length == 3) {
                    collegeName = results[0].DictionaryValue;//'软件工程学院';
                    gradeYear = results[1].DictionaryValue;//'2015';
                    className = results[2].DictionaryValue;//'15软件工程（嵌入式培养）3班';
                } else {
                    collegeName =  "数据有误";
                    gradeYear = "数据有误";
                    className = "数据有误";
                }

                var data = {
                    status: 200,
                    isSuccess: true,
                    data: {
                        ApplicationID: result.ApplicationID,
                        AccountID: result.AccountID,
                        Account: result.Account,
                        UserName: result.UserName,
                        CollegeName: collegeName,
                        GradeYear: gradeYear,
                        Phone: "13776653627",
                        ClassName: className,
                        Memo: result.Memo
                    }
                }
                res.status(200);
                res.json(data);
            })
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