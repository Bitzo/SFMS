var express=require('express');
var fs = require('fs');
var router=express.Router();
var url = require("url");
//添加客户时的路由
var customer = appRequire('routes/jinkebro/customer/customerroute');

//产品类别路由
//var proTyperoute = appRequire('routes/jinkebro/productype/productyperoute');
//金科小哥主站点

router.get('/', function(req, res, next) {
	res.render('sfms', { title: 'Hi jkbro' });
});

router.get('/jitinfo', function(req, res, next) {
    res.render('jinkeBro/jitinfo', { title: 'Hi jkbro' });
});

//管理产品类别
//router.use('/proType', proTyperoute);

//完善客户的信息
router.use('/customer',customer);

router.get('/book',function(req,res)
{  
	fs.readFile(__dirname+'/index.html','utf-8',function(err,data)
	{
		if(err)
		{
			console.log('读取文件的时候出错');
		}
		else
		{
			console.log('sdada');
			res.set('Content-Type','text/html');
			res.send(new Buffer(data));
		}
	})
	
	//res.render('jinkeBro/wechat/customer.html',{title:'Hi jkbro'});
});




module.exports = router;

