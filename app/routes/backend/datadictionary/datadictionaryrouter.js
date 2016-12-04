/**
 * @Author: Cecurio
 * @Date: 2016/12/3 12:57
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/3 12:57
 * @Function:
 */
var express = require('express'),
    router = express.Router(),
    url = require('url');

//菜单业务逻辑组件
var datadictionaryService = appRequire('service/backend/datadictionary/datadictionaryservice'),
    logger = appRequire("util/loghelper").helper;

//查
router.get('/',function (req,res) {
    return res.json({
        title : 'datadictionary get'
    });
});

//增
router.post('/',function (req,res) {


    return res.json({
        title : 'datadictionary post'
    });
});

//改
router.put('/',function (req,res) {
    return res.json({
        title : 'datadictionary put'
    });
});

//删
router.delete('/',function (req,res) {
    return res.json({
        title : 'datadictionary delete'
    });
});

module.exports = router;