/**
 * @Author: Duncan
 * @Date:   2016-12-09
 * @Last Modified by:
 * @Last Modified time:
 * @Function : 微信的用户相关
 */

var customerDAL = appRequire('dal/jinkebro/customer/customerdal');
	moment = require('moment');
//一个微信的用户类
 var Customer = function()
 {
 	//问题:这些参数好像都没用到
 	//从微信端获取的数据
 	//必填的
 	//this.wechatUserCode = '';//微信的openid
 	//this.sex= 0;//性别默认为0 为男
 	//this.nickName = '';//昵称
 	//可为空的
 	//this.province = '';//省
 	//this.country = '';//国家
 	//this.city = '';//城市
 	this.createTime =  moment().format("YYYY-MM-DD HH:mm:ss"),//创建的时间
 	//this.memo = ''//备注
 	this.isActive =1;//是否为有效的用户
 	//从个人信息获取到的消息
 	// this.customerAccount ='';//用户的账户名
 	// this.areaID = 0;//用户所在的区
 	// this.dormID = 0;//用户的楼栋
 	// this.houseNum = 0;//用户的门号
 	// this.balanceNum = 0;//用户的余额
 	// this.creditPoint = 0;//用户的积分
 	// this.memberLevelID = 0;//用户的会员等级
 	// this.phone = '';//用户的电话号码
 	// this.customerUserName = '';//用户的使用姓名
 }

//用户的插入service
Customer.prototype.insert = function(data,callback) {
	 data.CreateTime = this.createTime;
	 data.IsActive = this.isActive;
	 customerDAL.insert(data,function(err,results)
	 {
	 	if(err)
	 	{
	 		callback(true);
	 		return;
	 	}
	 	callback(false,results);
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
module.exports = new Customer();
