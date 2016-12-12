/**
 * Created by Administrator on 2016/11/21.
 */
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']).config(function($routeProvider) {
    $routeProvider.
    when('/backend/index', {
        templateUrl: '/index'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            // controller: 'HomeController'
    }).
    when('/backend/user', {
        templateUrl: '/user'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/userinfo', {
        templateUrl: '/userinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/useredit', {
        templateUrl: '/useredit'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/role', {
        templateUrl: '/role'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/roleAdd', {
        templateUrl: '/roleAdd'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
     when('/backend/roleEdit', {
        templateUrl: '/roleEdit'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/application', {
        templateUrl: '/application'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/applicationinfo', {
        templateUrl: '/applicationinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/applicationedit', {
        templateUrl: '/applicationedit'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/menu', {
        templateUrl: '/menu'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/menuinfo', {
        templateUrl: '/menuinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/backend/menuedit', {
        templateUrl: '/menuedit'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    otherwise({
        redirectTo: '/'
    });


//     when('/sfms/menuinfo', {
//         templateUrl: '/sfms/menuinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
//         //controller: 'HomeController'
//     }).



}).run(['$rootScope', '$window', '$location', '$log', function($rootScope, $window, $location, $log) {
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
    var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

    function locationChangeStart(event) {
        if ($location.$$path == "") {
            event.preventDefault();
        }
    }

    function locationChangeSuccess(event) {
        $log.log('locationChangeSuccess');    
        $log.log(arguments);
        console.log($location.path());
    }

    function routeChangeStart(event) {
        $log.log('routeChangeStart');
        $log.log($location);
    }

    function routeChangeSuccess(event) {
        $log.log('routeChangeSuccess');
        $log.log(arguments);
    }
}]).controller('baseController', function($scope, $http) {

    //显示左侧菜单栏
   $scope.menus = [];
    function getList() {
        $http({
            method: 'get',
            url: "/backmenu?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),

        }).
        success(function(response) {

            $scope.menus = response.data.Menu;
            console.log($scope.menus);
        }).
        error(function(response) {
            console.log(response);
        });
    }


    //分页初始化数据
   getList();
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        action: "1111"
    }
    

    //应用角色菜单用户首页数据显示
    $scope.f={};
    function getInit(){
        $http({
            method:'get',
            url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:$scope.paginationConf.currentPage,
                pagesize:$scope.paginationConf.itemsPerPage,
                f:$scope.f
            }
        }).
        success(function(response) {
            $scope.datas=response.data;
            $scope.paginationConf.totalItems= response.dataNum;
            console.log($scope.f);
            console.log(response);

        }).
        error(function(response) {
            console.log($scope.f);
        });
    }
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15
    }
    $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
    $scope.$watch( 'paginationConf.action',getInit);
    $scope.search=function(){
        getInit();
    }

    
//添加角色
    $scope.roleSubmit=function(role){
         $http({
            method: 'POST',
            url: "/role",
            data: {
                'ApplicationID':role.applicationID,
                'RoleName':role.roleName,
                'RoleCode':role.roleCode,
                'IsActive':role.isActive,
                'roleFunck':role.Funck,
                'access_token':localStorage.getItem('jit_token'),
                'jitkey':localStorage.getItem('jit_key')
            }
            
        }).
        success(function(response) {
        
        }).
        error(function(response) {
            if (response && response.data && !response.isSuccess) {
                alert(response.data.msg);
            } else {
                alert('提交失败!');
            }
        });
    }

    //删除角色
    $scope.del=function(RoleID){
        var index=-1;
        for(var i=0;i<$scope.datas.length;i++){
            if($scope.datas[i]['RoleID']=RoleID){
                index=i;
                break;
            };
        }
        $scope.datas.splice(index,1);
    }
    //编辑角色
    $scope.update=function(RoleID){

    }


    //新增
     $scope.formdata={};
     $scope.addnew = function(formdata,action) {
         console.log(formdata);
         console.log(action);
         $http({
            method:'post',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.formdata
            }
        }).
        success(function(response) {
            console.log($http.url)
           console.log($scope.formdata);
           console.log(response);
           if(response.isSuccess){
              alert(response.msg);
           }else{
              alert(response.msg);
           }

        }).
        error(function(response) {
           console.log(response);
           alert(response.msg);
           console.log('no');
        });
    };


 //修改
    $scope.show=function(index,action){
            getInitmenu(index,action);
        };
    function getInitmenu(index,action){   
            console.log(index);   
            console.log(action);                  
        $http({
            method:'get',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{
                     MenuID:index,
                     RoleID:index,
                     ID:index,
                     AccountID:index
                  }
            }
        }).
        success(function(response) {
            $scope.formdata=response.data[0];
            console.log($scope.formdata.ApplicationID);            
            console.log('修改成功');
            console.log(response);
        }).
        error(function(response) {
            console.log('修改失败');                        
            console.log(response);
        });
    }
     
     //提交修改
     $scope.formdata={};
     $scope.newedit = function(formdata,action) {
         console.log(formdata);
         console.log(action);
         $http({
            method:'put',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.formdata
            }
        }).
        success(function(response) {
            console.log($http.url)
           console.log($scope.formdata);
           console.log(response);
           if(response.isSuccess){
               console.log('提交成功'); 
              alert(response.msg);
           }else{
              alert(response.msg);
           }

        }).
        error(function(response) {
            console.log('提交失败'); 
            console.log(formdata);
           console.log(response);
           console.log('no');
        });
    };
   

    //删除
     $scope.d={};
     $scope.remove = function(index,action){
         console.log('delete');
         console.log(index);   
         console.log(action);                        
         $scope.d={
             "AccountID":$scope.datas[index].AccountID,
             "MenuID":$scope.datas[index].MenuID,
             "ID":$scope.datas[index].ID,   
             "RoleID" : $scope.datas[index].RoleID    
         };
         $http({
            method:'delete',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                d:$scope.d 
            }
        }).
        success(function(response) {
            console.log($scope.d);            
            console.log('删除成功');            
            console.log(response.msg);
        }).
        error(function(response) {
            console.log($scope.d);
            console.log('删除失败');                        
            console.log(response.msg);
        });
        $scope.datas.splice(index,1);
        console.log($scope.d);
      }


      //显示用户模态框数据
     $scope.moreuser = function(index,action){
         console.log('more');
         $scope.f={
             "userID":$scope.datas[index].AccountID,
         };
         $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            console.log(response);
            $scope.data = response.data.Role;
            console.log($scope.menus);

        }).
        error(function(response) {
            console.log(response);
        });
      }


       //显示角色模态框
        $scope.morerole = function(index,action){
                console.log('more');
                $scope.f={
                    "RoleID":$scope.datas[index].RoleID,
                };
                $http({
                    method:'get',
                    url:action+$scope.f.RoleID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                }).
                success(function(response) {
                    console.log(response);
                    $scope.data = response.data;
                    console.log($scope.menus);

                }).
                error(function(response) {
                    console.log(response);
                });
            }
  

       //显示角色新增页面
        $scope.addrole=function(iaction){
            getInitrole(action);
        };


    function getInitrole(action){   
            console.log(action);                  
        $http({
            method:'get',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{
                     MenuID:index,
                     RoleID:index,
                     ID:index,
                     AccountID:index,
                  }
            }
        }).
        success(function(response) {
            $scope.formdata=response.data[0];
            console.log($scope.formdata.ApplicationID);            
            console.log('修改成功');            
            console.log(response);
        }).
        error(function(response) {
            console.log('修改失败');                        
            console.log(response);
        });
    }

    



    
})