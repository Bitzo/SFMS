// Declare angular JS level module wich depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute','jason.pagination']);
myApp.controller('formController', ['$scope', '$http', function($scope, $http) {
    $scope.tips = '用户登录';
    $scope.changeCode = function() {
        console.log($scope.codeSrc);
        $scope.codeSrc = '/generatecode?date=' + new Date();
        console.log($scope.codeSrc);
    };
    $scope.submit = function(userdata) {
        $http({
            method: 'POST',
            url: "/login",
            data: {
                'username': userdata.username,
                'password': userdata.password,
                'code': userdata.code
            }
        }).
        success(function(response) {
            if (response !== undefined && response.data !== undefined && response.data.isSuccess) {
                console.log('登录成功');
                location.href = './index';
            } else {

            }
        }).
        error(function(response) {
            console.log('登录失败');
            alert(response.msg);
            location.href = 'error';
        });
    };
}]);
//菜单显示
myApp.controller('menucontroller', ['$scope','$http',function ($scope,$http) {
    $scope.li = 'huhuhu';
    $http({
    method:'get',
    url:"/querymenus?userID=" + 1,
    // data:{
    //      'userID': 1,
    //      }    
    }).
    success(function(response) {
        $scope.menu = response.data.Menu;

    }).
    error(function(response) {
        console.log(response);
        
  });
 
}]);
//所有用户信息显示
myApp.controller('usercontroller', ['$scope','$http',function ($scope,$http) {
    $scope.AccountID = 'hhh';
    $http({
    method:'get',
    url:"/backuser" , 
    }).
    success(function(response) {
        console.log(response.data);
        $scope.info = response.data;
        
    }).
    error(function(response) {
        console.log(response);     
  });
}]);
//查询用户信息
myApp.controller('searchcontroller', ['$scope','$http',function ($scope,$http) {
    $scope.aaa = '查询';
    $http({
    method:'get',
    url:"/user" , 
    }).
    success(function(response) {
       
    }).
    error(function(response) {
         
  });
}]);