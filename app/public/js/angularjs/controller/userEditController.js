/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('userEditController', function($scope, $http,$q,baseService) {
      //应用名称
        $http({
            method:'get',
            url: '/app'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{}
            }
        }).
        success(function(response) {
            $scope.applicationNames=response.data;
        }).
        error(function(response) {
        });

       //角色名称
        $http({
            method:'get',
            url: '/backrole' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{}
            }
        }).
        success(function(response) {
            $scope.roleNames=response.data;
        }).
        error(function(response) {
        });

       //所在学院
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_academy"
                }
            }
        }).
        success(function(response) {
            console.log(response)
            $scope.college=response.data;
        }).
        error(function(response) {
        });

        //所在班级初始化     
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_cls",
                    ParentID:$scope.paginationConf.formdata.CollegeID
                }
            }
        }).
        success(function(response) {
            $scope.cls=response.data;
        }).
        error(function(response) {
        });

        //所在班级动态添加
        $scope.collegeChanged = function() {
            console.log($scope.formdata.CollegeID)
            $http({
                method:'get',
                url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                params:{
                    isPaging:1,
                    pageindex:1,
                    pagesize:10,
                    f:{
                        Category:"dc_cls",
                        ParentID:$scope.paginationConf.formdata.CollegeID
                    }
                }
            }).
            success(function(response) {
                $scope.cls=response.data;
            }).
            error(function(response) {
            });
        }
})