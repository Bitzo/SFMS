var express = require('express');
var router = express.Router();

//实验室管理系统主站点
router.get('/', function(req, res, next) {
    res.render('sfms', { title: 'Hi sfms' });
});


module.exports = router;