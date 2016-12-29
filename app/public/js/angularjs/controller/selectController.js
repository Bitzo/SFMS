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
            $scope.applicationNames=response.data;
        }).
        error(function(response) {
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
            $scope.roleNames=response.data;
        }).
        error(function(response) {
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
            $scope.cls=response.data;
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
                console.log(response)
                $scope.UserNames=response.data;
                console.log($scope.UserNames)
            }).
            error(function(response) {
                console.log(response)
        });
         

            //项目成员新增ID
            $scope.userChanged = function() {
                console.log($scope.user) 
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
                console.log(response)   
                $scope.user.userID=response.data[index].AccountID;
                $scope.user.userName=response.data[index].UserName; 
            }).
            error(function(response) {
                console.log(response)
            }); 
            }
     

              //新增项目管理中的用户列表
                $scope.formdata.data=[];
                $scope.addUser = function(item){
                    console.log('addUser');
                    console.log(item);
                    console.log($scope.user)  
                    if(item.duty) {
                    $scope.formdata.data.push($scope.user);
                    $scope.user={};
                    }else{
                        alert('请填写相关信息')
                    }
                    
                }
                //重置项目管理中的用户列表
                $scope.resetUser = function(item){
                    console.log(item.$index);
                    $scope.formdata.data.splice(item.$index,1);
                }

                

        
      
      

})