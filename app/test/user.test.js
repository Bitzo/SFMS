/**
 * @Author: Duncan
 * @Date: 2016/11/20 16:00
 * @Last Modified by: 
 * @Last Modified time: 
 * @Function: user的插入测试
 */

require('../global_bootstrap');
var should =require('should');
var userService=appRequire('service/backend/user/userservice');
var userRoleService=appRequire('service/backend/user/userroleservice')

var data={
	'ApplicationID':1,
	'Account':"测试名字",
	'UserName':"单元测试的名字",
	'Pwd':'123456',
	'CreateTime':'2016-11-11 00:00:00',
	'CreateUserID':1,
	'IsActive':1
}
insertUserID=-1;

describe("用户功能单元测试",function()
{
	it("用户新增",function(done)
	{
		userService.insert(data,function(err,results)
		{
			if(err) return done(err);
			results.insertId.should.be.above(0).and.should.be.a.Number;
			insertUserID=results.insertId;
			done();
		});
	});

	it("用户信息的编辑",function(done)
	{
		data.AccountID=insertUserID;
		data.Memo="测试用户的信息编辑";
		data.IsActive=0;
		userService.update(data,function(err,results)
		{
			if(err)
			{
				return done(err);
			}
			results.affectedRows.should.be.above(0).and.should.be.a.Number;
			done();
		});
	});
	it ("用户角色的添加",function(done)
	{
		data={'RoleID':0,
		'AccountID':insertUserID
		}//RoleID为0,测试的RoleID值
		userRoleService.insert(data,function(err,results)
		{
			if(err)
			{
				return done(err);
			}
			results.insertId.should.be.above(0).and.should.be.a.Number;
			done();
		});
		
	});
})
