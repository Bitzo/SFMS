/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('jitgoodsAddController', function($scope, $http,$q,baseService) {
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
            $scope.StockArea=response.data;
        }).
        error(function(response) {
        });

        $http({
            method:'get',
            url: '/jinkeBro/staff' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    StaffType:3,
                    IsActive : 1
                }
            }
        }).
        success(function(response) {
            $scope.CreateUsers=response.data;
        }).
        error(function(response) {
        });

        $http({
            method:'get',
            url: '/jinkeBro/staff' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    StaffType:1,
                    IsActive : 1
                }
            }
        }).
        success(function(response) {
            $scope.Suppliers=response.data;
        }).
        error(function(response) {
        });
})