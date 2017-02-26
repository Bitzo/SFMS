/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('sfmsApiFinanceController', function($scope, $http,$q,baseService) {    

        //实验室管理系统-绩效/财务管理-新增页面-项目名称  动态变化
        $scope.userKpiChanged = function() {
            console.log($scope.formdata.UserID)
            $http({
                method:'get',
                url: '/sfms/api/project/user' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                params:{
                    isPaging:1,
                    pageindex:1,
                    pagesize:10,
                    f:{
                        UserID:$scope.formdata.UserID
                    }
                }
            }).
            success(function(response) {
                $scope.ProjectNames=response.data;
            }).
            error(function(response) {
            });

        }

         //实验室管理系统-绩效/财务管理-编辑页面-项目名称  初始化
        console.log($scope.paginationConf.formdata.UserID);
        $http({
            method:'get',
            url: '/sfms/api/project/user' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
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

         
        //实验室管理系统-绩效/财务管理-编辑页面-项目名称  动态变化
        $scope.userKpiEditChanged = function() {
            console.log($scope.formdata.UserID)
            $http({
                method:'get',
                url: '/sfms/api/project/user' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                params:{
                    isPaging:1,
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