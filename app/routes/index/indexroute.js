var express = require('express');
var router = express.Router();

//主页面


router.get('/', function(req, res, next) {
        res.render('backend\\index', { title: '后台用户主页面' });
});

module.exports = router;