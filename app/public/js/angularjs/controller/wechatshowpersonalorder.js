/**
 * @Author: Cecurio
 * @Date: 2017/3/31 18:43
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/3/31 18:43
 * @Function:
 */
var App = angular.module('App',[]);
App.controller('wechatshowpersonalorder', function($scope, $http,$q,baseService) {
    $scope.order = "这是订单啊";
    $scope.load = function () {
        console.log("进入");
        $http({
            method:'get',
            url: '/jinkeBro/order' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    OrderID : 528
                }
            }
        }).
        success(function(response) {
            $scope.orderInfo = response.data;
            console.log($scope.orderInfo);
        }).
        error(function(response) {

        });
    };

    $scope.load();
});

window.onload = function () {
    alert('diaoyong');
};