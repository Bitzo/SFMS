/**
 * @Author: Spring
 * @Date: 16-12-9 下午1:17
 * @Last Modified by: Duncan
 * @Last Modified time: 16-12-9 下午1:17
 * @Function: 消费者模块增加,更新
 */

var db_jinkebro = appRequire('db/db_jinkebro'),
    customer = appRequire('model/jinkebro/customer/customermodel');
//插入金科小哥微信端用户
exports.insert = function (data, callback) {
    var insert_sql = 'insert into jit_customer set ',
        insert_sql_length = insert_sql.length;
    if (data !== undefined) {
        for (var key in data) {
            if (insert_sql.length == insert_sql_length) {
                insert_sql += key + " = '" + data[key] + "' ";
            } else {
                insert_sql += ", " + key + " = '" + data[key] + "' ";
            }
        }
    }
    console.log("新增用户: " + insert_sql);
    db_jinkebro.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(insert_sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}
//用户的修改
exports.update = function(data,callback)
{
    var sql = 'update jit_customer set ';
    var i = 0;//判断是否为第1个参数
    for(var key in data)
    {
        if(key != 'CustomerID')
        {
            if(i==0)
            {
                sql += key + "= '" +data[key] +"' ";
                i++;
            }
            else
            {
                sql += " , " + key + " = '" + data[key] + "' ";
            }
        }
    }

    sql += " WHERE " + customer.PK + " = " +data[customer.PK];
    console.log(sql);
    db_jinkebro.mysqlPool.getConnection(function(err,connection)
    {
        if(err)
        {
            callback(true);
            return;
        }
        connection.query(sql,function(err,results)
        {
            if(err)
            {
                callback(true);
                return;
            }
            callback(false,results);
            connection.release();
        }); 
    });
}