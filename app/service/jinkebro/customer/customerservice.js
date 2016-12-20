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
	operationConfig = appRequire('config/operationConfig')
	logModel = appRequire('model/jinkebro/log/logmodel');
//一个微信的用户类
 var Customer = function()
 {
 	
 	this.createTime =  moment().format("YYYY-MM-DD HH:mm:ss");//创建的时间
 }

//用户的插入service
Customer.prototype.insert = function(data,callback) {
	 data.CreateTime = this.createTime;
	 	//插入
	 	for(var key in data)
	 	{
	 		if(data[key] === undefined)
	 		{
	 		logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '插入客户的信息时,用户信息为undefined';
            logModel.Action ='插入客户';
            logModel.Memo = '插入客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            return ;
	 		}
	 	}

	 	customerDAL.insert(data,function(err,results)
	 	{
	 		if(err)
	 		{
	 			//生成操作的日志
	 		logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '插入客户的信息时';
            logModel.Action ='插入客户';
            logModel.Memo = '插入客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            console.log("插入失败");
	 			return;
	 		}
	 		//生成操作的日志
	 		console.log("插入成功");
	 		callback(false,results);
	 	});
	
};

//用户的账户更新的service
Customer.prototype.update = function(data,callback) {
//判断传过来的数据是否未定义
var k=0;//用来判断是否存在WechatUserCode
for (var key in data)
	{
		if(key == "WechatUserCode")
		{
			k++;
		}
		if(data[key] === undefined)
		{
			logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '更新客户的信息时，有数据未定义';
            logModel.Action ='更新客户';
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
			console.log("更新的数据数据未定义");
			return ;
		}

	}
	if(k!=1)
	{
			logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '更新客户的信息时，更新数据的WechatUser未传，此值不能为空';
            logModel.Action ='更新客户';
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
		console.log("更新数据的WechatUser未传，此值不能为空");
		return ;
	}
	customerDAL.update (data,function(err,result)
	{
		if(err)
		{
			logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '更新客户的信息时';
            logModel.Action ='更新客户';
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2,
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
			console.log("更新失败，sql的检查");
			callback(true);
			return;
		}
		callback(false,result);
	});
};

//用户的账户的查询
Customer.prototype.query = function(data,callback)
{
	for (var key in data)
	{
		if(data[key] === undefined)
		{
			logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '查询客户的信息时，有数据未定义';
            logModel.Action ='查询客户';
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2,
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
			console.log("查询的数据数据未定义");
			return ;
		}
	}
	customerDAL.query(data,function(err,result)
	{
		if(err)
		{
			logModel.ApplicationID=1;
			logModel.ApplicationName="金科小哥";
			logModel.OperationName= '查询客户的信息时';
            logModel.Action ='查询客户';
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = 2,
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            console.log("查询数据失败");
			callback(true);
			return;
		}
		callback(false,result);
	});
}
module.exports = new Customer();
