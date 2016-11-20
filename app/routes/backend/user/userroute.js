/**
 * @Author: Duncan
 * @Date: 2016/11/15 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/19 19:04
 * @Function: 用户信息的插入,用户信息的查询，用户信息的更改
 */
var express=require('express');
var router=express.Router();
var url=require('url');

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
			res.json({
				code:500,
				isSuccess:false,
				msg:err
			});
			return;
		}

		//插入要传的参数
		var applicationID=req.body.ApplicationID;
		var account=req.body.Account;
		var userName=req.body.UserName;
		var pwd=req.body.Pwd;
		var collegeID=req.body.CollegeID;
		var gradeYear=req.body.GradeYear;
		var phone=req.body.Phone;
		var classID=req.body.ClassID;
		var memo=req.body.Memo;
		var createTime=req.body.CreateTime;
		var createUserID=req.body.CreateUserID;
		var editUserID=req.body.EditUserID;
		var editTime=req.body.EditTime;
		var isActive=req.body.IsActive;
		var email=req.body.Email;
		var address=req.body.Address;

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
			res.json({
					code:300,
					isSuccess:false,
					msg:requireValue
				});
				return;
			}
			//去除相同的账户名字
			var sameAccount={'Account':account,'page':1};
			user.queryAllUsers(sameAccount,function(err,result)
			{
				if(err)
				{
					res.json({
						code:300,
						isSuccess:false,
						msg:"查询账户失败"
					})
					return ;
				}
				if(result!=undefined&&result!=0)
				{
					res.json({
						code:300,
						isSuccess:false,
						msg:"账户名已存在"
					})
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
			}else if(result.insertID!=0)
			{
				res.json({
					code:200,
					isSuccess:true,
					msg:'插入成功'
				});
			}


		});

	});
});
router.get('/', function(req, res) {
	var data={};
	var allCount;
	var page=req.query.page;//页数
    var accountID = req.query.AccountID;
    var applicationID=req.query.ApplicationID;
    var account=req.query.Account;
    var userName=req.query.UserName;
    var collegeID=req.query.CollegeID;
    var gradeYear=req.query.GradeYear;
    var classID=req.query.ClassID;
    var createUserID=req.query.CreateUserID;
    var editUserID=req.query.EditUserID;
    var isActive=req.query.IsActive;
    var address=req.query.Address;
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


    if(collegeID!==undefined&&accountID.length!=0)
    {
    	data['AccountID']=accountID;
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
     if(address!==undefined&&address.length!=0)
    {
    	data['Address']=address;
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
		allCount=result[0]['num'];
		console.log(allCount);
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
                dataNum: allCount,
                curPage: page,
                totlePage: Math.ceil(allCount/config.pageCount),
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
		var applicationID=req.body.ApplicationID;
		var accountID=req.body.AccountID;
		var account=req.body.Account;
		var userName=req.body.UserName;
		var pwd=req.body.Pwd;
		var collegeID=req.body.CollegeID;
		var gradeYear=req.body.GradeYear;
		var phone=req.body.Phone;
		var classID=req.body.ClassID;
		var memo=req.body.Memo;
		var createTime=req.body.CreateTime;
		var createUserID=req.body.CreateUserID;
		var editUserID=req.body.EditUserID;
		var editTime=req.body.EditTime;
		var isActive=req.body.IsActive;
		var email=req.body.Email;
		var address=req.body.Address;

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
			res.json({
					code:300,
					isSuccess:false,
					msg:requireValue
				});
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