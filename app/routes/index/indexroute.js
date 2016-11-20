var express = require('express');
var router = express.Router();

//login


router.get('/', function(req, res, next) {
        res.render('backend\\index', { title: 'Hi ijjjex' });
});

module.exports = router;