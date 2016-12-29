/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('selectController', function($scope, $http,$q,baseService) {
       //应用名称
        $http({
            method:'get',
            url: '/app'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{}
            }
        }).
        success(function(response) {
            console.log(response)
            $scope.applicationNames=response.data;
        }).
        error(function(response) {
            console.log(response)
        });

       //角色名称
        $http({
            method:'get',
            url: '/backrole' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{}
            }
        }).
        success(function(response) {
            console.log(response)
            $scope.roleNames=response.data;
        }).
        error(function(response) {
            console.log(response)
        });

       //所在学院
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_academy"
                }
            }
        }).
        success(function(response) {
            $scope.college=response.data;
        }).
        error(function(response) {
        });

        //所在班级
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_cls"
                }
            }
        }).
        success(function(response) {
            console.log(response)
            $scope.cls=response.data;
        }).
        error(function(response) {
            console.log(response)
        });
    //所在班级
    $scope.collegeChanged = function() {
        console.log($scope.formdata.CollegeID)
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_cls",
                    ParentID:$scope.formdata.CollegeID
                }
            }
        }).
        success(function(response) {
            console.log(response)
            $scope.cls=response.data;
        }).
        error(function(response) {
            console.log(response)
        });

    }
      

})