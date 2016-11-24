
/**
 * Created by Administrator on 2016/11/21.
 */
myApp.config(function($routeProvider) {
    $routeProvider.
    when('/sfms/index',{
        templateUrl: 'sfms/index'
        // controller: 'HomeController'
    }).
    when('/backend/index',{
        templateUrl: 'backend/index'
       
    }).
    when('/backend/user',{
        templateUrl: 'backend/user'
     
    }).
    otherwise({
        redirectTo:'/'
    });


}).run(['$rootScope', '$window', '$location', '$log', function ($rootScope, $window, $location, $log) {
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
