//实现role的功能，待写
var role=angular.module('role',[]);
role.controller('roleCtrl',function($scope,$http){
    $http.get("")
    .success(function(response){
        $scope.item=response.;
    });
})