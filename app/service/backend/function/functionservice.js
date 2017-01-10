/**
 * @Author: luozQ
 * @Date:   2016-11-13 20:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-14 20:41
 * @Function: 功能点管理
 */
var functionDAL = appRequire('dal/backend/function/functiondal.js');
var getTree = appRequire('service/backend/function/gettreefunction');
var logger = appRequire("util/loghelper").helper;
var Q = require('q');

//查询所有树形功能点
exports.queryAllFunctions = function (data, callback) {
    if (!checkData(data)) {
        callback(true, '数据有误');
        return;
    }
    functionDAL.queryAllFunctions(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('queryAllFunctions')
        //转成多层结构 
        getTree.getTreeFunction(results, function (err, list) {
            if (err) {
                callback(true);
            }
            callback(false, list);
        });
    });
};

//新增功能点
exports.insert = function (data, callback) {
    if (!checkData(data)) {
        callback(true, '数据有误');
        return;
    }
    functionDAL.insert(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('funcitoninsert');
        callback(false, results);
    });
};

//修改功能点
exports.update = function (data, callback) {
    if (!checkData(data)) {
        logger.writeError('修改功能点err');
        callback(true, results);
        return;
    }
    functionDAL.update(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        logger.writeInfo('funcitonupdate');
        callback(false, results);
    });
};

var treeFuncID = [];
//删除功能点
exports.delete = function (data, callback) {
    if (!checkData(data)) {
        callback(true, '数据有误');
        return;
    }
    data.IsActive = 1;
    treeFuncID.length = 0;
    treeFuncID.push({
        'FunctionID': data.FunctionID
    });
    functionDAL.queryAllFunctions(data, function (err, results) {
        if (err) {
            return callback(true, results);
        }
        //根据FunctionID判断该功能点是否存在
        if (results != undefined && results.length > 0) {
            var querydata = {
                'ApplicationID': results[0].ApplicationID
            }
            functionDAL.queryAllFunctions(querydata, function (err, results) {
                //得到子节点的所有functionid
                function getMultiTreeID(FunctionID) {
                    var querydata = {
                        'ParentID': FunctionID,
                        'IsActive': 1
                    }
                    var data = [];
                  
                    for (var j in results) {
                        if (results[j].ParentID == FunctionID) {
                            data.push({ 'FunctionID': results[j].FunctionID });
                        }
                    }
                    if (data != undefined && data.length > 0) {
                        for (var i in data) {
                            getMultiTreeID(data[i].FunctionID);
                            treeFuncID.push({
                                'FunctionID': data[i].FunctionID
                            });

                        }
                    }
                }
                getMultiTreeID(data.FunctionID);
                //禁用功能点
                functionDAL.delete(treeFuncID, function (err, results) {
                    if (err) {
                        return callback(true, results);
                    }
                    return callback(false, results);
                });
            });
        } else {
            return callback(true, '该功能点已被禁用')
        }
    });
};

//根据FunctionID判断该功能点是否存在
exports.queryFuncByID = function (data, callback) {
    if (!checkData(data)) {
        callback(true, '数据有误');
        return;
    }
    functionDAL.queryFuncByID(data, function (err, results) {
        if (err) {
            callback(true, results);
            return;
        }
        callback(false, results);
    });
}

//根据FunctionID得到该功能点的值
exports.getFuncByID = function (data, callback) {
    if (!checkData(data)) {
        callback(true);
        return;
    }
    functionDAL.queryAllFunctions(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
}

//验证数据是否都已定义
function checkData(data) {
    for (var key in data) {
        if (data[key] === undefined) {
            console.log('data' + key);
            return false;
        }
    }
    return true;
}
