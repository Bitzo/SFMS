/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('jinkeBroIndexController', function($scope, $http,$q,baseService) {
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
            $scope.applicationNames=response.data;
        }).
        error(function(response) {
        });
       //所在学校
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_school_area"
                }
            }
        }).
        success(function(response) {
            $scope.school=response.data;
        }).
        error(function(response) {
        });

    //所在区域
    $scope.schoolChanged = function() {
        console.log($scope.formdata.SchoolID)
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_area",
                    ParentID:$scope.formdata.SchoolID
                }
            }
        }).
        success(function(response) {
            $scope.area=response.data;
        }).
        error(function(response) {
        });

    }

    //所在楼栋
    $scope.areaChanged = function() {
        console.log($scope.formdata.SchoolID)
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_dorm",
                    ParentID:$scope.formdata.AreaID
                }
            }
        }).
        success(function(response) {
            $scope.building=response.data;
        }).
        error(function(response) {
        });

    }


           

})