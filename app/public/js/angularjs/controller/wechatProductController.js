/**
 * @Author: Cecurio
 * @Date: 2017/3/31 18:19
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/3/31 18:19
 * @Function:
 */
myApp.controller('wechatProductController', function($scope, $http,$q,baseService) {
    //库存区域
    $http({
        method:'get',
        url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        params:{
            isPaging:1,
            pageindex:1,
            pagesize:10,
            f:{
                Category:"dc_stockArea"
            }
        }
    }).
    success(function(response) {
        $scope.StockArea = response.data;
    }).
    error(function(response) {

    });

});