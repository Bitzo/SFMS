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
var user=appRequire('service/backend/user/userservice'),
    menuService = appRequire('service/backend/menu/menuservice');

var config=appRequire('config/config');
var moment=require('moment');
router.post('/',function(req,res)
{
	
	var data=['ApplicationID','Account','UserName','Pwd','CreateUserID','IsActive'];
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
		 createTime=moment().format("YYYY-MM-DD HH:mm:ss"),
		 createUserID=req.body.CreateUserID,
		 editUserID=req.body.EditUserID,
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
		//用来检验是否是数字

		var intNum = {
			"ApplicationID":applicationID,
			"CreateUserID":createUserID,
			"IsActive":isActive
		}
		for(var key in intNum)
		{
			if(isNaN(intNum[key]))
			{
				return res.json(
				{
					code:500,
					isSuccess:false,
					msg:key + ":" +intNum[key] + " 必须是数字"
				});
			}
		}
			//去除相同的账户名字
			var sameAccount={'Account':account};
			user.queryAccount(sameAccount,function(err,result)
			{
				console.log(111);
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

				

				if(email!=undefined&&email.length!=0)
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
    console.log(1234);
    var query = JSON.parse(req.query.f);
	console.log(1233);
	console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
	logger.writeInfo("查询用户的记录");
	var data={},
	 allCount,
	 page=req.query.pageindex,//页数
	 accountID = query.AccountID,
	 applicationID=query.ApplicationID,
	 account=query.Account,
	 userName=query.UserName,
	 classID=query.ClassID,
	 createUserID=query.CreateUserID,
	 editUserID=query.EditUserID,
	 isActive=query.IsActive,
	 pageNum=req.query.pagesize;
	
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
console.log(data);
//获取所有用户的数量

user.countUser(data,function(err,result){	
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
		//查询所需要的数据
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
	
	if(result!=undefined&&result.length!=0&&allCount != -1)
	{
		var results = {
			code: 200,
			isSuccess: true,
			msg: '查询成功',
			dataNum: allCount,
			curPage: page,
			curpageNum:pageNum,
			totalPage: Math.ceil(allCount/pageNum),
			data: result
		};
		if(results.curPage==results.totlePage)
		{
			results.curpageNum=results.dataNum - (results.totlePage-1)*pageNum;
		}
		res.status(200);
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
		});
		logger.writeWarn("未查到数据");
		return ;
	}	
});
}
	else
	{
		res.status(404);
		res.json({
			code: 404,
			isSuccess: false,
			msg: "未查询到相关信息"
		});
		logger.writeError("为查询到相关的信息");
		return ;
	}

	});	
});

router.get('/:userID',function (req,res) {
	var userID = req.params.userID;
	if (userID === undefined || userID === '') {
		return res.json({
			code: 404,
			isSuccess: false,
			msg: 'require userID'
		});
	}
	if(isNaN(userID)){
		return res.json({
			code: 500,
			isSuccess: false,
			msg: 'userID不是数字'
		});
	}
	var uniqueData = {
		"userID" : userID
	};

	//判断user是否存在
	user.querySingleID(userID,function (err,result) {
		if(err){
			return res.json({
				code : 500,
				isSuccess :false,
				msg : '服务器出错'
			});
		}
		//user存在，则可以进行查询
		if(result !== undefined && result.length != 0){
			menuService.queryMenuAndRoleByUserID(uniqueData,function (err, results) {
				if(err){
					return res.json({
						code : 500,
						isSuccess :false,
						msg : '服务器出错'
					});

				}

				if(results.Menu !== undefined && results.Menu.length != 0 ){
					if(results.Role !== undefined &&  results.Role.length != 0){
						return res.json({
							code : 200,
							isSuccess :true,
							data : results,
							msg : '查询菜单和角色成功'
						});
					}else {
						return res.json({
							code : 404,
							isSuccess :false,
							msg : '未查到角色'
						});
					}

				}else {
					return res.json({
						code : 404,
						isSuccess :false,
						msg : '未查到菜单'
					});
				}
			});
		}else{
			return res.json({
				code : 404,
				isSuccess :false,
				msg : '用户不存在'
			});
		}
	});
});

router.put('/',function(req,res){
	var data=['ApplicationID','AccountID','Account','UserName','Pwd','CollegeID','GradeYear','Phone','ClassID','Memo','CreateUserID','EditUserID','Email','Address','IsActive'];
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
		 createUserID=req.body.CreateUserID,
		 editUserID=req.body.EditUserID,
		 editTime=moment().format("YYYY-MM-DD HH:mm:ss"),
		 isActive=req.body.IsActive,
		 email=req.body.Email,
		 address=req.body.Address;

		data={
			'ApplicationID':applicationID,
			'AccountID':accountID,
			'Account':account,
			'UserName':userName,
			'Pwd':pwd,
			'EditTime':editTime,
			'CreateUserID':createUserID,
			'IsActive':isActive,
			'EditUserID':editUserID
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