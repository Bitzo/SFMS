/**
 * @Author: luozQ
 * @Date:   2016-11-14 22:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-12-25 10:12:38
 *  @Function: 将功能点转成多层树形结构
 */
var appService = appRequire('service/backend/application/applicationservice');
var logger = appRequire("util/loghelper").helper;

function treeNode(funcModel, children) {
    this.ApplicationID = funcModel.ApplicationID;
    this.FunctionID = funcModel.FunctionID;
    this.FunctionCode=funcModel.FunctionCode;
    this.ParentID = funcModel.ParentID;
    this.FunctionName=funcModel.FunctionName;
    this.Memo=funcModel.Memo;
    this.IsActive=funcModel.IsActive;
    this.FunctionLevel=funcModel.FunctionLevel;
    this.children = children;
}
//递归生成多层树结构
function getMultiTree(data, pid) {
    var treelist = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].ParentID == pid) {
            var tree = new treeNode(data[i], getMultiTree(data, data[i].FunctionID));
            treelist.push(tree)
        }
    }
    return treelist;
}
//将应用名称作为功能点的根节点
function getTreeFunction(data, callback) {
    var treelist = getMultiTree(data, 0);
    var d = {};
    //从应用表中查出所有应用
    appService.queryAllApp(d, function (err, results) {
        if (err) {
            console.log('queryAllApperr');
            callback(true);
            return;
        }
        if (results != undefined && results.length > 0) {
            var list = [];
            //将应用作为功能点的根节点
            for (var j = 0; j < results.length; j++) {
                var tree = { 'ApplicationID':results[j].ID,'FunctionID': 0, 'ParentID': -1, 'FunctionName': results[j].ApplicationName,'FunctionLevel':'0',children: [] };
                for (var i = 0; i < treelist.length; i++) {
                    if (treelist[i].ApplicationID == results[j].ID) {
                        tree.children.push(treelist[i]);
                    }
                }
                list.push(tree);
            }
            callback(false, list);
        }
    });
}
exports.getTreeFunction = getTreeFunction;