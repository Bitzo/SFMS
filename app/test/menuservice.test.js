/**
 * @Author: snail
 * @Date: 2016/11/18 22:32
 * @Last Modified by: 
 * @Last Modified time: 
 * @Function: menuservice的单元测试
 */
require('../global_bootstrap')
require('should');
var menuService = appRequire('service/backend/menu/menuservice');

var data = {
    "ApplicationID": 1,
    "MenuLevel": 1,
    "ParentID": 0,
    "SortIndex": 1,
    "MenuName": "单元测试菜单",
    "IconPath": '',
    "Url": '',
    "Memo": '描述',
    "IsActive": 1
};

describe("菜单功能单元测试", function() {
    it("菜单新增", function() {
        // menuService.menuInsert(data, function(err, result) {
        //     err.should.eql(undefined);
        // });
    });

});