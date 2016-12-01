/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:43
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:43
 * @Function: 项目服务
 */

var projectDAL = appRequire('dal/sfms/project/projectdal.js');
//引入日志中间件
var logger = appRequire("util/loghelper").helper;

//项目基本信息新增
exports.addProject = function(data, callback) {
    projectDAL.addProject(data, function (err, results) {
        if (err) {
            callback(true, '新增失败');
            return;
        }
        console.log('新增项目');
        callback(false, results);
    })
}

//项目基本信息修改
exports.updateProject = function(data, callback) {

    function checkData(data) {
        for (var key in data) {
            if(data[key] === undefined) {
                console.log(key);
                return false;
            }
        }
        return true;
    }

    if(!checkData(data))
    {
        callback(true, '数据有误');
        return;
    }
    console.log('修改项目');
    projectDAL.updateProject(data, function (err, results) {
        if (err) {
            callback(true, '修改失败');
            return;
        }
        console.log('修改项目');
        callback(false, results);
    })
}
