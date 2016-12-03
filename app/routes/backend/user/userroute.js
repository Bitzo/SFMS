/**
 * @Author: Duncan
 * @Date: 2016/11/15 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/20 15:04
 * @Function: 用户信息的插入,用户信息的查询，用户信息的更改,信息存入日志
 */
 var express=require('express');
 var router=express.Router();
 var url=require('url');
 var logger=appRequire('util/loghelper').helper;
//加载中间件
var user=appRequire('service/backend/user/userservice');
var config=appRequire('config/config');

router.post('/',function(req,res)
{
	
	var data=['ApplicationID','Account','UserName','Pwd','CollegeID','GradeYear','Phone','ClassID','Memo','CreateTime','CreateUserID','EditUserID','EditTime','Email','Address','IsActive'];
	var err='require: ';

	for(var value in data)
	{
		
		if(!(data[value] in req.body))
		{
				///if(data[value]!='Email'&&data[value]!='Address')
				err+=data[value]+' ';//检查post传输的数据
			}	
		}

		if(err!='require: ')
		{
			res.status(400);
			res.json({
				code:400,
				isSuccess:false,
				msg:err
			});
			logger.writeError("缺少key值");
			return;
		}

		//插入要传的参数
		var applicationID=req.body.ApplicationID,
		 account=req.body.Account,
		 userName=req.body.UserName,
		 pwd=req.body.Pwd,
		 collegeID=req.body.CollegeID,
		 gradeYear=req.body.GradeYear,
		 phone=req.body.Phone,
		 classID=req.body.ClassID,
		 memo=req.body.Memo,
		 createTime=req.body.CreateTime,
		 createUserID=req.body.CreateUserID,
		 editUserID=req.body.EditUserID,
		 editTime=req.body.EditTime,
		 isActive=req.body.IsActive,
		 email=req.body.Email,
		 address=req.body.Address;

		data={
			'ApplicationID':applicationID,
			'Account':account,
			'UserName':userName,
			'Pwd':pwd,
			'CreateTime':createTime,
			'CreateUserID':createUserID,
			'IsActive':isActive,
			
		}	
		
		
		var requireValue='缺少值：';
		
		for(var value in data)
		{	//console.log(typeof(value));
			if(data[value].length==0)
			{
				requireValue+=value+' ';	
			}


		}
		
		if(requireValue!='缺少值：')
		{
			res.status(400);
			res.json({
				code:400,
				isSuccess:false,
				msg:requireValue
			});
			logger.writeError(requireValue);
			return;
		}
			//去除相同的账户名字
			var sameAccount={'Account':account};
			user.queryAllUsers(sameAccount,function(err,result)
			{
				if(err)
				{
					res.status(400);
					res.json({
						code:400,
						isSuccess:false,
						msg:"查询账户失败"
					})
					logger.writeError("查询账户失败");
					return ;
				}
				if(result!=undefined&&result!=0)
				{
					res.status(400);
					res.json({
						code:400,
						isSuccess:false,
						msg:"账户名已存在"
					})
					logger.writeError("账户名已存在");
					return ;
				}

				
				if(email.length!=0&&email!=undefined)
				{
					data['Email']=email;
				}
				
				
				if(address!=undefined&&address.length!=0)
				{
					data['Address']=address;
				}


				if(collegeID!=undefined&&collegeID.length!=0)
				{
					data['CollegeID']=collegeID;
				}
				
				if(gradeYear!=undefined&&gradeYear.length!=0)
				{
					data['GradeYear']=gradeYear;
				}
				
				if(phone!=undefined&&phone.length!=0)
				{
					data['Phone']=phone;
				}

				if(classID!=undefined&&classID.length!=0)
				{
					data['ClassID']=classID;
				}
				if(memo!=undefined&&memo.length!=0)
				{
					data['Memo']=memo;
				}
				if(editUserID!=undefined&&editUserID.length!=0)
				{
					data['EditUserID']=editUserID;
				}
				if(editTime!=undefined&&editTime.length!=0)
				{
					data['EditTime']=editTime;
				}


				user.insert(data,function(err,results)
				{
					if(err)
					{
						res.status(500);
						res.json({
						code:500,
						isSuccess:false,
						msg:'插入失败'
				});
				logger.writeError("插入失败");				
				return ;
			}
			if(result.insertId!=0)
			{
				res.json({
					code:200,
					isSuccess:true,
					msg:'插入成功'
				});
				logger.writeInfo("插入成功");
				return ;
			}
		});

			});
});
router.get('/', function(req, res) {

	logger.writeInfo("查询用户的记录");
	var data={},
	 allCount,
	 page=req.query.page,//页数
	 accountID = req.query.AccountID,
	 applicationID=req.query.ApplicationID,
	 account=req.query.Account,
	 userName=req.query.UserName,
	 gradeYear=req.query.GradeYear,
	 classID=req.query.ClassID,
	 createUserID=req.query.CreateUserID,
	 editUserID=req.query.EditUserID,
	 isActive=req.query.IsActive,
	 pageNum=req.query.pageNum;
	
	if(page==undefined||page.length==0)
	{
		page=1;
	}

	if(accountID!==undefined&&accountID.length!=0)
	{
		data['AccountID']=accountID;
	}

	if(applicationID!==undefined&&applicationID.length!=0)
	{
		data['ApplicationID']=applicationID;
	}

	if(account!==undefined&&account.length!=0)
	{
		data['Account']=account;
	}

	if(userName!==undefined&&userName.length!=0)
	{
		data['UserName']=userName;
	}


	if(gradeYear!==undefined&&gradeYear.length!=0)
	{
		data['GradeYear']=gradeYear;
	}
	if(classID!==undefined&&classID.length!=0)
	{
		data['ClassID']=classID;
	}
	if(createUserID!==undefined&&createUserID.length!=0)
	{
		data['CreateUserID']=createUserID;
	}

	if(editUserID!==undefined&&editUserID.length!=0)
	{
		data['EditUserID']=editUserID;
	}
	if(isActive!==undefined&&isActive.length!=0)
	{
		data['IsActive']=isActive;
	}
	if(pageNum==undefined)
	{
		pageNum=config.pageCount;
	}
	data['page']=page;
	data['pageNum']=pageNum;

//获取所有用户的数量
user.countUser(data,function(err,result)
{
	if(err)
	{
		res.status(500);
		res.json({
			code:500,
			isSuccess:false,
			msg:"获取数量失败"
		})
		logger.writeError("数量获取失败");
		return ;
	}
	if(result!==undefined&&result.length!=0)
	{
		allCount=result[0]['num'];
	}
	else
	{
		res.status(400);
		res.json({
			code: 400,
			isSuccess: false,
			msg: "未查询到相关信息"
		});
		logger.writeError("为查询到相关的信息");
		return ;
	}
});
user.queryAllUsers(data, function(err, result) {
	if (err) {
		res.status(500);
		res.json({
			code:500,
			isSuccess:true,
			msg: '查询失败'
		});
		logger.writeError("查询失败");
		return;
	}
	
	if(result!=undefined&&result.length!=0)
	{
		var results = {
			code: 200,
			isSuccess: true,
			msg: '查询成功',
			dataNum: allCount,
			curPage: page,
			totlePage: Math.ceil(allCount/pageNum),
			data: result
		};
		if(results.curPage==results.totlePage)
		{
			results.curpageNum=results.dataNum - (results.totlePage-1)*pageNum;
		}
		res.json(results);
		return;
	}
	else
	{
		res.status(500);
		res.json({
			code:500,
			isSuccess:false,
			msg:"未查到数据"
		})
		logger.writeWarn("未查到数据");
	}
	return ;
});
});

router.put('/',function(req,res){
	var data=['ApplicationID','AccountID','Account','UserName','Pwd','CollegeID','GradeYear','Phone','ClassID','Memo','CreateTime','CreateUserID','EditUserID','EditTime','Email','Address','IsActive'];
	var err='require: ';
	for(var value in data)
	{
		
		if(!(data[value] in req.body))
		{
				///if(data[value]!='Email'&&data[value]!='Address')
				err+=data[value]+' ';//检查post传输的数据
			}

			
		}

		if(err!='require: ')
		{
			res.status(400);
			res.json({
				code:400,
				isSuccess:false,
				msg:err
			});
			logger.writeError(err);
			return;
		}

		//插入要传的参数
		var applicationID=req.body.ApplicationID,
		 accountID=req.body.AccountID,
		 account=req.body.Account,
		 userName=req.body.UserName,
		 pwd=req.body.Pwd,
		 collegeID=req.body.CollegeID,
		 gradeYear=req.body.GradeYear,
		 phone=req.body.Phone,
		 classID=req.body.ClassID,
		 memo=req.body.Memo,
		 createTime=req.body.CreateTime,
		 createUserID=req.body.CreateUserID,
		 editUserID=req.body.EditUserID,
		 editTime=req.body.EditTime,
		 isActive=req.body.IsActive,
		 email=req.body.Email,
		 address=req.body.Address;

		data={
			'ApplicationID':applicationID,
			'AccountID':accountID,
			'Account':account,
			'UserName':userName,
			'Pwd':pwd,
			'CreateTime':createTime,
			'CreateUserID':createUserID,
			'IsActive':isActive,
			
		}	
		//console.log(Email);
		//console.log(typeof(data[ApplicationID]));
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
			res.status(400);
			res.json({
				code:400,
				isSuccess:false,
				msg:requireValue
			});

			logger.writeError(requireValue);
			return;
		}
		
		if(email.length!=0&&email!=undefined)
		{
			data['Email']=email;
		}
		
		
		if(address!=undefined&&address.length!=0)
		{
			data['Address']=address;
		}


		if(collegeID!=undefined&&collegeID.length!=0)
		{
			data['CollegeID']=collegeID;
		}
		
		if(gradeYear!=undefined&&gradeYear.length!=0)
		{
			data['GradeYear']=gradeYear;
		}
		
		if(phone!=undefined&&phone.length!=0)
		{
			data['Phone']=phone;
		}

		if(classID!=undefined&&classID.length!=0)
		{
			data['ClassID']=classID;
		}
		if(memo!=undefined&&memo.length!=0)
		{
			data['Memo']=memo;
		}
		if(editUserID!=undefined&&editUserID.length!=0)
		{
			data['EditUserID']=editUserID;
		}
		if(editTime!=undefined&&editTime.length!=0)
		{
			data['EditTime']=editTime;
		}


		user.update(data,function(err,results)
		{
			if(err)
			{
				res.status(500);
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
				logger.writeInfo("修改信息成功");
				return ;
			}else
			{
				res.status(400);
				res.json({
					code:400,
					isSuccess:false,
					msg:"修改信息失败"
				})
				logger.writeError("修改信息失败");
				return ;
			}
		})

	})
module.exports=router;