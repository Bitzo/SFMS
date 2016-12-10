/**
 * @Author: Duncan
 * @Date:   2016-12-09
 * @Last Modified by:
 * @Last Modified time:
 * @Function : 微信的用户相关
 */

var customerDAL = appRequire('dal/wehcat/customerdal')
//一个微信的用户类
 var Customer = function()
 {
 	
 	//从微信端获取的数据
 	//必填的
 	this.wechatUserCode = '';//微信的openid
 	this.sex= 0;//性别默认为0 为男
 	this.nickName = '';//昵称
 	//可为空的
 	this.province = '';//省
 	this.country = '';//国家
 	this.city = '';//城市
 	this.createTime= 0;//创建的时间
 	this.memo ='';
 	//从个人信息获取到的消息
 	this.customerAccount ='';//用户的账户名
 	this.dormID = 0;//用户的楼栋
 	this.houseNum = 0;//用户的门号
 	this.balanceNum = 0;//用户的余额
 	this.creditPoint = 0;//用户的积分
 	this.memberLevelID = 0;//用户的会员等级
 	this.phone = '';//用户的电话号码
 	this.customerUserName = '';//用户的使用姓名
 }

//用户的插入service
Customer.prototype.insert = function(callback) {
	// customerDAL = insert
	//2016-12-9 先搭一个框子，下面同理
};

//用户的账户更新的service
Customer.prototype.update = function(first_argument) {
	// body...
};
module.exports = new Customer();
