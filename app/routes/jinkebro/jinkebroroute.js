var express=require('express');
var router=express.Router();
//添加客户时的路由
var customer = appRequire('routes/jinkebro/customer/customerroute');

//产品类别路由
//var proTyperoute = appRequire('routes/jinkebro/productype/productyperoute');
//金科小哥主站点

router.get('/', function(req, res, next) {
        res.render('sfms', { title: 'Hi jkbro' });

});
//管理产品类别
//router.use('/proType', proTyperoute);

//完善客户的信息
router.use('/customer',customer);

module.exports=router;

