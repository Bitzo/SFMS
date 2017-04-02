/**
 * @Author: bitzo
 * @Date: 2017/4/2 14:18
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/4/2 14:18
 * @Function:
 */
myApp.controller('kpiAddController', function($scope, $http,$q,baseService) {

    //实验室管理系统-绩效管理-新增页面-项目名称  动态变化
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

    //实验室管理系统-绩效管理-编辑页面-项目名称  初始化
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


    //实验室管理系统-绩效管理-编辑页面-项目名称  动态变化
    $scope.userKpiEditChanged = function() {
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

    };

    //提交表单
    $scope.addnew = function(formdata,action) {
        console.log($scope.formdata);
        $http({
            method:'post',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.formdata
            }
        }).
        success(function(response) {
            alert(response.msg);
        }).
        error(function(response) {
            alert(response.msg);
        });
    };

    //bootstrap-fileinput 组件相关

    //初始化
    $("#file").fileinput({
        uploadUrl: '#', // you must set a valid URL here else you will get an error
        allowedFileExtensions : ['jpg', 'png','gif'],
        overwriteInitial: false,
        maxFileSize: 1000,
        maxFilesNum: 10,
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function(filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });
});