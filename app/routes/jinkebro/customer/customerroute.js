/*
	
*/

var express = require('express');
var router = express.Router();
var url = require('url');
var moment = require('moment');
var operateconfig = appRequire("config/operationconfig");
var logger = appRequire('util/loghelper').helper;
//加载中间件
var express = require('express');
var router = express.Router();
var url = require('url');
var moment = require('moment');
var logger = appRequire('util/loghelper').helper;
var customer = appRequire('service/jinkebro/customer/customerservice');
// 
//加载中间件

    
//res.render('jinkeBro/wechat/customer.html',{title:'Hi jkbro'})

router.post('/', function (req, res) {
    console.log(req.headers.referer);
    var arr =req.headers.referer.split('/');
    var wechatusercode = arr[4];
    var data = ['truename', 'phone', 'school', 'area', 'house', 'dormNum'];

    var err = 'require: ';

    for (var value in data) {

        if (!(data[value] in req.body)) {
            ///if(data[value]!='Email'&&data[value]!='Address')
            err += data[value] + ' ';//检查post传输的数据
        }
    }

    if (err != 'require: ') {
        res.status(400);
        res.json({
            code: 400,
            isSuccess: false,
            msg: err
        });
        logger.writeError("缺少key值");
        return;
    }

    //插入要传入的值
    var truename = req.body.truename,
        phone = req.body.phone,
        school = req.body.school,
        area = req.body.area,
        dromNum = req.body.house,
        roomNum = req.body.dormNum;
        console.log("宿舍号为"+roomNum);
    data = {
        'CustomerUserName': truename,
        'Phone': phone,
        'AreaID': area,
        'DormID': dromNum,
        'HouseNum': roomNum
    }
    
    var queryData = {
        'WechatUserCode' : wechatusercode
    } 
    
   customer.query(queryData, function (err, queryInfo) {
        if (err) {
            console.log("查询失败");
            var errinfo = '在获取微信宿舍地址的时候查询失败';
            console.log(errinfo);
            return;
        }

        if (queryInfo != undefined && queryInfo.length != 0) {
            data.CustomerID = queryInfo[0].CustomerID;
            customer.update(data, function (err, updataInfo) {
                if (err) {
                    console.log("更新失败");
                    var errinfo = "获取宿舍地址时出错";
                    console.log(errinfo);
                    return;
                }
                if (updataInfo != undefined && updataInfo.affectedRows != 0) {
                    console.log("微信获取宿舍地址更新成功");
                    return;
                }
            });
        }
    });
   res.send("成功");

});

module.exports = router;