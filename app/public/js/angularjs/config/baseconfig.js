/**
 * Created by Administrator on 2016/11/21.
 */
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']).config(function($routeProvider) {
    $routeProvider.
    when('/sfms/index', {
        templateUrl: '/sfms/index'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            // controller: 'HomeController'
    }).
    when('/sfms/user', {
        templateUrl: '/sfms/user'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/userinfo', {
        templateUrl: '/sfms/userinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/role', {
        templateUrl: '/sfms/role'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/roleAdd', {
        templateUrl: '/sfms/roleAdd'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
     when('/sfms/roleEdit', {
        templateUrl: '/sfms/roleEdit'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/application', {
        templateUrl: '/sfms/application'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/applicationinfo', {
        templateUrl: '/sfms/applicationinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/menu', {
        templateUrl: '/sfms/menu'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    when('/sfms/menuinfo', {
        templateUrl: '/sfms/menuinfo'+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).
    otherwise({
        redirectTo: '/'
    });


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
   $scope.menus = [];

    function getList() {
        $http({
            method: 'get',
            url: "/menu/1?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            $scope.menus = response.data.Menu;
            console.log($scope.menus);
        }).
        error(function(response) {
            console.log(response);
        });
    }
   getList();
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        action: "1111"
    }
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
   
    //删除
     $scope.remove = function(index){
         console.log('delete');
         
         
         $scope.f={
             "AccountID":$scope.datas[index].AccountID,
             "MenuID":$scope.datas[index].MenuID,
             "IsActive":0,
         };
         $http({
            method:'get',
            url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:$scope.f
            }
        });
        $scope.datas.splice(index,1);
        console.log($scope.f);
      }

      //显示模态框数据
     $scope.more = function(index){
         console.log('more');
         $scope.f={
             "userID":$scope.datas[index].AccountID,
         };
         $http({
            method:'get',
            url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        });
        console.log(response);
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


     //用户菜单应用添加
    //  $scope.added={};
    //  $scope.addnew = function(added) {
    //      console.log('hhh');
    //       console.log($scope.paginationConf.action);
    //      $http({
    //         method:'post',
    //         url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
    //         data:{
    //             added:$scope.added
    //         }
    //     }).
    //     success(function(response) {
     
    //        console.log($scope.added);
    //        console.log('yes');

    //     }).
    //     error(function(response) {
    //        console.log($scope.added);
    //        console.log('no');
    //     });
    // };





     //用户添加
     $scope.submitusera = function(user) {
         console.log('hhh');
         $http({
            method:'post',
            url:"/backuser?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                'ApplicationID':user.ApplicationID,
                'Account':user.Account,
                'UserName':user.UserName,
                'Pwd':user.Pwd,
                'CreateTime':user.CreateTime,
                'CreateUserID':user.CreateUserID,
                'IsActive':user.IsActive,
            }
        }).
        success(function(response) {
           console.log($scope.user);
           console.log(response);
           if(response.isSuccess){
              alert(response.msg);
           }else{
              alert(response.errorMsg);
           }

        }).
        error(function(response) {
           alert(response.msg);
        });
    };


     //菜单添加
     $scope.submitmenua = function(menu) {
         console.log('menu');
         $http({
            method:'post',
            url:"/menu?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                'ApplicationID':menu.ApplicationID,
                'MenuLevel':menu.MenuLevel,
                'ParentID':menu.ParentID,
                'SortIndex':menu.SortIndex,
                'MenuName':menu.MenuName,
                'IconPath':menu.IconPath,
                'Url':menu.Url,
                'Memo':menu.Memo,                
                'IsActive':menu.IsActive,
            }
        }).
        success(function(response) {
           if(response.isSuccess){
              alert(response.msg);
           }else{
              alert(response.errorMsg);
           }
        }).
        error(function(response) {
            alert(response.msg);
        });
    };

       //应用添加
     $scope.submitappa = function(app) {
         console.log('app');
         $http({
            method:'post',
            url:"/app?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                'ID':app.ID,
                'ApplicationCode':app.ApplicationCode,
                'ApplicationName':app.ApplicationName,
                'Memo':app.Memo,               
                'IsActive':app.IsActive,
            }
        }).
        success(function(response) {
           console.log($scope.app);
           console.log(response);
           if(response.isSuccess){
              alert(response.msg);
           }else{
              alert(response.errorMsg);
           }

        }).
        error(function(response) {
           alert(response.msg);
        });
    };
    

    



    
})