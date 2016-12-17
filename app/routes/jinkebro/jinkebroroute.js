var express=require('express');
var router=express.Router();
//产品类别路由
//var proTyperoute = appRequire('routes/jinkebro/productype/productyperoute');
//金科小哥主站点
router.get('/', function(req, res, next) {
        res.render('sfms', { title: 'Hi jkbro' });

});
//管理产品类别
//router.use('/proType', proTyperoute);

module.exports=router;

