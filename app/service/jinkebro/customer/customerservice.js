/**
 * @Author: Duncan
 * @Date:   2016-12-09
 * @Last Modified by:
 * @Last Modified time:
 * @Function : 微信的用户相关
 */

var customerDAL = appRequire('dal/jinkebro/customer/customerdal'),
	moment = require('moment'),
	logService = appRequire('service/backend/log/logservice'),
	logModel = appRequire('model/jinkebro/log/logmodel');
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
	 		//生成操作的日志
	 		console.log("查询出现错误");
	 		logModel.OperationName= '查询存在的用户';
            logModel.Action ='查询存在的用户';
            logModel.Memo = '查询存在的用户失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
	 		return;
	 	}

	 	if(result != undefined && result.length != 0)
	 	{
	 		//生成操作的日志console.log
	 		logModel.OperationName= '查询存在的用户';
            logModel.Action ='查询存在的用户';
            logModel.Memo = '查询存在的用户成功';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
	 		callback(true,result);
	 		return;
	 	}

	 	//插入
	 	customerDAL.insert(data,function(err,results)
	 	{
	 		if(err)
	 		{
	 			//生成操作的日志
	 		console.log("插入失败");
	 		logModel.OperationName= '插入用户';
            logModel.Action ='插入用户';
            logModel.Memo = '插入用户失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
	 			callback(true);
	 			return;
	 		}
	 		//生成操作的日志
	 		console.log("插入成功");
	 		logModel.OperationName= '插入用户';
            logModel.Action ='插入用户';
            logModel.Memo = '插入用户成功';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
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
