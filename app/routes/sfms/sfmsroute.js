var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require("url");
//实验室管理系统 项目管理路由
var project = appRequire('routes/sfms/project/projectroute');
var projectuser = appRequire('routes/sfms/project/projectuserroute');
var projectremark = appRequire('routes/sfms/project/projectremarkroute');
//实验室管理系统 签到信息管理路由
var sign = appRequire('routes/sfms/sign/signroute');
//实验室管理系统 KPI管理路由
var kpi = appRequire('routes/sfms/KPI/KPIroute');
//实验室管理系统 财务管理路由
var finance = appRequire('routes/sfms/finance/financeroute');
//实验室管理系统主站点
var userSpring = appRequire('service/backend/application/applicationservice');
var logger = appRequire('util/loghelper').helper;




router.get('/appedit', function(req, res, next) {
        console.log("here");
        var data = {
                ID: req.query.ID==null?"1":req.query.ID
        };
        userSpring.queryAllApp(data, function (err, results) {
                if (err) {
                        res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '查询失败，服务器出错'
                        });
                        logger.writeError('查询应用,出错信息: ' + err);
                        return;
                }
                if (results !== undefined && results.length != 0) {
                        res.render('sfms/appedit',{
                                code:200,
                                isSuccess: true,
                                data: results[0],
                                msg: '查找成功'
                        });
                        console.log(results);
                } else {
                        res.json({
                                code: 404,
                                isSuccess: false,
                                msg: '应用不存在'
                        });
                        logger.writeError('查询应用,出错信息: 查询用户不存在');
                        return;
                }
        });

});


router.get('/projectLead', function(req, res, next) {
        res.render('sfms/projectLead', { title: 'Hi sfms' });
});

router.get('/projectLeadEdit', function(req, res, next) {
        res.render('sfms/projectLeadEdit', { title: 'Hi sfms' });
});

router.get('/projectManage', function(req, res, next) {
        res.render('sfms/projectManage', { title: 'Hi sfms' });
});

router.get('/projectManageAdd', function(req, res, next) {
        res.render('sfms/projectManageAdd', { title: 'Hi sfms' });
});

router.get('/projectManageEdit', function(req, res, next) {
        res.render('sfms/projectManageEdit', { title: 'Hi sfms' });
});

router.get('/projectRemark', function(req, res, next) {
        res.render('sfms/projectRemark', { title: 'Hi sfms' });
});

router.get('/projectRemarkAdd', function(req, res, next) {
        res.render('sfms/projectRemarkAdd', { title: 'Hi sfms' });
});

router.get('/projectRemarkEdit', function(req, res, next) {
        res.render('sfms/projectRemarkEdit', { title: 'Hi sfms' });
});

router.get('/projectManageRemark', function(req, res, next) {
        res.render('sfms/projectManageRemark', { title: 'Hi sfms' });
});

router.get('/projectManageRemarkAdd', function(req, res, next) {
        res.render('sfms/projectManageRemarkAdd', { title: 'Hi sfms' });
});

router.get('/projectManageRemarkEdit', function(req, res, next) {
        res.render('sfms/projectManageRemarkEdit', { title: 'Hi sfms' });
});

router.get('/kpi', function(req, res, next) {
        res.render('sfms/kpi', { title: 'Hi sfms' });
});

router.get('/kpiAdd', function(req, res, next) {
        res.render('sfms/kpiAdd', { title: 'Hi sfms' });
});

router.get('/kpiEdit', function(req, res, next) {
        res.render('sfms/kpiEdit', { title: 'Hi sfms' });
});

router.get('/kpiManage', function(req, res, next) {
        res.render('sfms/kpiManage', { title: 'Hi sfms' });
});

router.get('/kpiManageAdd', function(req, res, next) {
        res.render('sfms/kpiManageAdd', { title: 'Hi sfms' });
});
router.get('/kpiManageCheck', function(req, res, next) {
        res.render('sfms/kpiManageCheck', { title: 'Hi sfms' });
});
router.get('/kpiCount', function(req, res, next) {
    res.render('sfms/kpiCount', { title: 'Hi sfms' });
});

router.get('/signManage', function(req, res, next) {
        res.render('sfms/signManage', { title: 'Hi sfms' });
});

router.get('/signPersonal', function(req, res, next) {
        res.render('sfms/signPersonal', { title: 'Hi sfms' });
});

router.get('/finance', function(req, res, next) {
        res.render('sfms/finance', { title: 'Hi sfms' });
});

router.get('/financeAdd', function(req, res, next) {
        res.render('sfms/financeAdd', { title: 'Hi sfms' });
});

router.get('/financeEdit', function(req, res, next) {
        res.render('sfms/financeEdit', { title: 'Hi sfms' });
});

router.get('/financeManage', function(req, res, next) {
        res.render('sfms/financeManage', { title: 'Hi sfms' });
});

router.get('/financeCharts', function(req, res, next) {
        res.render('sfms/financeCharts', { title: 'Hi sfms' });
});

router.get('/financeManageCheck', function(req, res, next) {
        res.render('sfms/financeManageCheck', { title: 'Hi sfms' });
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
router.get('/getappbyid', function (req, res) {
        //var pageNum = req.query.id;
        var data = {
                ID: req.query.ID==null?"1":req.query.ID
        };
        userSpring.queryAllApp(data, function (err, results) {
                        if (err) {
                                res.json({
                                        code: 500,
                                        isSuccess: false,
                                        msg: '查询失败，服务器出错'
                                });
                                logger.writeError('查询应用,出错信息: ' + err);
                                return;
                        }
                        if (results !== undefined && results.length != 0) {
                                res.json({
                                        code:200,
                                        isSuccess: true,
                                        data: results,
                                        msg: '查找成功'
                                });
                                console.log(results);
                        } else {
                                res.json({
                                        code: 404,
                                        isSuccess: false,
                                        msg: '应用不存在'
                                });
                                logger.writeError('查询应用,出错信息: 查询用户不存在');
                                return;
                        }
                });

});
//项目用户 有关路由
router.use('/api/projectuser', projectuser);
//项目管理 路由
router.use('/api/project', project);
//项目用户对项目备注 路由
router.use('/api/projectremark', projectremark);
//签到管理 路由
router.use('/api/sign', sign);
//绩效管理 路由
router.use('/api/kpi',kpi);
//财务管理 路由
router.use('/api/finance', finance);
module.exports = router;