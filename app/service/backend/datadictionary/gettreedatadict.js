/**
 * @Author: Cecurio
 * @Date: 2016/12/10 21:31
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/10 21:31
 * @Function:
 */
function treeNode(id, pid, level,category,code,value, children) {
    this.DictionaryID = id;
    this.ParentID = pid;
    this.DictionaryLevel = level;
    this.Category = category;
    this.DictionaryCode = code;
    this.DictionaryValue = value;
    this.children = children;
}
//递归生成多层树结构
function getTreeDatadict(data, pid) {
    var treelist = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].ParentID == pid) {
            var tree = new treeNode(data[i].DictionaryID, data[i].ParentID, data[i].DictionaryLevel,data[i].Category,data[i].DictionaryCode, data[i].DictionaryValue,getTreeDatadict(data, data[i].DictionaryID));
            treelist.push(tree);
        }
    }
    return treelist;
}

exports.getTreeDatadict = getTreeDatadict;