/**
 * @Author: Duncan
 * @Date: 2016/11/15 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/15 19:04
 * @Function: 用户信息的插入,用户信息的查询
 */
var express=require('express');
var router=express.Router();
var url=require('url');

//加载中间件
var user=appRequire('service/backend/user/userservice');

router.post('/',function(req,res)
	{
		var data=['ApplicationID','AccountID','Account','UserName','Pwd','CollegeID','GradeYear','Phone','ClassID','Memo','CreateTime','CreateUserID','EditUserID','EditTime','IsActive','Email','Address'];
		var err='require: ';
		for(var value in data)
		{
			// console.log(data[value]);
			if(!(data[value] in req.body))
			{
				err+=data[value]+' ';//检查post传输的数据
			}
		}

		if(err!='require: ')
		{
			res.json({
				code:500,
				isSuccess:false,
				msg:err
			});
			return;
		}
		//插入要传的参数
		var ApplicationID=req.body.ApplicationID;
		var AccountID=req.body.AccountID;
		var Account=req.body.Account;
		var UserName=req.body.UserName;
		var Pwd=req.body.Pwd;
		var CollegeID=req.body.CollegeID;
		var GradeYear=req.body.GradeYear;
		var Phone=req.body.Phone;
		var ClassID=req.body.ClassID;
		var Memo=req.body.Memo;
		var CreateTime=req.body.CreateTime;
		var CreateUserID=req.body.CreateUserID;
		var EditUserID=req.body.EditUserID;
		var EditTime=req.body.EditTime;
		var IsActive=req.body.IsActive;
		var Email=req.body.Email;
		var Address=req.body.Address;

		data={
			'ApplicationID':ApplicationID,
			'AccountID':AccountID,
			'Account':Account,
			'UserName':UserName,
			'Pwd':Pwd,
			'CollegeID':CollegeID,
			'GradeYear':GradeYear,
			'Phone':Phone,
			'ClassID':ClassID,
			'Memo':Memo,
			'CreateTime':CreateTime,
			'CreateUserID':CreateUserID,
			'EditUserID':EditUserID,
			'EditTime':EditTime,
			'IsActive':IsActive,
			
		}	

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
			res.json({
					code:300,
					isSuccess:false,
					msg:requireValue
				});
				return;
			}

			if(Email.length!=0)
			{
				data['Email']=Email;
			}
			if(Address.length!=0)
			{
				data['Address']=Address;
			}
		user.insert(data,function(err)
		{
			if(err)
			{
				res.json({
					code:500,
					isSuccess:false,
					msg:'插入失败'
				});
				return ;
			}else
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