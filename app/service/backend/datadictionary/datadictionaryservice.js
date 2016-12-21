/**
 * @Author: Cecurio
 * @Date: 2016/12/3 12:56
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/3 12:56
 * @Function:
 */
var datadictionaryDal = appRequire('dal/backend/datadictionary/datadictionarydal'),
    logger = appRequire('util/loghelper').helper,
    getTree = appRequire('service/backend/datadictionary/gettreedatadict');

//字典平面展示
exports.queryDatadictionary = function (data,callback) {
    datadictionaryDal.queryDatadictionary(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo('queryDatadictionary');
        callback(false, results);
    });
}

//字典树
exports.queryDatadictionaryFormTree = function (data, callback) {
    datadictionaryDal.queryDatadictionary(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo('queryDatadictionaryFormTree');
        //形成树形的字典结构
        results = getTree.getTreeDatadict(results,0);
        callback(false, results);
    });
}

//查询对应字典的角色个数
exports.countAllDataDicts = function (data, callback) {
    datadictionaryDal.countAllDataDicts(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('countAllDataDicts');
        console.log('countAllDataDicts');
        callback(false, results);
    })
}

//查询对应字典的角色个数
exports.countAllDataDictsBySubcode = function (data, callback) {
    datadictionaryDal.countAllDataDictsBySubcode(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        logger.writeInfo('countAllDataDictsBySubcode func in service ');
        console.log('countAllDataDictsBySubcode func in service ');
        callback(false, results);
    })
}

//字典新增
exports.datadictionaryInsert = function (data,callback) {
    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                console.log("[service]menu insert 传入的值存在空值");
                return false;
            }
        }
        return true;
    }

    //传入的值存在空值
    if(!checkData(data)){
        callback(true);
        return ;
    }

    datadictionaryDal.datadictionaryInsert(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('datadictionaryInsert func in service');
        logger.writeInfo('datadictionaryInsert func in service');
        callback(false,results);
    });
}

//字典编辑
exports.datadictionaryUpdate = function (data,callback) {
    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                console.log("[service]datadictionaryUpdate func 传入的值存在空值");
                console.log(data[key]);
                return false;
            }
        }
        return true;
    }

    //传入的值存在空值
    if(!checkData(data)){
        callback(true);
        return ;
    }

    datadictionaryDal.datadictionaryUpdate(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('datadictionaryUpdate func in service');
        logger.writeInfo('datadictionaryUpdate func in service');
        callback(false,results);
    });
}

//物理删除字典
exports.datadictionaryDelete = function (data,callback) {
    datadictionaryDal.datadictionaryDelete(data,function (err,results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('datadictionaryDelete func in service');
        logger.writeInfo('datadictionaryDelete func in service');
        callback(false,results);
    });
}

//逻辑删除字典
exports.datadictionaryDeleteLogically = function (data, callback) {
    datadictionaryDal.datadictionaryUpdate(data,function (err, results) {
        if(err){
            callback(true);
            return ;
        }

        console.log('datadictionaryDeleteLogically func in service');
        logger.writeInfo('datadictionaryDeleteLogically func in service');
        callback(false,results);
    });
}

exports.queryDatadictionaryBySubcode = function (data,callback) {

    datadictionaryDal.queryDatadictionaryBySubcode(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo('queryDatadictionaryBySubcode func in service ');
        console.log('queryDatadictionaryBySubcode func in service ');

        callback(false, results);
    })
}
exports.queryDatadictionaryByID = function (data,callback) {
    /**
     *  data = {
     *       'DictionaryID': [1 , 2, 3]
     *   }
     */
    datadictionaryDal.queryDatadictionaryByID(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }

        logger.writeInfo('queryDatadictionary');
        callback(false, results);
    })
}