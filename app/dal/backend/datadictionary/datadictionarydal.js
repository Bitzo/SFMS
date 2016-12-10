/**
 * @Author: Cecurio
 * @Date: 2016/12/3 12:01
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/3 12:01
 * @Function: 数据字典
 */
var db_backend = appRequire('db/db_backend'),
    logger = appRequire("util/loghelper").helper;

exports.datadictionaryInsert = function (data,callback) {
    var insert_sql = "insert into jit_datadictionary set ";
    var sql = "";
    if(data !== undefined){
        for(var key in data){
            if(sql.length == 0){
                if(!isNaN(data[key])){
                    sql += " " + key + " = " + data[key] + " " ;
                }else{
                    sql += " " + key + " = '" + data[key] + "' " ;
                }
            }else{
                if(!isNaN(data[key])){
                    sql += ", " + key + " = " + data[key] + " " ;
                }else{
                    sql += ", " + key + " = '" + data[key] + "' " ;
                }
            }
        }
    }

    insert_sql += sql;

    logger.writeInfo("[datadictionaryInsert func in datadictionarydal]字典新增：" +insert_sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[datadictionarydal]数据库连接错误：" + err);
            callback(true);
            return;
        }
        connection.query(insert_sql, function(err, result) {
            if (err) {
                throw err;
                callback(true);
                return;
            }
            callback(false, result);
            connection.release();
        })
    })
}

exports.datadictionaryUpdate = function (data,callback) {
    var update_sql = "update jit_datadictionary set ";
    var sql = "";
    if(data !== undefined){
        for(var key in data){
            if(key != 'DictionaryID'){
                if(sql.length == 0){
                    if(!isNaN(data[key])){
                        sql += " " + key + " = " + data[key] + " " ;
                    }else{
                        sql += " " + key + " = '" + data[key] + "' " ;
                    }

                }else{
                    if(!isNaN(data[key])){
                        sql += ", " + key + " = " + data[key] + " " ;
                    }else{
                        sql += ", " + key + " = '" + data[key] + "' " ;
                    }

                }
            }
        }
    }
    sql += " where DictionaryID = " + data['DictionaryID'];

    update_sql = update_sql + sql;

    logger.writeInfo("[datadictionaryUpdate func in datadictionarydal]字典编辑:" + update_sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err) {
            logger.writeError("[datadictionarydal]数据库连接错误：" + err);
            callback(true);
            return;
        }

        connection.query(update_sql, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return;
            }

            callback(false, results);
            connection.release();
        })

    });
}

exports.datadictionaryDelete = function (data,callback) {
    var sql = 'delete from jit_datadictionary where 1=1 and DictionaryID = ';
    sql = sql + data.DictionaryID;

    logger.writeInfo("[datadictionaryDelete func in menudal]字典删除：" + sql);

    db_backend.mysqlPool.getConnection(function (err,connection) {
        if(err){
            logger.writeError("[datadictionarydal]数据库连接错误：" + err);
            callback(true);
            return ;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                throw err;
                callback(true);
                return ;
            }

            callback(false, results);
            connection.release();
        })
    })
}

exports.queryDatadictionary = function (data,callback) {
    var sql = 'select ApplicationID, DictionaryID, DictionaryLevel, ParentID,Category,DictionaryCode,DictionaryValue,Memo, IsActive from jit_datadictionary where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
                sql += "and " + key + " = '" + data[key] + "' ";
        }
    }

    var num = data.pageNum; //每页显示的个数
    var page = data.page || 1;

    sql += " LIMIT " + (page-1)*num + "," + num;

    logger.writeInfo("查询字典信息：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            connection.release();
        })
    })
}

//计数，统计对应数据总个数
exports.countAllDataDicts = function (data, callback) {
    var sql =  'select count(1) AS num from jit_datadictionary where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '')
                if(!isNaN(data[key])){
                    sql += " and " + key + " = " + data[key] + " ";
                }else{
                    sql += " and " + key + " = '" + data[key] + "' ";
                }
        }
    }
    console.log(sql);
    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");
        logger.writeInfo(sql);

        connection.query(sql, function (err, results) {
            if (err) {
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            connection.release();
        })
    })
};

exports.queryDatadictionaryByCode = function (data,callback) {
    var sql = 'select DictionaryCode,DictionaryValue from jit_datadictionary where 1=0 ';

    if (data !== undefined) {
        for(var i in data.DictionaryCode)
            sql += "or DictionaryCode" + " = '" + data.DictionaryCode[i] + "' ";
    }

    logger.writeInfo("查询字典信息 by Code：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            };
            logger.writeInfo("查询成功");
            callback(false, results);
            connection.release();
        })
    })
}