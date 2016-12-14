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
//查询所有树形功能点
exports.queryAllFunctions = function(data, callback) {
    functionDAL.queryAllFunctions(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('queryAllFunctions')
        //转成多层结构
        results = getTree.getTreeFunction(results, 0);
        callback(false, results);
    });
};

//新增功能点
exports.insert = function(data, callback) {
    if (!checkData(data)) {
        callback(true);
        return;
    }
    functionDAL.insert(data, function(err, results) {
        if (err) {
            logger.writeError('新增功能点err');
            callback(true);
            return;
        }
        logger.writeInfo('funcitoninsert');
        callback(false, results);
    });
};

//修改功能点
exports.update = function(data, callback) {

    if (!checkData(data)) {
        logger.writeError('修改功能点err');
        callback(true);
        return;
    }
    functionDAL.update(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('funcitonupdate');
        callback(false, results);
    });
};

//删除功能点
exports.delete = function(data, callback) {
    //删除时，判断其是否有子节点
    functionDAL.HasChildernByID(data, function(err, results) {
        if (err) {
            return callback(true);
        }
        var count = results[0]['count'];
        if (count > 0) {
            return callback(true, count);
        } else {
            //当取出的子节点为0时，可删除
            functionDAL.delete(data, function(err, results) {
                if (err) {
                    callback(true);
                    return;
                }
                return callback(false, results);
            });
        }
    });
};

//根据FunctionID判断该功能点是否存在
exports.queryFuncByID = function(data, callback) {
    functionDAL.queryFuncByID(data, function(err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
}

//根据FunctionID得到该功能点的值
exports.getFuncByID = function(data, callback) {
    functionDAL.getFuncByID(data, function(err, results) {
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