/**
 * @Author: Duncan
 * @Date: 2016-11-15 14:22
 * @Last Modified by: Duncan
 * @Last Modified time: 2016-11-15 14:22
 * @Function: 角色对应功能点,角色功能点的
 */


var userRoleDAL= appRequire('dal/backend/user/userroledal');

//勾选对应的功能,更改对应的功能

exports.insert=function(data,callback){
	userRoleDAL.insert(data,function(err)
	{
		if(err)
		{
			callback(true);
			return;
		}
		callback(false);
	});

};

exports.updateUserRole=function(data,callback)
{
	userRoleDAL.updateUserRole(data,function(err,results)
	{
		if(err)
		{
			
			callback(true);
			return;
		}
		console.log('updateUserRole');
		callback(false,results);
	})
}