// Declare angular JS level module wich depends on filters, and services
myApp.config(function($routeProvider) {
   $routeProvider.
     when('/',{
         templateUrl: 'embedded.home.html',
         controller: 'HomeController'
     }).
     when('/computers',{
         template:'这是电脑页面',
         controller: 'HomeController'
     }).
     when('/printers',{
         template:'这是打印机页面',
         controller: 'HomeController'
     }).
     otherwise({
         redirectTo:'/'
     });
});