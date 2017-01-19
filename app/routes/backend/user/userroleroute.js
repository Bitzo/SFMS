/**
 * @Author: Duncan
 * @Date: 2016/11/13 19:04
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/08 20:04
 * @Function: 角色的勾选，角色的修改
 */

var express = require('express'),
	url = require('url'),
	router = express.Router(),
	logger = appRequire('util/loghelper').helper;

//菜单业务、用户业务逻辑组件
var userRole = appRequire('service/backend/user/userroleservice'),
	menuService = appRequire('service/backend/menu/menuservice'),
	userService = appRequire('service/backend/user/userservice');


router.post('/', function (req, res) {
	var data = ['AccountID', 'RoleID'];
	var err = 'require: ';
	for (var value in data) {
		console.log(data[value]);
		if (!(data[value] in req.body)) {
			err += data[value] + ' ';
		}
	}

	if (err != 'require: ') {
		res.status(400);
		res.json({
			code: 400,
			isSuccess: false,
			msg: err
		});
		logger.writeError(err);
		return;
	}

	//获取参数
	var ID = req.body.ID,
		accountID = req.body.AccountID,
		roleID = req.body.RoleID;

	data = {
		'AccountID': accountID,
		'RoleID': roleID
	}

	//判断传过来的数据是否为空
	var requireValue = '缺少值：';
	for (var value in data) {

		if (data[value].length == 0) {
			requireValue += value + ' ';
		}
	}

	if (requireValue != '缺少值：') {
		res.status(400);
		res.json({
			code: 400,
			isSuccess: false,
			msg: requireValue
		});
		logger.writeError("[routes/backend/user/userroleroute--------------67行]" + requireValue);
		return;
	}
	userRole.insert(data, function (err, results) {
		if (err) {
			res.status(404);
			res.json({
				code: 404,
				isSuccess: false,
				msg: '操作失败'
			});
			logger.writeError("[routes/backend/user/userroleroute---------------78行]用户插入失败");
			return;
		}
		if (results.insertId != 0) {
			res.json({
				code: 200,
				isSuccess: true,
				msg: '操作成功'
			});
			return;
		}

	});
});

router.put('/', function (req, res) {
	var data = ['ID', 'AccountID', 'RoleID'];
	var err = 'required: ';
	for (var value in data) {
		if (!(data[value] in req.body)) {
			console.log("require: " + data[value]);
			err += data[value] + ' ';
		}
	}
	console.log(req.params)
	if (err != 'required: ') {
		res.status(400);
		res.json({
			code: 400,
			isSuccess: false,
			msg: err
		});
		logger.writeError("[routes/backend/user/userroleroute]" + err);
		return;
	}

	var ID = req.body.ID,
		accountID = req.body.AccountID,
		roleID = req.body.RoleID;

	var data = {
		"ID": ID,
		"AccountID": accountID,
		"RoleID": roleID
	}

	userRole.updateUserRole(data, function (err, results) {
		if (err) {
			res.status(500);
			res.json(
				{
					code: 500,
					isSuccess: false,
					msg: '操作失败，服务器出错'
				});
			logger.writeError("[routes/backend/user/userroleroute---------------133行]" + "修改信息失败，服务器出错");
			return;
		}
		if (results !== undefined && results.affectedRows != 0) {
			res.json({
				code: 200,
				isSuccess: true,
				msg: "操作成功"
			})
			return;
		} else {
			res.status(400);
			res.json({
				code: 400,
				isSuccess: false,
				msg: "操作失败"
			});
			logger.writeError("[routes/backend/user/userroleroute---------------150行]" + "修改信息失败");
			return;
		}
	})
});

//根据UserID获取用户的菜单和角色信息
router.get('/', function (req, res) {
	var userID = req.query.jitkey;
	if (userID === undefined || userID === '') {
		res.status(400);
		return res.json({
			code: 404,
			isSuccess: false,
			msg: 'require userID'
		});
	}
	if (isNaN(userID)) {
        res.status(400);
        return res.json({
			code: 400,
			isSuccess: false,
			msg: 'userID不是数字'
		});
	}
	var uniqueData = {
		"userID": userID
	};

	//判断user是否存在
	userService.querySingleID(userID, function (err, result) {
		if (err) {
            res.status(500);
            return res.json({
				code: 500,
				isSuccess: false,
				msg: '服务器出错'
			});
		}
		//user存在，则可以进行查询
		if (result !== undefined && result.length != 0) {
			menuService.queryMenuAndRoleByUserID(uniqueData, function (err, results) {
				if (err) {
                    res.status(500);
                    return res.json({
						code: 500,
						isSuccess: false,
						msg: '服务器出错'
					});

				}

				if (results.Menu !== undefined && results.Menu.length != 0) {
					if (results.Role !== undefined && results.Role.length != 0) {
                        res.status(200);
                        return res.json({
							code: 200,
							isSuccess: true,
							data: results,
							msg: '查询菜单和角色成功'
						});
					} else {
                        res.status(200);
                        return res.json({
							code: 404,
							isSuccess: false,
							msg: '未查到角色'
						});
					}

				} else {
                    res.status(200);
                    return res.json({
						code: 404,
						isSuccess: false,
						msg: '未查到菜单'
					});
				}
			});
		} else {
            res.status(400);
            return res.json({
				code: 400,
				isSuccess: false,
				msg: '用户不存在'
			});
		}
	});

});

router.get('/', function (req, res) {
	var query = JSON.parse(req.query.f);
	var accountID = query.userID;
	var data = {
		'AccountID': accountID
	};

	if (isNaN(data.AccountID)) {
		res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: 'AccountID不是数字'
        });
	};

	userRole.query(data, function (err, RoleInfo) {
		if (err) {
			res.status(500);
			res.json({
				code: 500,
				isSuccess: true,
				msg: '查询失败'
			});
			console.log("查询失败");
			logger.writeError("[routes/backend/userrole]" + "查询失败");
			return;
		}
		if (RoleInfo == undefined && RoleInfo.length == 0) {
			res.status(200);
			res.json({
				code: 500,
				isSuccess: false,
				msg: "未查到数据"
			});
			logger.writeWarn("[routes/backend/user/userroleroute]" + "未查到数据");
			return;
		}

		if (RoleInfo != undefined && RoleInfo.length != 0) {
			res.status(200);
			var results = {
				code: 200,
				isSuccess: true,
				msg: '查询成功',
				data: RoleInfo
			};
			return;
		}
	});

});
router.get('/userID/:userID', function (req, res) {
	var userID = req.params.userID;
	if (userID === undefined || userID === '') {
        res.status(400);
        return res.json({
			code: 404,
			isSuccess: false,
			msg: 'require userID'
		});
	}
	if (isNaN(userID)) {
        res.status(400);
        return res.json({
			code: 400,
			isSuccess: false,
			msg: 'userID不是数字'
		});
	}
	var uniqueData = {
		"userID": userID
	};

	//判断user是否存在
	userService.querySingleID(userID, function (err, result) {
		if (err) {
            res.status(500);
            return res.json({
				code: 500,
				isSuccess: false,
				msg: '服务器出错'
			});
		}
		//user存在，则可以进行查询
		if (result !== undefined && result.length != 0) {
			menuService.queryMenuAndRoleByUserID(uniqueData, function (err, results) {
				if (err) {
                    res.status(500);
                    return res.json({
						code: 500,
						isSuccess: false,
						msg: '服务器出错'
					});

				}

				if (results.Menu !== undefined && results.Menu.length != 0) {
					if (results.Role !== undefined && results.Role.length != 0) {
						return res.json({
							code: 200,
							isSuccess: true,
							data: results,
							msg: '查询菜单和角色成功'
						});
					} else {
                        res.status(200);
                        return res.json({
							code: 404,
							isSuccess: false,
							msg: '未查到角色'
						});
					}

				} else {
					return res.json({
						code: 404,
						isSuccess: false,
						msg: '未查到菜单'
					});
				}
			});
		} else {
			return res.json({
				code: 404,
				isSuccess: false,
				msg: '用户不存在'
			});
		}
	});

});

module.exports = router;