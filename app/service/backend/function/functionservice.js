/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-14 20:41
 * @Function: 功能点管理
 */
var functionDAL = appRequire('dal/backend/function/functiondal.js');
var getTree=appRequire('service/backend/function/gettreefunction');

//查询所有树形功能点
exports.queryAllFunctions = function (data, callback) {
    functionDAL.queryAllFunctions(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        //转成多层结构
        results=getTree.getTreeFunction(results,0);
        callback(false, results);
    });
};

//新增功能点
exports.insert = function (data, callback) {
    functionDAL.insert(data, function (err,results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false,results);
    });
};

//修改功能点
exports.update = function (data, callback) {
    functionDAL.update(data, function (err,results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false,results);
    });
};

//删除功能点
exports.delete = function (data, callback) {
    functionDAL.delete(data, function (err,results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false,results);
    });
};

//根据FunctionID判断该功能点是否存在
exports.queryFuncByID=function(data,callback){
    functionDAL.queryFuncByID(data,function(err,results){
        if(err){
            callback(true);
            return;
        }
        callback(false,results);
    });
}

//根据FunctionID得到该功能点的值
exports.getFuncByID=function(data,callback){
    functionDAL.getFuncByID(data,function(err,results){
        if(err){
            callback(true);
            return;
        }
        callback(false,results);
    });
}