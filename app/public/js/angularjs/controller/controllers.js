// Declare angular JS level module wich depends on filters, and services
var myApp = angular.module('myApp',[])
myApp.controller('formController', ['$scope', '$http', function($scope, $http) {
    $scope.tips = '用户登录';
    $scope.codesrc="/generatecode";
    function  changeCode() {
        console.log($scope.codeSrc);
        $scope.codesrc = '/generatecode';
        console.log($scope.codeSrc);
    }
    $scope.changeCode = function() {
        changeCode();
    };
    changeCode();
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
                localStorage.setItem('jit_token',response.access_token);
                localStorage.setItem('jit_key',response.data.accountId);
                location.href = './index';
            } else {
                alert(response.msg);
                location.reload();
            }
        }).
        error(function(response) {
            if (response && response.data && !response.isSuccess) {
                alert(response.data.msg);
            } else {
                alert('登录失败!');
            }
            location.reload();
        });
    };
}]);