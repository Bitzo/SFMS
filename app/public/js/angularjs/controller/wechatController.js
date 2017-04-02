/**
 * @Author: Cecurio
 * @Date: 2017/3/31 18:43
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/3/31 18:43
 * @Function:
 */
var App = angular.module('wechatApp',[]);
App.controller('wechatshowpersonalorder', ['$scope', '$http', function ($scope, $http) {
    $scope.personalOrders = [
        {
            ProductID : 1,
            ProductName : "dongsichu"
        },{
            ProductID : 2
        }
    ];

    $scope.init = function () {

        $http({
            method : 'get',
            url : 'jinkeBro/order/wechat',
            params : {
                f : {
                    WechatUserCode : "oW6zYv_xgJu0MbJrmM70X7blPpYo" 
                }
            }
        }).
        success(function(response) {
            $scope.orders = response.data;
        }).
        error(function(response) {
            alert(response.msg);
        });
    };

    $scope.init();

}]).controller('wechatProductController', ['$scope', '$http', function ($scope, $http) {

    var length = 0;
    $scope.init = function () {

        $http({
            method : 'get',
            url : 'jinkeBro/product/wechat',
            params : {
                f : {
                    OnSale : 1
                }
            }
        }).
        success(function (response) {
            $scope.products = response.data;
            length = response.data.length;
            for (var i=0; i<length; ++i) {
                ($scope.products[i])['OrderCount'] = 0;
            }
        }).
        error(function (response) {
            alert(response.msg);
        });

    };

    $scope.init();

    $scope.orders = [];

    $scope.submitOrder = function () {
        var orders = [];
        var formdata = {};
        for (var i=0; i<$scope.products.length; i++) {
            if ($scope.products[i].OrderCount) {
                orders.push({
                    ProductID : $scope.products[i].ProductID,
                    OrderCount : $scope.products[i].OrderCount
                });
            }
        }

        var wechatCode = "oW6zYv4SQMzjk1-Ygj6eVTqXSxaM"
        formdata['orderProduct'] = orders;
        formdata['wechatUserCode'] = wechatCode;

        $http({
            method : 'post',
            url : 'wechat/addOrder',
            data : {
                formdata : formdata
            }
        }).
        success(function (response) {
            if (!response.isSuccess) {
                alert(response.msg)
            }
            alert(response.msg);
        }).
        error(function (response) {
            alert(response.msg);
        });

    };


}]);
