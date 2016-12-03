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
var kpi = appRequire('routes/sfms/KPI/KPIroute')
//实验室管理系统主站点


router.get('/index', function(req, res, next) {
        res.render('sfms/index', { title: 'Hi sfms' });

});

router.get('/user', function(req, res, next) {
        res.render('sfms/user', { title: 'Hi sfms' });

});

router.get('/user-info', function(req, res, next) {
        res.render('sfms/user-info', { title: 'Hi sfms' });

});

router.get('/application', function(req, res, next) {
        res.render('sfms/application', { title: 'Hi sfms' });

});

router.get('/application-info', function(req, res, next) {
        res.render('sfms/application-info', { title: 'Hi sfms' });

});

router.post('/getmenu', function(req, res, next) {
        //res.render('sfms/index', { title: 'Hi gemeun' });
        fs.readFile('public/data/menu.json','utf-8',function(err,data) {

            if (!err) {
                    var arr =JSON.parse(data);

                    var query = req.body;
                    console.log(query);

                    var  text=query.f.text==null?"":query.f.text;
                    var newarr= arr.filter(function(o){
                            console.log(o.text);
                            console.log(text);
                            return o.text.indexOf(text)>=0;
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
router.use('/projectuser', projectuser);
router.use('/project', project);
router.use('/sign', sign);
router.use('/kpi',kpi);
module.exports = router;