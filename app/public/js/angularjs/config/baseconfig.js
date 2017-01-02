/**
 * Created by Administrator on 2016/11/21.
 */
var accesstokenstring = localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key');
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination','treeGrid']);

myApp.config(function($routeProvider) {
    $routeProvider.
    when('/backend/index', {
        templateUrl: '/index?access_token='+accesstokenstring,
            // controller: 'HomeController'
    }).
    when('/backend/user', {
        templateUrl: '/user?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/userinfo', {
        templateUrl: '/userinfo?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/useredit', {
        templateUrl: '/useredit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/role', {
        templateUrl: '/role?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/roleAdd', {
        templateUrl: '/roleAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/roleEdit', {
        templateUrl: '/roleEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/function', {
        templateUrl: '/function'+"?access_token=" +accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/functionAdd', {
        templateUrl: '/functionAdd'+"?access_token=" +accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/functionEdit', {
        templateUrl: '/functionEdit'+"?access_token=" +accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/application', {
        templateUrl: '/application?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/applicationinfo', {
        templateUrl: '/applicationinfo?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/applicationedit', {
        templateUrl: '/applicationedit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/menu', {
        templateUrl: '/menu?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/menuinfo', {
        templateUrl: '/menuinfo?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/menuedit', {
        templateUrl: '/menuedit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectLead', {
        templateUrl: '/sfms/projectLead?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectLeadEdit', {
        templateUrl: '/sfms/projectLeadEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManage', {
        templateUrl: '/sfms/projectManage?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManageAdd', {
        templateUrl: '/sfms/projectManageAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManageEdit', {
        templateUrl: '/sfms/projectManageEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectRemark', {
        templateUrl: '/sfms/projectRemark?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectRemarkAdd', {
        templateUrl: '/sfms/projectRemarkAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectRemarkEdit', {
        templateUrl: '/sfms/projectRemarkEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManageRemark', {
        templateUrl: '/sfms/projectManageRemark?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManageRemarkAdd', {
        templateUrl: '/sfms/projectManageRemarkAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManageRemarkEdit', {
        templateUrl: '/sfms/projectManageRemarkEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    
     when('/sfms/kpi', {
        templateUrl: '/sfms/kpi?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiAdd', {
        templateUrl: '/sfms/kpiAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiEdit', {
        templateUrl: '/sfms/kpiEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiManage', {
        templateUrl: '/sfms/kpiManage?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiManageAdd', {
        templateUrl: '/sfms/kpiManageAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiManageCheck', {
        templateUrl: '/sfms/kpiManageCheck?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
     when('/sfms/financeManage', {
        templateUrl: '/sfms/financeManage?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/financeManageAdd', {
        templateUrl: '/sfms/financeManageAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/financeManageCheck', {
        templateUrl: '/sfms/financeManageCheck?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/signManage', {
        templateUrl: '/sfms/signManage?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/signPersonal', {
        templateUrl: '/sfms/signPersonal?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/jinkeBro/jitorder', {
        templateUrl: '/jinkeBro/jitorder',
        //controller: 'HomeController'
    }).
    when('/jinkeBro/jitinfo', {
        templateUrl: '/jinkeBro/jitinfo',
        //controller: 'HomeController'
    }).
    when('/jinkeBro/jitgoods', {
        templateUrl: '/jinkeBro/jitgoods?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/jinkeBro/jitgoodsAdd', {
        templateUrl: '/jinkeBro/jitgoodsAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    otherwise({
        redirectTo: '/'
    });
}).run(['$rootScope', '$window', '$location', '$log', function($rootScope, $window, $location, $log) {
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
    var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

    function locationChangeStart(event) {
        if ($location.$$path == "") {
            event.preventDefault();
        }
    }

    function locationChangeSuccess(event) {
        $log.log('locationChangeSuccess');    
        $log.log(arguments);
        console.log($location.path());
    }

    function routeChangeStart(event) {
        $log.log('routeChangeStart');
        $log.log($location);
    }

    function routeChangeSuccess(event) {
        $log.log('routeChangeSuccess');
        $log.log(arguments);
    }
}]).controller('baseController', function($scope, $http) {
    
    //显示左侧菜单栏
   $scope.menus = [];
    function getList() {        
        $http({
            method: 'get',
            url: "/backmenu?access_token="+accesstokenstring,
        }).
        success(function(response) {
            $scope.menus = response.data.Menu;
        }).
        error(function(response) {
        });
    }

})
