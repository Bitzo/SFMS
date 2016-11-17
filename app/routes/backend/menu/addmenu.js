var express = require('express');
var router = express.Router();
var url = require('url');

//菜单业务逻辑组件
var menuService = appRequire('service/backend/menu/menuservice');

//新增菜单
router.post('/',function(req,res,next) {

	// 检查所需要的字段是否都存在
	var data = ['ApplicationID','MenuLevel','ParentID','SortIndex','MenuName','IconPath','Url','Memo','IsActive'];
	var err = 'require: ';
	for (var value in data){
		if(!(data[value] in req.body)){
			err += data[value] + ' ';
		}
	}

	if(err !== 'require: ') {
		res.json({
			code:400,
			isSuccess: false,
			msg: err
		});
		return ;
	}
	var applicationID = req.body.ApplicationID;
	var menuLevel = req.body.MenuLevel;
	var parentID = req.body.ParentID;
	var sortIndex = req.body.SortIndex;
	var menuName = req.body.MenuName;
	var iconPath = req.body.IconPath;
	var url = req.body.Url;
	var memo = req.body.Memo;
	var isActive = req.body.IsActive;

	// 存放接收的数据
	var data = {
		"ApplicationID" : applicationID ,
		"MenuLevel" : menuLevel,
		"ParentID" : parentID,
		"SortIndex" : sortIndex,
		"MenuName" : menuName,
		"IconPath" : iconPath,
		"Url" :url,
		"Memo" : memo,
		"IsActive" : isActive
	};

	menuService.menuInsert(data,function (err,result) {
		if(err){
			res.json({
				code : 500,
				isSuccess : false,
				msg : '菜单新增失败，服务器出错'
			});
			return ;
		}

		console.log(result);

		if(result !== undefined && result.affectedRows === 1){
			res.json({
				code : 200,
				isSuccess : true,
				msg : '一条菜单记录添加成功'
			});
		}
	});

});


module.exports = router;