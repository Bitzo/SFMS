/**
 * @Author: luozQ
 * @Date:   2016-11-14 22:42:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-15 10:12:38
 *  @Function: 将功能点转成多层树形结构
 */

function treeNode(id, pid, text, children) {
    this.id = id;
    this.pid = pid;
    this.text = text;
    this.children = children;
}
//递归生成多层树结构
function getTreeFunction(data, pid) {
    var treelist = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].ParentID == pid) {
            var tree = new treeNode(data[i].FunctionID, data[i].ParentID, data[i].FunctionName, getTreeFunction(data, data[i].FunctionID));
            treelist.push(tree)
        }
    }
    return treelist;
}

exports.getTreeFunction = getTreeFunction;
