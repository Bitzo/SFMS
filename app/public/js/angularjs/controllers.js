// Declare angular JS level module wich depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('formController', ['$scope','$http',  function ($scope,$http) {
    $scope.tips = '用户登录';
    $scope.changeCode = function(){
        console.log($scope.codeSrc);
        $scope.codeSrc = '/generatecode?date='+new Date();
        console.log($scope.codeSrc);
    };
    $scope.submit = function(userdata){
        $http({
        method:'POST',
        url:"/login",
        data:{
             'username':userdata.username,
             'password':userdata.password,
             'code':userdata.code
             }    
        }).
        success(function(response) {
             location.href='./index';
         if (response.isSuccess){
               console.log ('登录成功');
              
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


