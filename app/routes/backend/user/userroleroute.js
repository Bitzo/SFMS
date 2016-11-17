/**
 * @Author: Duncan
 * @Date: 2016/11/13 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/13 19:04
 * @Function: 角色的勾选
 */

 var express=require('express');
 var url=require('url');
 var router=express.Router();
 var userrole=appRequire('service/backend/user/userroleservice');
 	
 	router.post('/',function(req,res)
 		{	
 			var data=['ID','AccountID','RoleID'];
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
 				return ;
 			}

 			//获取参数
 			var ID=req.body.ID;
 			var AccountID=req.body.AccountID;
 			var RoleID=req.body.RoleID;

 			data={
 				'ID':ID,
 				'AccountID':AccountID,
 				'RoleID':RoleID
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
				return;
			}
 			userrole.insert(data,function(err)
 				{
 					if(err)
 					{
 						res.json({
 							code:500,
 							isSuccess:false,
 							msg:'插入失败'
 						});
 						return ;
 					}
 					else
 					{
 						res.json({
 							code:200,
							isSuccess:true,
							msg:'插入成功'
						});
 					}

 				});
 		});


module.exports=router;