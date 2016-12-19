/**
 * @Author: luozQ
 * @Date:   2016-11-14 22:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-15 10:12:38
 *  @Function: 将功能点转成多层树形结构
 */
var appService = appRequire('service/backend/application/applicationservice');
var logger = appRequire("util/loghelper").helper;

function treeNode(appid, id, pId, name, children) {
    this.appid = appid;
    this.id = id;
    this.pId = pId;
    this.name = name;
    this.children = children;
}
//递归生成多层树结构
function getMultiTree(data, pid) {
    var treelist = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].ParentID == pid) {
            var tree = new treeNode(data[i].ApplicationID, data[i].FunctionID, data[i].ParentID, data[i].FunctionName, getMultiTree(data, data[i].FunctionID));
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
    l = appService.queryAllApp(d, function (err, results) {
        if (err) {
            console.log('queryAllApperr');
            callback(true);
            return;
        }
        if (results != undefined && results.length > 0) {
            var list = [];
            //将应用作用应用的根节点
            for (var j = 0; j < results.length; j++) {
                var tree = { 'id': -1, 'pId': -1, 'name': results[j].ApplicationName, children: [] };
                for (var i = 0; i < treelist.length; i++) {
                    if (treelist[i].appid == results[j].ID) {
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