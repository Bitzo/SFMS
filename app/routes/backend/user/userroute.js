/**
 * @Author: Duncan
 * @Date: 2016/11/15 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/16 19:04
 * @Function: 用户信息的插入,用户信息的查询
 */
var express=require('express');
var router=express.Router();
var url=require('url');

//加载中间件
var user=appRequire('service/backend/user/userservice');
var config=appRequire('config/config');

router.post('/',function(req,res)
	{
		
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
			'CreateTime':CreateTime,
			'CreateUserID':CreateUserID,
			'IsActive':IsActive,
			
		}	
	
		//console.log(typeof(data[ApplicationID]));
		var requireValue='缺少值：';
		
		for(var value in data)
		{	//console.log(typeof(value));
			if(data[value].length==0)
			{
				requireValue+=value+' ';	
			}


		}
		console.log(111);
		if(requireValue!='缺少值：')
		{
			res.json({
					code:300,
					isSuccess:false,
					msg:requireValue
				});
				return;
			}
			
			if(Email.length!=0&&Email!=undefined)
			{
				data['Email']=Email;
			}
			
			
			if(Address!=undefined&&Address.length!=0)
			{
				data['Address']=Address;
			}


			if(CollegeID!=undefined&&CollegeID.length!=0)
			{
				data['CollegeID']=CollegeID;
			}
			
			if(GradeYear!=undefined&&GradeYear.length!=0)
			{
				data['GradeYear']=GradeYear;
			}
			
			if(Phone!=undefined&&Phone.length!=0)
			{
				data['Phone']=Phone;
			}

			if(ClassID!=undefined&&ClassID.length!=0)
			{
				data['ClassID']=ClassID;
			}
			if(Memo!=undefined&&Memo.length!=0)
			{
				data['Memo']=Memo;
			}
			if(EditUserID!=undefined&&EditUserID.length!=0)
			{
				data['EditUserID']=EditUserID;
			}
			if(EditTime!=undefined&&EditTime.length!=0)
			{
				data['EditTime']=EditTime;
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

router.get('/', function(req, res) {
	var data={};
	var AllCount;
	var page=req.query.page;//页数
    var AccountID = req.query.AccountID;
    var ApplicationID=req.query.ApplicationID;
    var Account=req.query.Account;
    var UserName=req.query.UserName;
    var CollegeID=req.query.CollegeID;
    var GradeYear=req.query.GradeYear;
    var ClassID=req.query.ClassID;
    var CreateUserID=req.query.CreateUserID;
    var EditUserID=req.query.EditUserID;
    var IsActive=req.query.IsActive;
    var Address=req.query.Address;
    if(page==undefined||page.length==0)
    {
    	page=1;
    }

    if(AccountID!==undefined&&AccountID.length!=0)
    {
    	data['AccountID']=AccountID;
    }

    if(ApplicationID!==undefined&&ApplicationID.length!=0)
    {
    	data['ApplicationID']=ApplicationID;
    }

    if(Account!==undefined&&Account.length!=0)
    {
    	data['Account']=Account;
    }

    if(UserName!==undefined&&UserName.length!=0)
    {
    	data['UserName']=UserName;
    }


    if(CollegeID!==undefined&&AccountID.length!=0)
    {
    	data['AccountID']=AccountID;
    }

    if(GradeYear!==undefined&&GradeYear.length!=0)
    {
    	data['GradeYear']=GradeYear;
    }
    if(ClassID!==undefined&&ClassID.length!=0)
    {
    	data['ClassID']=ClassID;
    }
     if(CreateUserID!==undefined&&CreateUserID.length!=0)
    {
    	data['CreateUserID']=CreateUserID;
    }

    if(EditUserID!==undefined&&EditUserID.length!=0)
    {
    	data['EditUserID']=EditUserID;
    }
      if(IsActive!==undefined&&IsActive.length!=0)
    {
    	data['IsActive']=IsActive;
    }
     if(Address!==undefined&&Address.length!=0)
    {
    	data['Address']=Address;
    }
    data['page']=page;
  
//获取所有用户的数量
	user.countUser(data,function(err,result)
	{
		if(err)
		{
			res.json({
				code:500,
				isSuccess:false,
				msg:"获取数量失败"
			})
			return ;
		}
		if(result!==undefined&&result.length!=0)
		{
		AllCount=result[0]['num'];
		console.log(AllCount);
		}
		else
		{
			res.json({
                code: 500,
                isSuccess: false,
                msg: "未查询到相关信息"
            });
            return ;
		}
	});
    user.queryAllUsers(data, function(err, result) {
        if (err) {
            res.json({
            	code:500,
            	isSuccess:true,
                msg: '查询失败'
            });
            return;
        }
        
        if(result!=undefined&&result.length!=0)
        {
        	var results = {
                code: 200,
                isSuccess: true,
                msg: '查询成功',
                dataNum: AllCount,
                curPage: page,
                totlePage: Math.ceil(AllCount/config.pageCount),
                data: result
            };
        res.json(results);
        	
    	}
    	else
    	{
    		res.json({
    			code:500,
    			isSuccess:false,
    			msg:"未查到数据"
    		})
    	}
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
			'CreateTime':CreateTime,
			'CreateUserID':CreateUserID,
			'IsActive':IsActive,
			
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
			res.json({
					code:300,
					isSuccess:false,
					msg:requireValue
				});
				return;
			}
			
			if(Email.length!=0&&Email!=undefined)
			{
				data['Email']=Email;
			}
			
			
			if(Address!=undefined&&Address.length!=0)
			{
				data['Address']=Address;
			}


			if(CollegeID!=undefined&&CollegeID.length!=0)
			{
				data['CollegeID']=CollegeID;
			}
			
			if(GradeYear!=undefined&&GradeYear.length!=0)
			{
				data['GradeYear']=GradeYear;
			}
			
			if(Phone!=undefined&&Phone.length!=0)
			{
				data['Phone']=Phone;
			}

			if(ClassID!=undefined&&ClassID.length!=0)
			{
				data['ClassID']=ClassID;
			}
			if(Memo!=undefined&&Memo.length!=0)
			{
				data['Memo']=Memo;
			}
			if(EditUserID!=undefined&&EditUserID.length!=0)
			{
				data['EditUserID']=EditUserID;
			}
			if(EditTime!=undefined&&EditTime.length!=0)
			{
				data['EditTime']=EditTime;
			}


			user.update(data,function(err,results)
			{
				if(err)
				{
					res.json(
					{
						code:500,
						isSuccess:false,
						msg:'修改信息失败，服务器出错'
					});
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
				})
				return ;
			}
		})

})
module.exports=router;