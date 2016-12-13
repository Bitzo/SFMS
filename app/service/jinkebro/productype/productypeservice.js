/**
 * @Author: luozQ
 * @Date:   2016-12-13 上午10:17
 * @Last Modified by:luozQ
 * @Last Modified time: 2016-12-13 上午10:17
 * @Function :产品类别增，删，改
 */

var productypeDAL = appRequire('dal/jinkebro/productype/productypedal');

var Productye = function () {
}

//查询所有产品类别
Productye.prototype.queryAllProType = function (data, callback) {
    productypeDAL.queryAllProType(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//产品类别的插入
Productye.prototype.insert = function (data, callback) {
    console.log("插入")
    productypeDAL.insert(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//修改产品类别
Productye.prototype.update = function (data, callback) {
    productypeDAL.update(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//删除产品类别
Productye.prototype.delete = function (data, callback) {
    productypeDAL.delete(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

module.exports = new Productye();