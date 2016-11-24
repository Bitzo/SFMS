/**
 * @Author: Duncan
 * @Date: 2016/11/13 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/17 12:04
 * @Function: 角色的勾选，角色的修改
 */

 var express=require('express');
 var url=require('url');
 var router=express.Router();
 var logger=appRequire('util/loghelper').helper;
 var userRole=appRequire('service/backend/user/userroleservice');
 
 router.post('/',function(req,res)
 {	
 	var data=['AccountID','RoleID'];
 	var err='require: ';
 	for(var value in data)
 	{
 		console.log(data[value]);
 		if(!(data[value] in req.body))
 		{
 			err+=data[value]+' ';
 		}
 	}

 	if(err!='require: ')
 	{
 		res.json({
 			code:500,
 			isSuccess:false,
 			msg:err
 		});
 		logger.writeError(err);
 		return ;
 	}

 			//获取参数
 			var ID=req.body.ID;
 			var accountID=req.body.AccountID;
 			var roleID=req.body.RoleID;

 			data={
 				'AccountID':accountID,
 				'RoleID':roleID
 			}

 			//判断传过来的数据是否为空
 			var requireValue='缺少值：';
 			for(var value in data)
 			{
 				
 				if(data[value].length==0)
 				{
 					requireValue+=value+' ';	
 				}
 			}

 			if(requireValue!='缺少值：')
 			{
 				res.json({
 					code:300,
 					isSuccess:false,
 					msg:requireValue
 				});
 				logger.writeError(requireValue);
 				return;
 			}
 			userrole.insert(data,function(err,results)
 			{
 				if(err)
 				{
 					res.json({
 						code:500,
 						isSuccess:false,
 						msg:'插入失败'
 					});
 					logger.writeError("插入失败");
 					return ;
 				}
 				if(results.insertId!=0)
 				{
 					res.json({
 						code:200,
 						isSuccess:true,
 						msg:'插入成功'
 					});
 				}

 			});
 		});

router.put('/',function(req,res)
{
	var data=['ID','AccountID','RoleID'];
	var err ='required: ';
	for(var value in data)
	{
		if(!(data[value] in req.body))
		{
			console.log("require: "+data[value]);
			err += data[value]+' ';
		}
	}

	if(err != 'required: ')
	{
		res.json({
			code:400,
			isSuccess:false,
			msg:err
		});
		logger.writeError(err);
		return ;
	}

	var ID =req.body.ID;
	var accountID=req.body.AccountID;
	var roleID=req.body.RoleID; 

	var data = {
		"ID":ID,
		"AccountID":accountID,
		"RoleID":roleID
	}

	userrole.updateUserRole(data,function(err,results)
	{
		if(err)
		{
			res.json(
			{
				code:500,
				isSuccess:false,
				msg:'修改信息失败，服务器出错'
			});
			logger.writeError("修改信息失败，服务器出错");
			return ;
		}
		if(results!==undefined&&results.affectedRows!=0)
		{
			res.json({
				code:200,
				isSuccess:true,
				msg:"修改信息成功"
			})
			return ;
		}else
		{
			res.json({
				code:400,
				isSuccess:false,
				msg:"修改信息失败"
			});
			logger.writeError("修改信息失败");
			return ;
		}
	})


});
module.exports=router;