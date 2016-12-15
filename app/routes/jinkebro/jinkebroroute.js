var express=require('express');
var router=express.Router();
//金科小哥主站点
router.get('/', function(req, res, next) {
        res.render('sfms', { title: 'Hi jkbro' });

});
module.exports=router;

