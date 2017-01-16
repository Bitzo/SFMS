/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('sfmsProjectController', function($scope, $http,$q,baseService) {    
        //项目成员新增ID
        $scope.userChanged = function() {
            var index =  $scope.user.userIndex;
            $http({
            method:'get',
            url: '/backuser' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{}
            }
        }).
        success(function(response) {
            $scope.user.userID=response.data[index].AccountID;
            $scope.user.userName=response.data[index].UserName; 
        }).
        error(function(response) {

        }); 
        }
        //项目成员新增姓名
        $http({
            method:'get',
            url: '/backuser' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:1,
                pagesize:10,
                f:{}
            }
        }).
        success(function(response) {
            $scope.UserNames=response.data;
        }).
        error(function(response) {
     });

         //实验室管理系统-项目管理-新建页面-项目成员新增  新增
        $scope.formdata.data=[];
        $scope.addUser = function(item){ 
            if(item.duty) {
            $scope.formdata.data.push($scope.user);
            $scope.user={};
            }else{
                alert('请填写相关信息')
            }
            
        }
       //实验室管理系统-项目管理-新建页面-项目成员新增  重置
        $scope.resetUser = function(item){
            var mymessage=confirm("是否确认删除此项");  
            console.log(mymessage);
            if(mymessage){
                    $scope.formdata.data.splice(item.$index,1);
            }            
        }

       //实验室管理系统-项目管理-编辑页面-项目成员信息显示  删除
        $scope.d={};
        $scope.removeUser = function(index,action){
            var mymessage=confirm("是否确认删除此项");  
            if(mymessage==true){
            $scope.d={
                "ID":$scope.paginationConf.formdata.userdata[index].ID,
            };
            $http({
                method:'delete',
                url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                params:{
                    d:$scope.d
                }
            }).
            success(function(response) {
            }).
            error(function(response) {
            });
            $scope.paginationConf.formdata.userdata.splice(index,1);
            }else{

            }
        }
        //实验室管理系统-项目管理-编辑页面-项目成员新增  新增
        $scope.paginationConf.formdata.data=[];
        $scope.addEditUser = function(item){
            if(item.duty) {
            $scope.formdata.data.push($scope.user);
            $scope.paginationConf.formdata.data = $scope.formdata.data;
            $scope.user={};
            }else{
                alert('请填写相关信息')
            }
            
        }
        //实验室管理系统-项目管理-编辑页面-项目成员新增  重置
        $scope.resetEditUser = function(item){
            var mymessage=confirm("是否确认删除此项"); 
            if(mymessage){
                 $scope.formdata.data.splice(item.$index,1);
            }   
            
        }

})