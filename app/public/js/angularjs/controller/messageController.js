/**
 * @Author: bitzo
 * @Date: 2017/3/30 18:42
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/3/30 18:42
 * @Function:
 */

myApp.controller('messageController', function($scope, $http,$q,baseService,$location) {
    $scope.datas = {};
    $http({
        method:'get',
        url: '/sfms/api/message'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        params:{
            isPaging:1,
            pageindex:1,
            pagesize:10,
            f:{
                isActive : 1
            }
        }
    }).
    success(function(response) {
        $scope.datas=response.data;
        console.log($scope.datas.length)
        $scope.datas.push({
            MessageTitle:'暂无通知'
        })
    }).
    error(function(response) {

    });
});