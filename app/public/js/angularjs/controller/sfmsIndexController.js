/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('sfmsIndexController', function($scope, $http,$q,baseService) {  
        //绩效类型
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_kpitype"
                }
            }
        }).
        success(function(response) {
            $scope.kpitype=response.data;
            console.log($scope.kpitype);
        }).
        error(function(response) {
        });

          //绩效账户管理项目
                console.log($scope.paginationConf.formdata.UserID);
                $http({
                    method:'get',
                    url: '/sfms/api/project/user' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                    params:{
                        pageindex:1,
                        pagesize:10,
                        f:{
                            UserID: '',
                        }
                    }
                }).
                success(function(response) {
                    console.log(response);
                    $scope.ProjectNames=response.data;
                }).
                error(function(response) {
                });

         
        //绩效账户管理项目随用户的变化而变化
            $scope.userKpiChanged = function() {
                console.log($scope.formdata.UserID)
                $http({
                    method:'get',
                    url: '/sfms/api/project/user' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                    params:{
                        pageindex:1,
                        pagesize:10,
                        f:{
                            UserID:$scope.paginationConf.formdata.UserID
                        }
                    }
                }).
                success(function(response) {
                    $scope.ProjectNames=response.data;
                }).
                error(function(response) {
                });

            }

})