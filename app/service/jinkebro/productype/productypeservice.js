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
    logModel = appRequire('model/jinkebro/log/logmodel');

var Productype = function() {
}

//查询所有产品类别
Productye.prototype.queryAllProType = function(data, callback) {
    productypeDAL.queryAllProType(data, function(err, results) {
        if (err) {
            console.log('查询所有产品类别失败');
            logModel.OperationName = '查询所有产品类别';
            logModel.Action = '查询所有产品类别';
            logModel.Memo = '查询所有产品类别失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//产品类别的插入
Productye.prototype.insert = function(data, callback) {
    var validateData = ['ProductTypeName'];
    var err = 'required: ';
    for (var value in validateData) {
        if (!(validateData[value] in data)) {
            console.log("require " + validateData[value]);
            err += validateData[value] + ' ';
        }
    }
    if (err != 'required: ') {
        return callback(true);
    };
    productypeDAL.insert(data, function(err, results) {
        if (err) {
            console.log("产品类别插入失败");
            logModel.OperationName = '插入产品类别';
            logModel.Action = '插入产品类别';
            logModel.Memo = '插入产品类别失败';
            logModel.CreateUserID = 1;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            return callback(true);
        }
        callback(false, results);
    });
};

//修改产品类别
Productye.prototype.update = function(data, callback) {

    var validateData = ['ID', 'ProductTypeName'];
    var err = 'required: ';
    for (var value in validateData) {
        if (!(validateData[value] in data)) {
            console.log("require " + validateData[value]);
            err += validateData[value] + ' ';
        }
    }
    if (err != 'required: ') {
        return callback(true);
    };
    productypeDAL.update(data, function(err, results) {
        if (err) {
            logger.writeErr('修改产品类别入异常:' + new Date());
            callback(true);
            return;
        }
        logger.writeInfo('修改产品类别的:' + results);
        callback(false, results);
    });
};

//删除产品类别
Productye.prototype.delete = function(data, callback) {
    var validateData = ['ID'];
    var err = 'required: ';
    for (var value in validateData) {
        if (!(validateData[value] in data)) {
            console.log("require " + validateData[value]);
            err += validateData[value] + ' ';
        }
    }
    if (err != 'required: ') {
        return callback(true);
    };
    productypeDAL.delete(data, function(err, results) {
        if (err) {
            logger.writeErr('删除产品类别异常:' + new Date());
            callback(true);
            return;
        }
        logger.writeInfo('删除产品类别的:' + results);
        callback(false, results);
    });
};
module.exports = new Productype();