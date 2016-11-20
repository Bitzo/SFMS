/**
 * @Author: snail
 * @Date: 2016/11/18 22:32
 * @Last Modified by: Cecurio
 * @Last Modified time: 
 * @Function: menuservice的单元测试
 */
require('../global_bootstrap')
var should = require('should');
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

    },
    insertMenuID = -1;

describe("菜单功能单元测试", function() {
    it("菜单新增", function(done) {
        menuService.menuInsert(data, function(err, result) {
            if (err) return done(err);
            result.insertId.should.be.above(0).and.should.be.a.Number;
            insertMenuID = result.insertId;
            done();
        });
    });

    it("菜单修改", function(done) {
        data.MenuID = insertMenuID;
        data.Memo = "测试菜单修改";
        data.IsActive = 0;
        menuService.menuUpdate(data, function(err, result) {
            if (err) {
                return done(err);
            }
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });



    it("树形展示菜单",function (done) {
        var userData = {
            "userID" : 1
        }
        menuService.queryAllMenusFormTree(userData,function (err,result) {
            if(err){
                return done(err);
            }
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("菜单查询",function (done) {
        var queryData = {
            "MenuID" : insertMenuID
        }
        menuService.queryAllMenus(queryData,function (err, result) {
            if(err){
                return done(err);
            }
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("通过UserID查询用户菜单",function (done) {
        var userData = {
            "userID" : 1
        }
        menuService.queryRoleByUserID(userData,function (err, result) {
            if(err){
                return done(err);
            }
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });

    it("通过userID查询用户角色",function (done) {
        var userData = {
            "userID" : 1
        }
        menuService.queryMenuByUserID(userData,function (err, result) {
            if(err){
                return done(err);
            }
            result.length.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });


    it("菜单逻辑删除",function (done) {
        var deleteData = {
            "MenuID" : insertMenuID
        }
        menuService.menuDelete(deleteData,function (err, result) {
            if(err){
                return done(err);
            }
            result.affectedRows.should.be.above(0).and.should.be.a.Number;
            done();
        });
    });


});