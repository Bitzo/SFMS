var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require("url");
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

router.get('/userinfo', function(req, res, next) {
        res.render('sfms/userinfo', { title: 'Hi sfms' });

});

router.get('/menu', function(req, res, next) {
        res.render('sfms/menu', { title: 'Hi sfms' });

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

module.exports = router;