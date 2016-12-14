/**
 * Created by Administrator on 2016/11/21.
 */
var accesstokenstring = localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key');
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']);

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
    otherwise({
        redirectTo: '/'
    });


//     when('/sfms/menuinfo', {
//         templateUrl: '/sfms/menuinfo?access_token='+accesstokenstring,
//         //controller: 'HomeController'
//     }).



});