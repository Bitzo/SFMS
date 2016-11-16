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
//测试数据
//var data = [{ 'id': 1, 'pid': 0, 'text': '主节点' }, { 'id': 2, 'pid': 1, 'text': '分1' }, { 'id': 3, 'pid': 0, 'text': '主2' }, { 'id': 4, 'pid': 3, 'text': 211 }];

function getTreeFunction(data, pid) {
    var treelist = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].pid == pid) {
            var tree = new treeNode(data[i].id, data[i].pid, data[i].text, getTreeFunction(data, data[i].id));
            treelist.push(tree)
        }
    }
    return treelist;
}

exports.getTreeFunction = getTreeFunction;


//var tree = getTreeFunction(data, 0);
//console.log(tree[0].children)