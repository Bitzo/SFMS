/**
 * Created by Administrator on 2016/11/21.
 */
myApp.controller('formController', ['$scope','$http',  function ($scope,$http) {
    $scope.tips = '用户登录';
    $scope.submit = function(){
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
                location.href='./index'
            } else{

            }
        }).
        error(function(response) {
            location.href='error';
        });
    };
}])