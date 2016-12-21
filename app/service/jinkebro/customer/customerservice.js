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
	operationConfig = appRequire('config/operationConfig'),
    config = appRequire('config/config'),
	logModel = appRequire('model/jinkebro/log/logmodel');
var wechat = appRequire("service/wechat/wechatservice");
wechat.token = config.weChat.token;

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
	 		logModel.ApplicationID=operationConfig.jinkeBroApp.applicationID;
			logModel.ApplicationName=operationConfig.jinkeBroApp.applicationName;
			logModel.OperationName= '插入客户的信息时,用户信息为undefined';
            logModel.Action =operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
            logModel.Memo = '新增客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.jinkeBroApp.operationType.operation;
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
	 		logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
			logModel.ApplicationName=operationConfig.jinkeBroApp.applicationName;
			logModel.OperationName= '插入客户的信息失败';
            logModel.Action =operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
            logModel.Memo = '插入客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.jinkeBroApp.operationType.operation;
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
for (var key in data)
	{
		if(data[key] === undefined)
		{
			logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
			logModel.ApplicationName=operationConfig.jinkeBroApp.applicationName;
			logModel.OperationName= '更新客户的信息时，有数据未定义';
            logModel.Action =operationConfig.jinkeBroApp.customerManage.customerUpd.actionName;
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.jinkeBroApp.operationType.operation;
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

	customerDAL.update (data,function(err,result)
	{
		if(err)
		{
			logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
			logModel.ApplicationName=operationConfig.jinkeBroApp.applicationName;
			logModel.OperationName= '更新客户的信息时出错';
            logModel.Action =operationConfig.jinkeBroApp.customerManage.customerUpd.actionName;
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.jinkeBroApp.operationType.operation;
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
			logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
			logModel.ApplicationName=operationConfig.jinkeBroApp.applicationName;
			logModel.OperationName= '查询客户的信息时，有数据未定义';
            logModel.Action =operationConfig.jinkeBroApp.customerManage.customerQuery;
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.jinkeBroApp.operationType.operation;
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
			logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
			logModel.ApplicationName=operationConfig.jinkeBroApp.applicationName;
			logModel.OperationName= '查询客户的信息时';
            logModel.Action =operationConfig.jinkeBroApp.customerManage.customerQuery;
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.jinkeBroApp.operationType.operation;
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


// //用户添加的时候，订阅的时候的增加数据
Customer.prototype.addSubscibe=function(token,msg,callback)
{

//用类中的函数
    me = this;

	//获取用户的信息
	 wechat.getCustomerInfo(token,msg.FromUserName,function(info)
                {
                    console.log(info);
                    var data = {
                        'WechatUserCode':info.openid
                    };
                        //获取用户的信息
                        data.Sex=info.sex;
                        data.NickName=info.nickname;
                        data.IsActive = 1;
                        if(info.city.length !=0)
                        {
                            data.City = info.city;
                        }                      
                        if(info.province.length !=0)
                        {
                            data.Province = info.province; 
                        }
                        if(info.country.length !=0)
                        {
                            data.Country=info.country;
                        }
                        if(info.remark.length !=0)
                        {
                            data.Memo = info.remark;
                        }

                         //根据WechatUserCode来查询是否存在这个用户
                         var queryInfo = {
                            'WechatUserCode':info.openid
                        };
                        console.log(queryInfo);

                         //开始查询是否存在用户
                         me.query(queryInfo,function(err,resultInfo)
                         {
                            if(err)
                            {
                                console.log("查询失败");
                                var errinfo = '在添加用户的时候查询失败';
                                callback(true,errinfo);
                                return ;
                            }

                            if(resultInfo != undefined && resultInfo.length != 0)
                            {
                                console.log("用户名已经存在");
                                //当用户名存在做更新操作
                                me.update(data,function(err,updataInfo)
                                {
                                    if(err)
                                    {
                                        var errinfo='关注的时候二次关注更新失败';
                                        console.log("更新失败");
                                        callback(true,errinfo);
                                        return;
                                    }
                                    if(updataInfo != undefined &&updataInfo.affectedRows !=0)
                                    {
                                        console.log("更新成功");
                                        callback(false,'');
                                        return;
                                    }
                                });
                            }
                            else
                            {
                                //用户名不存在的时候做插入的操作
                                wechatCustomer.insert(data,function(err,insertInfo)
                                {
                                   if(err)
                                   {
                                    console.log("插入失败");
                                    var errinfo = '当插入客户信息失败';
                                    callback(true,errinfo);
                                    return;
                                }
                                if(insertInfo != undefined &&insertInfo.affectedRows !=0)
                                {
                                    console.log("插入成功");
                                    callback(false,'');
                                    return;
                                }
                            });
                            }
                       });
});
}


//取消关注的人
Customer.prototype.unsubscribe =function(token,msg,callback)
{

    //用类中的函数
    me = this;
    console.log(me.createTime);
    console.log(token);
    wechat.getCustomerInfo(token,msg.FromUserName,function(info)
    {
        console.log(me.createTime);
        var data = {
            'WechatUserCode':info.openid
        }
        data.IsActive = 0;

        //直接更新
        me.update(data,function(err,updataInfo)
        {
            if(err)
            {
                console.log("更新失败");
                var errinfo = '取消关注时更新失败';
                callback(true,errinfo);
                return;
            }

            if(updataInfo != undefined &&updataInfo.affectedRows !=0)
            {
                console.log("更新成功");
                callback(false);
                return;
            }
        });
    });
}

//添加获取地址的模块
Customer.prototype.addLocation = function(msg,callback)
{
    //获取地址事件者的openid
        var locationData = {
            'WechatUserCode':msg.FromUserName,
            'Lon':msg.Longitude,
            'Lat':msg.Latitude
        }

        this.update(locationData,function(err,updataInfo)
        {
            if(err)
            {
                console.log("更新失败");
                var errinfo = "获取地址时出错";
                callback(true,errinfo);
                return;
            }
            if(updataInfo != undefined &&updataInfo.affectedRows !=0)
            {
                console.log("更新成功");
                callback(false);
                return;
            }
        });
}

//关于添加微信的所有列表
Customer.prototype.addAllList = function(token,callback)
{
    me = this;
    //获取所有的列表
    wechat.getCustomerList(token,function(infoList)
    {
        for(var key in infoList.data.openid)
        {
            //查询是否存在这个微信号
            var queryInfo = {
                'WechatUserCode':infoList.data.openid[key]
            };

            //查询用户是否出错
            me.query(queryInfo,function(err,resultInfo)
            {
                if(err)
                {
                    console.log("查询失败");
                    var errinfo = '在添加用户的时候查询失败';
                    callback(true,errinfo);
                    return ;
                }

                if(resultInfo != undefined && resultInfo.length != 0)
                {
                    console.log("用户名已经存在");
                    return;
                }

                wechat.getCustomerInfo(token,infoList.data.openid[key],function(info)
                {

                });
            });
        }
    });
}

module.exports = new Customer();
