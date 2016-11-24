
/**
 * Created by Administrator on 2016/11/21.
 */
var myApp = angular.module('myApp', ['ngRoute','jason.pagination']).config(function($routeProvider) {
    $routeProvider.
    when('/sfms/index',{
        templateUrl: 'backend/index'
        // controller: 'HomeController'
    }).
    when('/computers',{
        template:'这是电脑页面',
        //controller: 'HomeController'
    }).
    when('/printers',{
        template:'这是打印机页面',
        //controller: 'HomeController'
    }).
    otherwise({
        redirectTo:'/'
    });


});
myApp.run(['$rootScope', '$window', '$location', '$log', function ($rootScope, $window, $location, $log) {
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
    var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

    function locationChangeStart(event) {
        $log.log('locationChangeStart');
    }

    function locationChangeSuccess(event) {
        $log.log('locationChangeSuccess');
        $log.log(arguments);
    }

    function routeChangeStart(event) {
        $log.log('routeChangeStart');
        $log.log(arguments);
    }

    function routeChangeSuccess(event) {
        $log.log('routeChangeSuccess');
        $log.log(arguments);
    }
}]).controller('baseController', function($scope){

})