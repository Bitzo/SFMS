/**
 * @Author: luozQ
 * @Date:   2016-12-13 上午10:17
 * @Last Modified by:luozQ
 * @Last Modified time: 2016-12-13 上午10:17
 * @Function :产品类别增，删，改
 */

var productypeDAL = appRequire('dal/jinkebro/productype/productypedal');
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    logModel = appRequire('model/jinkebro/log/logmodel'),
    productServ = appRequire('service/jinkebro/product/productservice');
var Productype = function () {
}

//查询所有产品类别
Productype.prototype.queryAllProType = function (data, callback) {
    productypeDAL.queryAllProType(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//产品类别的插入
Productype.prototype.insert = function (data, callback) {
    if (!checkData(data)) {
        callback(true);
        return;
    }
    productypeDAL.insert(data, function (err, results) {
        if (err) {
            console.log("产品类别插入失败");
            logModel.OperationName = '插入产品类别';
            logModel.Action = '插入产品类别';
            logModel.Memo = '插入产品类别失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function (err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            return callback(true);
        }
        callback(false, results);
    });
};

//修改产品类别
Productype.prototype.update = function (data, callback) {
    if (!checkData(data)) {
        callback(true);
        return;
    }
    productypeDAL.update(data, function (err, results) {
        if (err) {
            logger.writeErr('修改产品类别异常:' +moment().format('YYYY-MM-DD HH:mm:ss'));
            console.log("产品类别修改失败");
            logModel.OperationName = '修改产品类别';
            logModel.Action = '修改产品类别';
            logModel.Memo = '修改产品类别失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function (err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//删除产品类别
Productype.prototype.delete = function (data, callback) {
    if (!checkData(data)) {
        callback(true);
        return;
    }
    productServ.getProCountByID(data, function (err, results) {
        if (err) {
            logger.writeError('删除产品类别异常:' +moment().format('YYYY-MM-DD HH:mm:ss'));
            console.log("删除产品类别异常");
            logModel.OperationName = '删除产品类别';
            logModel.Action = '删除产品类别';
            logModel.Memo = '删除产品类别失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function (err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            callback(true);
            return;
        }
        var count = results[0]['count'];
        console.log('count:' + count)
        if (count > 0) {
            callback(true, count);
        } else {
            productypeDAL.delete(data, function (err, results) {
                if (err) {
                    logger.writeError('删除产品类别异常:' + new Date());
                    callback(true);
                    return;
                }
                logger.writeInfo('删除产品类别的:' + results);
                callback(false, results);
            });
        }
    });
};

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

module.exports = new Productype();