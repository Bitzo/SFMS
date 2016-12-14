/**
 * @Author: luozQ
 * @Date:   2016-11-14 22:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-15 10:12:38
 *  @Function: 将功能点转成多层树形结构
 */

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
function getTreeFunction(data, pid) {
   var treelist= getMultiTree(data,pid);
   //此处从应用表中查出所有应用
    var applist = [{ 'appid': 1, 'appname': '金科小哥',isParent:true }, { 'appid': 2, 'appname': '实验室管理',isParent:true }];
    var list = [];
    for (var j = 0; j < applist.length; j++) {
        var tree = { 'id': -1, 'pId': -1, 'name': applist[j].appname, children: [] };
        for (var i = 0; i < treelist.length; i++) { 
            if (treelist[i].appid == applist[j].appid) {
                tree.children.push(treelist[i]);
            }
        }
        list.push(tree);
    }
    return list;
}
exports.getTreeFunction = getTreeFunction;
