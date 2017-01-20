/**
 * Created by Administrator on 2016/11/21.
 */
var accesstokenstring = localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key');
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination', 'treeGrid']);

myApp.config(function($routeProvider) {
    $routeProvider.
    when('/backend/index', {
        templateUrl: '/index?access_token=' + accesstokenstring,
    }).
    when('/backend/user', {
        templateUrl: '/user?access_token=' + accesstokenstring,
    }).
    when('/backend/userinfo', {
        templateUrl: '/userinfo?access_token=' + accesstokenstring,
    }).
    when('/backend/useredit', {
        templateUrl: '/useredit?access_token=' + accesstokenstring,
    }).
    when('/backend/usermenu', {
        templateUrl: '/usermenu?access_token=' + accesstokenstring,
    }).
    when('/backend/userrole', {
        templateUrl: '/userrole?access_token=' + accesstokenstring,
    }).
    when('/backend/role', {
        templateUrl: '/role?access_token=' + accesstokenstring,
    }).
    when('/backend/roleAdd', {
        templateUrl: '/roleAdd?access_token=' + accesstokenstring,
    }).
    when('/backend/roleEdit', {
        templateUrl: '/roleEdit?access_token=' + accesstokenstring,
    }).
    when('/backend/function', {
        templateUrl: '/function' + "?access_token=" + accesstokenstring,
    }).
    when('/backend/functionAdd', {
        templateUrl: '/functionAdd' + "?access_token=" + accesstokenstring,
    }).
    when('/backend/functionEdit', {
        templateUrl: '/functionEdit' + "?access_token=" + accesstokenstring,
    }).
    when('/backend/application', {
        templateUrl: '/application?access_token=' + accesstokenstring,
    }).
    when('/backend/applicationinfo', {
        templateUrl: '/applicationinfo?access_token=' + accesstokenstring,
    }).
    when('/backend/applicationedit', {
        templateUrl: '/applicationedit?access_token=' + accesstokenstring,
    }).
    when('/backend/menu', {
        templateUrl: '/menu?access_token=' + accesstokenstring,
    }).
    when('/backend/menuinfo', {
        templateUrl: '/menuinfo?access_token=' + accesstokenstring,
    }).
    when('/backend/menuedit', {
        templateUrl: '/menuedit?access_token=' + accesstokenstring,
    }).
    when('/backend/operationlog', {
        templateUrl: '/operationlog?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectLead', {
        templateUrl: '/sfms/projectLead?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectLeadEdit', {
        templateUrl: '/sfms/projectLeadEdit?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectManage', {
        templateUrl: '/sfms/projectManage?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectManageAdd', {
        templateUrl: '/sfms/projectManageAdd?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectManageEdit', {
        templateUrl: '/sfms/projectManageEdit?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectRemark', {
        templateUrl: '/sfms/projectRemark?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectRemarkAdd', {
        templateUrl: '/sfms/projectRemarkAdd?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectRemarkEdit', {
        templateUrl: '/sfms/projectRemarkEdit?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectManageRemark', {
        templateUrl: '/sfms/projectManageRemark?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectManageRemarkAdd', {
        templateUrl: '/sfms/projectManageRemarkAdd?access_token=' + accesstokenstring,
    }).
    when('/sfms/projectManageRemarkEdit', {
        templateUrl: '/sfms/projectManageRemarkEdit?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpi', {
        templateUrl: '/sfms/kpi?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpiAdd', {
        templateUrl: '/sfms/kpiAdd?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpiEdit', {
        templateUrl: '/sfms/kpiEdit?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpiManage', {
        templateUrl: '/sfms/kpiManage?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpiManageAdd', {
        templateUrl: '/sfms/kpiManageAdd?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpiManageCheck', {
        templateUrl: '/sfms/kpiManageCheck?access_token=' + accesstokenstring,
    }).
    when('/sfms/kpiCount', {
        templateUrl: '/sfms/kpiCount?access_token=' + accesstokenstring,
    }).
    when('/sfms/finance', {
        templateUrl: '/sfms/finance?access_token=' + accesstokenstring,
    }).
    when('/sfms/financeAdd', {
        templateUrl: '/sfms/financeAdd?access_token=' + accesstokenstring,
    }).
    when('/sfms/financeEdit', {
        templateUrl: '/sfms/financeEdit?access_token=' + accesstokenstring,
    }).
    when('/sfms/financeManage', {
        templateUrl: '/sfms/financeManage?access_token=' + accesstokenstring,
    }).
    when('/sfms/financeManageCheck', {
        templateUrl: '/sfms/financeManageCheck?access_token=' + accesstokenstring,
    }).
    when('/sfms/signManage', {
        templateUrl: '/sfms/signManage?access_token=' + accesstokenstring,
    }).
    when('/sfms/signPersonal', {
        templateUrl: '/sfms/signPersonal?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitorder', {
        templateUrl: '/jinkeBro/jitorder',
    }).
    when('/jinkeBro/jitorderAdd', {
        templateUrl: '/jinkeBro/jitorderAdd?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitorderEdit', {
        templateUrl: '/jinkeBro/jitorderEdit?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitinfo', {
        templateUrl: '/jinkeBro/jitinfo',
    }).
    when('/jinkeBro/jitgoods', {
        templateUrl: '/jinkeBro/jitgoods?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitgoodsAdd', {
        templateUrl: '/jinkeBro/jitgoodsAdd?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitgoodsEdit', {
        templateUrl: '/jinkeBro/jitgoodsEdit?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitstock', {
        templateUrl: '/jinkeBro/jitstock?access_token=' + accesstokenstring,
    }).
    when('/jinkeBro/jitstockAdd', {
        templateUrl: '/jinkeBro/jitstockAdd?access_token=' + accesstokenstring,
    }).
   
    
    otherwise({
        redirectTo: '/'
    });
}).controller('baseController', function($scope, $http,baseService) {
    //显示左侧菜单栏
    $scope.menus = [];

    function getList() {
        $http({
            method: 'get',
            url: "/backmenu?" + baseService.getPassToken(),
        }).
        success(function(response) {
            $scope.menus = response.data.Menu;
        }).
        error(function(response) {});
    }

}).filter('numToChin', function() {
    return function(val) {
        switch (val) {
            case 0:
                return '否';
            case 1:
                return '是';
            default:
                return '否';
        }
    }
}).filter('logType', function() {
    return function(val) {
        switch (val) {
            case 1:
                return '异常日志';
            case 2:
                return '常规日志';
            default:
                return '异常日志';
        }
    }
}).filter('signType', function() {
    return function(val) {
        switch (val) {
            case 0:
                return '签到';
            case 1:
                return '签退';
            default:
                return '无效记录';
        }
    }
})