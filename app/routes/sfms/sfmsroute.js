var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require("url");
//实验室管理系统 项目管理路由
var project = appRequire('routes/sfms/project/projectroute');
var projectuser = appRequire('routes/sfms/project/projectuserroute');
//实验室管理系统 签到信息管理路由
var sign = appRequire('routes/sfms/sign/signroute');
//实验室管理系统 KPI管理路由
var kpi = appRequire('routes/sfms/KPI/KPIroute');
//实验室管理系统 财务管理路由
var finance = appRequire('routes/sfms/finance/financeroute');
//实验室管理系统主站点


router.get('/index', function(req, res, next) {
        res.render('sfms/index', { title: 'Hi sfms' });

});

router.get('/user', function(req, res, next) {
        res.render('sfms/user', { title: 'Hi sfms' });

});

router.get('/role', function(req, res, next) {
        res.render('sfms/role', { title: 'Hi sfms' });

});

router.get('/roleAdd', function(req, res, next) {
    res.render('sfms/roleAdd', { title: 'Hi sfms' });

});

router.get('/roleEdit', function(req, res, next) {
    res.render('sfms/roleEdit', { title: 'Hi sfms' });

});

router.get('/userinfo', function(req, res, next) {
        res.render('sfms/userinfo', { title: 'Hi sfms' });

});

router.get('/menu', function(req, res, next) {
        res.render('sfms/menu', { title: 'Hi sfms' });

});

router.get('/menuadd', function(req, res, next) {
        res.render('sfms/menuadd', { title: 'Hi sfms' });

});

router.get('/application', function(req, res, next) {
        res.render('sfms/application', { title: 'Hi sfms' });

});

router.get('/application-info', function(req, res, next) {
        res.render('sfms/application-info', { title: 'Hi sfms' });

});

router.get('/getmenu', function(req, res, next) {
        //res.render('sfms/index', { title: 'Hi gemeun' });
        fs.readFile('public/data/menu.json','utf-8',function(err,data) {

            if (!err) {
                    var arr =JSON.parse(data);

                    var query = req.query;
                    console.log(query);
                    var text ="";
                    var id="";
                    if(query.f!='{}')
                    {    var f= JSON.parse(query.f);
                         text = f.text==null?"":f.text;
                            id=f.id;
                    }


                    //console.log(query.f.text);
                    var newarr= arr.filter(function(o){
                            console.log(o.text);
                            console.log(text);
                            console.log(id);
                            console.log(o.text.indexOf(text)>=0&&o.id.indexOf(id)>=0);
                            return o.text.indexOf(text)>=0&&o.id.indexOf(id)>=0;
                    });

                    var  pageindex= query.pageindex;
                    var  pagesize= query.pagesize;
                    console.log("pagesize,pageindex"+pagesize+pageindex+arr.length);
                    var resdata= newarr.slice((pageindex-1)*pagesize,pageindex*pagesize);

                    console.log(resdata);
                    console.log(arr);
                    res.json({issuccess:true,datas: JSON.stringify(resdata),total:newarr.length});
            } else {
                    res.json({issuccess:false});
            }

        });

});
//项目用户 有关路由
router.use('/projectuser', projectuser);
//项目管理 路由
router.use('/project', project);
//签到管理 路由
router.use('/sign', sign);
//绩效管理 路由
router.use('/kpi',kpi);
//财务管理 路由
router.use('/finance', finance);
module.exports = router;