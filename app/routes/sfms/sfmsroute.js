var express = require('express');
var router = express.Router();

//实验室管理系统主站点


router.get('/', function(req, res, next) {
        res.render(' ', { title: 'Hi sfms' });

});


module.exports = router;