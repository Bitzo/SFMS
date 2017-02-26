/**
 * @Author: Cecurio
 * @Date: 2016/12/3 12:01
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/3 12:01
 * @Function: 数据字典
 */
var db_backend = appRequire('db/db_backend'),
    logger = appRequire("util/loghelper").helper;

//字典新增
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

        logger.writeInfo("连接成功");

        connection.query(insert_sql, function(err, result) {
            connection.release();

            if (err) {
                throw err;
                callback(true);
                return;
            }

            return callback(false, result);
        });
    });
};

//字典编辑
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

        logger.writeInfo("连接成功");

        connection.query(update_sql, function(err, results) {
            connection.release();

            if (err) {
                throw err;
                callback(true);
                return;
            }

            return callback(false, results);
        });
    });
};

//字典物理删除
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

        logger.writeInfo("连接成功");

        connection.query(sql, function(err, results) {
            connection.release();

            if (err) {
                throw err;
                callback(true);
                return ;
            }

            return callback(false, results);
        });
    });
};

//字典查询
exports.queryDatadictionary = function (data,callback) {
    // 从service传来的数据的格式
    // var formdata = {
    //     pageManage : {
    //         page : data.page || 1,
    //         pageNum : data.pageNum || (config.pageCount),
    //         isPaging : data.isPaging || 0
    //     },
    //     datadict : {
    //         ApplicationID : data.ApplicationID || '',
    //         DictionaryID : data.DictionaryID || '',
    //         DictionaryLevel : data.DictionaryLevel || '',
    //         ParentID : data.ParentID || '',
    //         Category : data.Category || '',
    //         DictionaryCode : data.DictionaryCode || '',
    //         DictionaryValue : data.DictionaryValue || '',
    //         IsActive : data.IsActive || ''
    //     }
    // };

    var pageManage = {},
        datadict = {};
    if (data != undefined) {
        pageManage = data.pageManage;
        datadict = data.datadict;
    }else {
        return callback(true);
    }

    var arr = new Array();
    arr.push('select ApplicationID,DictionaryID,DictionaryLevel,ParentID,Category,DictionaryCode,DictionaryValue,Memo,IsActive');
    arr.push('from jit_datadictionary');
    arr.push('where 1=1');
    var sql = arr.join(' ');

    if (datadict != undefined) {
        for (var key in datadict) {
            if (datadict[key] != '')
                sql += " and " + key + " = '" + datadict[key] + "' ";
        }
    }

    var num = pageManage.pageNum; //每页显示的个数
    var page = pageManage.page || 1;

    if (pageManage['isPaging'] == 1){
        sql += " LIMIT " + (page-1)*num + "," + num;
    }

    logger.writeInfo("查询字典信息：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            connection.release();

            if (err) {
                callback(true);
                return;
            };

            logger.writeInfo("查询成功");

            return callback(false, results);
        });
    });
};

//计数，统计对应数据总个数
exports.countAllDataDicts = function (data, callback) {
    var sql =  'select count(1) AS num from jit_datadictionary where 1=1 ';

    if (data !== undefined) {
        for (var key in data) {
            if (key !== 'page' && key !== 'pageNum' && data[key] != '' && key !== 'isPaging')
                if(!isNaN(data[key])){
                    sql += " and " + key + " = " + data[key] + " ";
                }else{
                    sql += " and " + key + " = '" + data[key] + "' ";
                }
        }
    }

    logger.writeInfo('查询字典计数：' + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            connection.release();

            if (err) {
                callback(true);
                return;
            };

            logger.writeInfo("查询成功");

            return callback(false, results);
        });
    });
};


exports.queryDatadictionaryByID = function (data,callback) {
    var sql = 'select DictionaryID,DictionaryCode,DictionaryValue from jit_datadictionary where 1=0 ';

    if (data !== undefined) {
        for(var i in data.DictionaryID)
            sql += "or DictionaryID" + " = '" + data.DictionaryID[i] + "' ";
    }

    logger.writeInfo("查询字典信息 by ID：" + sql);

    db_backend.mysqlPool.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo("连接成功");

        connection.query(sql, function (err, results) {
            connection.release();

            if (err) {
                console.log(err);
                callback(true);
                return;
            };

            logger.writeInfo("查询成功");

            return callback(false, results);
        });
    });
};



 
 