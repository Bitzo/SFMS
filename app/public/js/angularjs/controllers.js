// Declare angular JS level module wich depends on filters, and services
var myApp = angular.module('myApp', []);

// controllers
myApp.controller('formController', ['$scope','$http','$location', function ($scope,$http, $location) {
    $scope.tips = '用户登录';
    $scope.submit = function(userdata){
        $http({
        method:'POST',
        url:"/api/login",
        data:{
             'account':userdata.username,
             'password':userdata.password
             }    
        }).
        success(function(response) {
         if (response.isSuccess){
              $location.path('/index');
               console.log ('登录成功');
         } else{
             alert(response.msg)
         }
       }).
       error(function(response) {
           console.log ('登录失败');
    });
    };

}]);


