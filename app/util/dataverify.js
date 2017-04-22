/**
 * @Author: Cecurio
 * @Date: 2017/2/25 20:57
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/2/25 20:57
 * @Function: 数据校验
 */
var DataVerify = function () {

};

/**
 *判断是否是整数
 * @param str
 * @returns {boolean}
 */
DataVerify.prototype.isNumeric = function (str) {
    if ((typeof str) == 'string' || (typeof str) == 'number') {
        var numeric = /^[-+]?[0-9]+$/;
        return numeric.test(str);
    }
    return false;
};

/**
 * 判断一个变量是否为空或者未定义或者null
 * @param data
 * @returns {boolean}
 */
DataVerify.prototype.isNull = function(data){
    return (data == "" || data == undefined || data == null);
};


DataVerify.prototype.isUndefined = function(data){
    return (data == undefined);
};

DataVerify.prototype.isUndefinedArray = function(keyArr,valueArr) {
    if ((keyArr instanceof Array) && (valueArr instanceof Array)) {
        var keyLength = keyArr.length;
        var valueLength = valueArr.length;

        if (keyLength == valueLength) {
            for (var i=0;i<keyLength;i++) {
                if (keyArr[i] == undefined) {
                    return {
                        isRight : false,
                        msg : valueArr[i] + ' 为必填项!'
                    };
                }
            }
        }
    }

    return {
        isRight : true
    };
};

DataVerify.prototype.isNumericArray = function(keyArr,valueArr) {
    if ((keyArr instanceof Array) && (valueArr instanceof Array)) {
        var keyLength = keyArr.length;
        var valueLength = valueArr.length;

        if (keyLength == valueLength) {
            for (var i=0; i<keyLength; i++) {
                if (!(DataVerify.prototype.isNumeric(keyArr[i])) && keyArr[i] != '') {
                    return {
                        isRight : false,
                        msg : valueArr[i] + ' 应该是数字类型!'
                    };
                }
            }
        }
    }

    return {
        isRight : true
    };
};


module.exports = new DataVerify();