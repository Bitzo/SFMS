/**
 * @Author: Duncan
 * @Date: 2016-11-15 14:22
 * @Last Modified by: Duncan
 * @Last Modified time: 2016-11-15 14:22
 * @Function: 角色对应功能点增加
 */


var userRoleDAL = appRequire('dal/backend/user/userroledal');

//勾选对应的功能,更改对应的功能

exports.insert = function (data, callback) {
	userRoleDAL.insert(data, function (err, results) {
		for (var key in data) {
			if (key == undefined) {
				console.log("传来的值有部分为空");
				return;
			}
		}
		if (err) {
			callback(true);
			return;
		}
		callback(false, results);
	});

};

exports.updateUserRole = function (data, callback) {
	userRoleDAL.updateUserRole(data, function (err, results) {
		if (err) {

			callback(true);
			return;
		}

		callback(false, results);
	})
}

//根据用户ID 查询所在的项目
exports.queryAppByUserID = function (data, callback) {
    /**
	 * data = {
	 * 	  UserID: id
	 * }
     */
	userRoleDAL.queryAppByUserID(data, function (err, results) {
		if (err) {
			callback(true, '查询失败');
			return;
		}
		
		console.log("查询用户所在的项目");
        callback(false, results);
    })
};

//根据用户的AccountID 来获取用户角色的ID号
exports.query = function (data, callback) {
	//用来判断是否存在AccountID
	var k = 0;
	for (var key in data) {
		if (key == 'AccountID') {
			k++;
		}
	}

	if (k != 1) {
		console.log("不存在AccountID");
		return;
	}


	userRoleDAL.queryAllRoles(data, function (err, results) {
		if (err) {
			console.log("查询出错");
			return;
		}

		callback(false, results);
	})


}