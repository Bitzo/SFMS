var express = require('express');
var router = express.Router();
var addMenu = appRequire('routes/backend/menu/addmenu');
var queryAllMenus = appRequire('routes/backend/menu/queryallmenus');
var updateMenu = appRequire('routes/backend/menu/updatemenu');
//主应用主站点
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi JinkeBro' });
});




router.use('/addmenu',addMenu);
router.use('/queryallmenus',queryAllMenus);
router.use('/updatemenu',updateMenu);



// router.get('/addmenu',function(req,res,next) {
// 	res.json({
// 		title : 'zengjiacaidanjiemian'
// 	});
// });
module.exports = router;
