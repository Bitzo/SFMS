/**
 * @Author: Duncan
 * @Date:   2016-12-09
 * @Last Modified by:
 * @Last Modified time:
 * @Function : 微信的用户相关
 */

var customerDAL = appRequire('dal/jinkebro/customer/customerdal');
	moment = require('moment');
	logService = appRequire('service/backend/log/logservice');
//一个微信的用户类
 var Customer = function()
 {
 	
 	this.createTime =  moment().format("YYYY-MM-DD HH:mm:ss"),//创建的时间
 	this.isActive =1;//是否为有效的用户
 }

//用户的插入service
Customer.prototype.insert = function(data,callback) {
	 data.CreateTime = this.createTime;
	 data.IsActive = this.isActive;
	 //查询是否存在用户
	 this.query(data.WechatUserCode,function(err,result)
	 {
	 	if(err)
	 	{
	 		console.log("查询出现错误");
	 		return;
	 	}
	 	if(result != undefined && result.length != 0)
	 	{
	 		console.log("账户名已经存在了！");
	 		callback(true,result);
	 		return;
	 	}
	 	customerDAL.insert(data,function(err,results)
	 	{
	 		if(err)
	 		{
	 			console.log("插入失败");
	 			callback(true);
	 			return;
	 		}
	 		console.log("插入成功");
	 		callback(false,results);
	 	});
	 });
	
};

//用户的账户更新的service
Customer.prototype.update = function(data,callback) {
	customerDAL.update (data,function(err,result)
	{
		if(err)
		{
			callback(true);
			return;
		}
		callback(false,result);
	});
};

//用户的账户的查询
Customer.prototype.query = function(data,callback)
{
	customerDAL.query(data,function(err,result)
	{
		if(err)
		{
			callback(true);
			return;
		}
		callback(false,result);
	});
}
module.exports = new Customer();
