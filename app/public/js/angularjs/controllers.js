// Declare angular JS level module wich depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('formController', ['$scope','$http',  function ($scope,$http) {
    $scope.tips = '用户登录';
    $scope.submit = function(userdata){
        $http({
        method:'POST',
        url:"./login",
        data:{
             'account':userdata.username,
             'password':userdata.password
             }    
        }).
        success(function(response) {
         if (response.isSuccess){
               console.log ('登录成功');
               location.href='./index';
               alert(response.msg);
         } else{

         }
       }).
       error(function(response) {
           console.log ('登录失败');
           alert(response.msg);
           location.href='error';
    });
    };
}])


