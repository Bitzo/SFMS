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
    // $("#file").fileinput({
    //     uploadUrl: '#', // you must set a valid URL here else you will get an error
    //     allowedFileExtensions : ['jpg', 'png','gif'],
    //     overwriteInitial: false,
    //     maxFileSize: 1000,
    //     maxFilesNum: 10,
    //     //allowedFileTypes: ['image', 'video', 'flash'],
    //     slugCallback: function(filename) {
    //         return filename.replace('(', '_').replace(']', '_');
    //     }
    // });

    $scope.removeFile = function (item) {
        var mymessage=confirm("是否确认删除此项");
        if(mymessage){
            $scope.files.splice(item.$index,1);
        }
    };

    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        }
        return url ;
    }

    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1000, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    $scope.files = [];
    var file = '';
    var tempFile = '';
    var files = [];
    $("#file").change(function(){
        tempFile = this.files[0];
        console.log(tempFile)
        var objUrl = getObjectURL(this.files[0]);
        var name = tempFile.name;
        if (tempFile.name.length > 20) {
            name = tempFile.name.substring(0, 6) + '......' + tempFile.name.substring(tempFile.name.length-8);
        }
        file = {
            'url': objUrl,
            'fileName': name,
            'size': bytesToSize(tempFile.size)
        }
    });

    $scope.addFile = function () {
        if(file === '') {
            alert('请选择文件！');
            return;
        }
        $scope.files.push(file);
        files.push(tempFile);
        file = '';
        tempFile = '';
    };

    $scope.submit = function () {
        console.log(files);

        if(files.length == 0){
            alert('请选择文件');
            return;
        }else{

            $http({
                method:'post',
                headers: {
                    'Content-Type': undefined
                },
                url:"sfms/api/kpi?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),

                data:{
                    file: files
                }
            }).
            success(function(response) {
                alert(response.msg);
            }).
            error(function(response) {
                alert(response.msg);
            });

            alert('OK');
        }
    }

});