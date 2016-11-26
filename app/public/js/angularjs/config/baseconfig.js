/**
 * Created by Administrator on 2016/11/21.
 */
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']).config(function($routeProvider) {
    $routeProvider.
    when('/sfms/index', {
        templateUrl: 'sfms/index'
            // controller: 'HomeController'
    }).
    when('/sfms/user', {
        templateUrl: 'sfms/user',
        //controller: 'HomeController'
    }).
    when('/sfms/user-info', {
        templateUrl: 'sfms/user-info',
        //controller: 'HomeController'
    }).
    when('/sfms/application', {
        templateUrl: 'sfms/application',
        //controller: 'HomeController'
    }).
    when('/sfms/application-info', {
        templateUrl: 'sfms/application-info',
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
            method: 'GET',
            url: "/sfms/getmenu?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            data: {
                pageindex: 1,
                pagesize: 100,
                f: {}
            }
        }).
        success(function(response) {
            var data = response.datas;
            $scope.menus = JSON.parse(data);
        }).
        error(function(response) {

        });
    }
    getList();
})