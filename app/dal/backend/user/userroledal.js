/**
 * @Author: Duncan
 * @Date: 2016/11/15 13:50
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/15 13:50
 * @Function:用户添加角色
 */

var db_backend=appRequire('db/db_backend');
var userModel=appRequire('model/backend/user/userrolemodel');

exports.insert=function(data,callback)
{
	var insert_sql='insert into jit_roleuser set';
	if(data!==undefined)
	{
		var i=0;
		for(var key in data)
		{
			if(i==0)
			{
				insert_sql+=' '+key+" = '"+data[key]+"' ";
				i++;
			}
			else
			{
				insert_sql+=" , "+key+" = '"+data[key]+"' ";
			}
		}
		
	}
	console.log('用户新增角色：'+insert_sql);

	db_backend.mysqlPool.getConnection(function(err,connection)
	{
		if(err)
		{
			callback(true);
			return ;
		}
		
		connection.query(insert_sql,function(err)
		{
			if(err)
			{
				callback(true);
				return ;
			}
			callback(false);
			connection.release();
		});


	});
}