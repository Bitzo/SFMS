/**
 * @Author: Cecurio
 * @Date: 2016/12/12 20:23
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/12 20:23
 * @Function:
 */
function treeNode(appName,appID,menuID, parentID, menuLevel,sortIndex,menuName, iconPath,url,memo,isActive,children) {
    this.ApplicationName = appName;
    this.ApplicationID = appID;
    this.MenuID = menuID;
    this.ParentID = parentID;
    this.MenuLevel = menuLevel;
    this.SortIndex = sortIndex;
    this.MenuName = menuName;
    this.IconPath = iconPath;
    this.Url = url;
    this.Memo = memo;
    this.IsActive = isActive;
    this.children = children;
}
//递归生成多层树结构
function getTreeMenu(data, pid) {
    var treelist = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].ParentID == pid) {
            var tree = new treeNode(data[i].ApplicationName,
                                    data[i].ApplicationID,
                                    data[i].MenuID,
                                    data[i].ParentID,
                                    data[i].MenuLevel,
                                    data[i].SortIndex,
                                    data[i].MenuName,
                                    data[i].IconPath,
                                    data[i].Url,
                                    data[i].Memo,
                                    data[i].IsActive,
                                    getTreeMenu(data, data[i].MenuID));

            treelist.push(tree);
        }
    }
    return treelist;
}

exports.getTreeMenu = getTreeMenu;