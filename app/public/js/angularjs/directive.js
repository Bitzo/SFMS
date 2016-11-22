// Declare angular JS level module wich depends on filters, and services
myApp.config(function($routeProvider) {
   $routeProvider.
     when('/user',{
         templateUrl: 'views/backend/user',
     }).
     when('/role',{
        templateUrl: '../role',
     }).
     when('/printers',{
         template:'这是打印机页面',
     }).
     otherwise({
         redirectTo:''
     });
});