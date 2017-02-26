/**
 * @Author: Cecurio
 * @Date: 2016/12/3 12:56
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/3 12:56
 * @Function:
 */
var datadictionaryDal = appRequire('dal/backend/datadictionary/datadictionarydal'),
    logger = appRequire('util/loghelper').helper,
    getTree = appRequire('service/backend/datadictionary/gettreedatadict'),
    config = appRequire('config/config');

/**
 * 查询字典信息
 * @param data
  data = {
        "page": page,
        "pageNum": pageNum,
        "ApplicationID" : applicationID,
        "DictionaryID" : dictionaryID,
        "DictionaryLevel" : dictionaryLevel,
        "ParentID" : parentID,
        "Category" : category,
        "DictionaryCode" : dictionaryCode,
        "DictionaryValue" : dictionaryValue,
        "IsActive" : isActive,
        "isPaging" : isPaging
    };  // 全部可选
 * @param callback
 * 返回数据（类似于）
 * [{
    ApplicationID: 1,
    DictionaryID: 87,
    DictionaryLevel: 1,
    ParentID: 0,
    Category: 'dc_orderstatus',
    DictionaryCode: '1',
    DictionaryValue: '等待配送',
    Memo: '等待配送',
    IsActive: 1
},{
    ApplicationID: 1,
    DictionaryID: 87,
    DictionaryLevel: 1,
    ParentID: 0,
    Category: 'dc_orderstatus',
    DictionaryCode: '1',
    DictionaryValue: '等待配送',
    Memo: '等待配送',
    IsActive: 1
}]
 *
 */
exports.queryDatadictionary = function (data,callback) {
    var formdata = {
        pageManage : {
            page : data.page || 1,
            pageNum : data.pageNum || (config.pageCount),
            isPaging : data.isPaging || 0
        },
        datadict : {
            ApplicationID : data.ApplicationID || '',
            DictionaryID : data.DictionaryID || '',
            DictionaryLevel : data.DictionaryLevel || '',
            ParentID : data.ParentID || '',
            Category : data.Category || '',
            DictionaryCode : data.DictionaryCode || '',
            DictionaryValue : data.DictionaryValue || '',
            IsActive : data.IsActive || ''
        }
    };

    datadictionaryDal.queryDatadictionary(formdata, function (err, results) {
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

        callback(false, results);
    });
};


//字典新增
exports.datadictionaryInsert = function (data,callback) {
    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                logger.writeInfo("[service]menu insert 传入的值存在空值");
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

        logger.writeInfo('datadictionaryInsert func in service');
        logger.writeInfo('datadictionaryInsert func in service');
        callback(false,results);
    });
}

//字典编辑
exports.datadictionaryUpdate = function (data,callback) {
    function checkData(data) {
        for(var key in data){
            if(data[key] === undefined){
                logger.writeInfo("[service]datadictionaryUpdate func 传入的值存在空值");
                logger.writeInfo(data[key]);
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

        logger.writeInfo('datadictionaryUpdate func in service');
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

        logger.writeInfo('datadictionaryDeleteLogically func in service');
        callback(false,results);
    });
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