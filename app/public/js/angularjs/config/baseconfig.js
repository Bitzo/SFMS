/**
 * Created by Administrator on 2016/11/21.
 */
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']).config(function($routeProvider) {
    $routeProvider.
    when('/sfms/index', {
        templateUrl: '/sfms/index'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            // controller: 'HomeController'
    }).
    when('/sfms/user', {
        templateUrl: '/sfms/user'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/userinfo', {
        templateUrl: '/sfms/userinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/role', {
        templateUrl: '/sfms/role'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/roleAdd', {
        templateUrl: '/sfms/roleAdd'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/application', {
        templateUrl: '/sfms/application'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/applicationinfo', {
        templateUrl: '/sfms/applicationinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/menu', {
        templateUrl: '/sfms/menu'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/menuinfo', {
        templateUrl: '/sfms/menuinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
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
   $scope.menus = [];

    function getList() {
        $http({
            method: 'get',
            url: "/menu/1?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            $scope.menus = response.data.Menu;
            console.log($scope.menus);
        }).
        error(function(response) {
            console.log(response);
        });
    }
   getList();
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        action: "1111"
    }
    $scope.f={};
    function getInit(){
        $http({
            method:'get',
            url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:$scope.paginationConf.currentPage,
                pagesize:$scope.paginationConf.itemsPerPage,
                f:$scope.f
            }
        }).
        success(function(response) {
            var  data=response.data;
            $scope.datas=response.data;
            $scope.paginationConf.totalItems= response.dataNum;

        }).
        error(function(response) {

        });
    }

    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15
    }
    $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
    $scope.$watch( 'paginationConf.action',getInit);
    $scope.search=function(){
        getInit();
    }

     $scope.user={};
     $scope.submitusera = function(user) {
         console.log('hhh');
         $http({
            method:'post',
             url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            // url:"/backuser?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                user:$scope.user
            }
        }).
        success(function(response) {
           console.log($scope.user);
           console.log('yes');

        }).
        error(function(response) {
           console.log($scope.user);
           console.log('no');
        });
    };

    $scope.menu={};
     $scope.submitmenua = function(menu) {
         console.log('menu');
         $http({
            method:'post',
             url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            // url:"/menu?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                menu:$scope.menu
            }
        }).
        success(function(response) {
           console.log($scope.menu);
           console.log('yes');

        }).
        error(function(response) {
           console.log($scope.menu);
           console.log('no');
        });
    };

    $scope.app={};
     $scope.submitappa = function(app) {
         console.log('app');
         $http({
            method:'post',
             url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            // url:"/app?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                app:$scope.app
            }
        }).
        success(function(response) {
           console.log($scope.app);
           console.log('yes');

        }).
        error(function(response) {
           console.log($scope.app);
           console.log('no');
        });
    };



})