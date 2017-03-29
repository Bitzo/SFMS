var express = require('express');
var fs = require('fs');
var router = express.Router();
var url = require("url");
//添加客户时的路由
var customer = appRequire('routes/jinkebro/customer/customerroute');
var product = appRequire('routes/jinkebro/product/productroute');
var order = appRequire('routes/jinkebro/order/orderroute');
var staff = appRequire('routes/jinkebro/staff/staffroute');
var menu = appRequire('routes/jinkebro/wechat/menuroute');
//产品类别路由
var proTyperoute = appRequire('routes/jinkebro/productype/productyperoute');
//库存信息路由
var proStockroute = appRequire('routes/jinkebro/productstock/productstockroute');
//金科小哥主站点
var orderdelivery = appRequire('routes/jinkebro/orderdelivery/orderdeliveryroute');
//字典表
var datadict = appRequire('routes/jinkebro/datadict/datadictroute');

router.get('/', function (req, res, next) {
    res.render('sfms', { title: 'Hi jkbro' });
});

router.get('/jitinfo', function (req, res, next) {
    res.render('jinkeBro/jitinfo', { title: 'Hi jkbro' });
});
router.get('/jitorder', function (req, res, next) {
    res.render('jinkeBro/jitorder', { title: 'Hi jkbro' });
});

router.get('/jitorderAdd', function (req, res, next) {
    res.render('jinkeBro/jitorderAdd', { title: 'Hi jkbro' });
});
router.get('/jitorderEdit', function (req, res, next) {
    res.render('jinkeBro/jitorderEdit', { title: 'Hi jkbro' });
});

router.get('/jitgoods', function (req, res, next) {
    res.render('jinkeBro/jitgoods', { title: 'Hi jkbro' });
});

router.get('/jitgoodsAdd', function (req, res, next) {
    res.render('jinkeBro/jitgoodsAdd', { title: 'Hi jkbro' });
});

router.get('/jitgoodsEdit', function (req, res, next) {
    res.render('jinkeBro/jitgoodsEdit', { title: 'Hi jkbro' });
});

router.get('/jitstock', function (req, res, next) {
    res.render('jinkeBro/jitstock', { title: 'Hi jkbro' });
});

router.get('/jitstockAdd', function (req, res, next) {
    res.render('jinkeBro/jitstockAdd', { title: 'Hi jkbro' });
});

router.get('/jitstockedit', function (req, res, next) {
    res.render('jinkeBro/jitstockedit', { title: 'Hi jkbro' });
});

router.get('/jitstaffmanage', function (req, res, next) {
    res.render('jinkeBro/jitstaffmanage', { title: 'Hi jkbro' });
});

router.get('/jitstaffadd', function (req, res, next) {
    res.render('jinkeBro/jitstaffadd', { title: 'Hi jkbro' });
});

router.get('/jitstaffedit', function (req, res, next) {
    res.render('jinkeBro/jitstaffedit', { title: 'Hi jkbro' });
});

router.get('/jitdelivery', function (req, res, next) {
    res.render('jinkeBro/jitdelivery', { title: 'Hi jkbro' });
});
router.get('/jitproducttype', function (req, res, next) {
    res.render('jinkeBro/jitproducttype', { title: 'Hi jkbro' });
});
router.get('/wechatMenuManage', function (req, res, next) {
    res.render('jinkeBro/wechat/wechatMenuManage', { title: 'Hi jkbro' });
});
router.get('/wechatproductinfo', function (req, res, next) {
    res.render('jinkeBro/wechat/wechatproductinfo', { title: 'Hi jkbro' });
});
router.get('/wechatshowpersonalorder', function (req, res, next) {
    res.render('jinkeBro/wechat/wechatshowpersonalorder', { title: 'Hi jkbro' });
});


//管理产品类别
router.use('/proType', proTyperoute);

//完善客户的信息
router.use('/customer', customer);
//产品
router.use('/product', product);
//订单
router.use('/order', order);
//库存信息
router.use('/proStock', proStockroute);
//订单的配送员信息
router.use('/orderDelivery', orderdelivery);
//员工
router.use('/staff',staff);
//创建微信菜单
router.use('/createMenu',menu);
//字典表
router.use('/datadict',datadict);

module.exports = router;

