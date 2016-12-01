/**
 * @Author: bitzo
 * @Date: 2016/11/30 19:53
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/11/30 19:53
 * @Function: 项目新增
 */
var db_sfms = appRequire('db/db_sfms');
var projectModel = appRequire('model/sfms/project/projectbaseinfo');
var config = appRequire('config/config');
var logger = appRequire("util/loghelper").helper;

//项目新增
exports.addProject = function (data, callback) {
    var insert_sql = 'insert into jit_projectbaseinfo set ProjectName = ?, ' +
                'ProjectDesc = ?, ProjectID = ?, ProjectManageID = ?, ' +
                'ProjectManageName = ?, ProjectEndTime = ?, ProjectTimeLine = ?, ' +
                'CreateTime = ?, OperateUser = ?, EditTime = ?, EditUser = ?, ' +
                'ProjectStatus = ?, ProjectPrice = ?',
        time = new Date(),
        value = [data.ProjectName, data.ProjectDesc, data.ProjectID, data.ProjectManageID, data.ProjectManageName,
                data.ProjectEndTime, data.ProjectTimeLine, time, data.OperateUser, time, data.EditUser,
                data.ProjectStatus, data.ProjectPrice];

    console.log(time);
    console.log(value);
    console.log('新增项目' + insert_sql);

    db_sfms.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            console.log(00);
            callback(true, '连接数据库失败');
            return;
        }

        connection.query(insert_sql, value, function(err, results) {
            if (err) {
                callback(true, '新增失败');
                return;
            }
            callback(false, results);
            connection.release();
        });
    });
}