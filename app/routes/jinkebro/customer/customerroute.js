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
//加载中间件

var customer = appRequire('service/jinkebro/customer/customerservice');


router.post('/',function(req,res)
{
	var data = ['truename','phone','school','area','house','dormNum'];

	var err = 'require: ';

    for (var value in data) {

        if (!(data[value] in req.body.formdata)) {
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

    data = {
    	'CustomerUserName' : truename,
    	'Phone' : phone,
    	'AreaID' : area,
    	'DormID' : dromNum,
    	'HouseNum' : roomNum
    }

    customer.update(data,function(err,updateinfo)
    {
    	 if(err)
        {
            res.status(500);
            res.json(
            {
                code: 500,
                isSuccess: false,
                msg: '修改信息失败，服务器出错'
            });
            logger.writeError("修改信息失败，服务器出错");
            return;
        }

          if (updatinfo !== undefined && updatinfo.affectedRows != 0) {
            res.json({
                code: 200,
                isSuccess: true,
                msg: "修改信息成功"
            })
            logger.writeInfo("修改信息成功");
            return;
        } else {
            res.status(400);
            res.json({
                code: 400,
                isSuccess: false,
                msg: "修改信息失败"
            })
            logger.writeError("修改信息失败");
            return;
        }
    });

});