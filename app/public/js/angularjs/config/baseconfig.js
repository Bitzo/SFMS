/**
 * Created by Administrator on 2016/11/21.
 */
var accesstokenstring = localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key');
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']);

myApp.config(function($routeProvider) {
    $routeProvider.
    when('/backend/index', {
        templateUrl: '/index?access_token='+accesstokenstring,
            // controller: 'HomeController'
    }).
    when('/backend/user', {
        templateUrl: '/user?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/userinfo', {
        templateUrl: '/userinfo?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/useredit', {
        templateUrl: '/useredit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/role', {
        templateUrl: '/role?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/roleAdd', {
        templateUrl: '/roleAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
     when('/backend/roleEdit', {
        templateUrl: '/roleEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
     when('/backend/function', {
        templateUrl: '/function'+"?access_token=" +accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/functionAdd', {
        templateUrl: '/functionAdd'+"?access_token=" +accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/functionEdit', {
        templateUrl: '/functionEdit'+"?access_token=" +accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/application', {
        templateUrl: '/application?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/applicationinfo', {
        templateUrl: '/applicationinfo?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/applicationedit', {
        templateUrl: '/applicationedit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/menu', {
        templateUrl: '/menu?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/menuinfo', {
        templateUrl: '/menuinfo?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/backend/menuedit', {
        templateUrl: '/menuedit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectLead', {
        templateUrl: '/sfms/projectLead?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectManage', {
        templateUrl: '/sfms/projectManage?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectAdd', {
        templateUrl: '/sfms/projectAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/projectEdit', {
        templateUrl: '/sfms/projectEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
     when('/sfms/kpi', {
        templateUrl: '/sfms/kpi?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiManage', {
        templateUrl: '/sfms/kpiManage?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiAdd', {
        templateUrl: '/sfms/kpiAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/kpiEdit', {
        templateUrl: '/sfms/kpiEdit?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
     when('/sfms/finance', {
        templateUrl: '/sfms/finance?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/financeAdd', {
        templateUrl: '/sfms/financeAdd?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
    when('/sfms/financeCheck', {
        templateUrl: '/sfms/financeCheck?access_token='+accesstokenstring,
        //controller: 'HomeController'
    }).
     when('/sfms/sign', {
        templateUrl: '/sfms/sign?access_token='+accesstokenstring,
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
    //显示左侧菜单栏
   $scope.menus = [];
    function getList() {        
        $http({
            method: 'get',
            url: "/backmenu?access_token="+accesstokenstring,
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
//    getList();
//     $scope.paginationConf = {
//         currentPage: 1,
//         itemsPerPage: 15,
//         action: "1111"
//     }
    

//     //应用角色菜单用户首页数据显示
//     $scope.f={};
//     function getInit(){
        
//         $http({
//             method:'get',
//             url:$scope.paginationConf.action+"?access_token="+accesstokenstring,
//             params:{
//                 pageindex:$scope.paginationConf.currentPage,
//                 pagesize:$scope.paginationConf.itemsPerPage,
//                 f:$scope.f
//             }
//         }).
//         success(function(response) {
//             $scope.datas=response.data;
//              console.log('hhh'+$scope.datas);
//             $scope.paginationConf.totalItems= response.dataNum;
           
//             console.log($scope.f);
//             console.log(response);

//         }).
//         error(function(response) {
//             console.log($scope.f);
//         });
//     }
//     $scope.paginationConf = {
//         currentPage: 1,
//         itemsPerPage: 15
//     }
//     $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
//     $scope.$watch( 'paginationConf.action',getInit);

//     //查询
//     $scope.search=function(){
//         getInit();
        
//     }


//     //新增
//      $scope.formdata={};
//      $scope.addnew = function(formdata,action) {
//          console.log(formdata);
//          console.log(action);
//          $http({
//             method:'post',
//             url:action+"?access_token="+accesstokenstring,
//             data:{
//                 formdata:$scope.formdata
//             }
//         }).
//         success(function(response) {
//            console.log($scope.formdata);
//            console.log($scope.datas);
//            if(response.isSuccess){
//               alert(response.msg);
//               $scope.datas.push($scope.formdata);
//            }else{
//               alert(response.msg);
//            }

//         }).
//         error(function(response) {
//            alert(response.msg);
//            console.log(response);
//            console.log('no');
//         });
//     };


//  //获取编辑信息
//     $scope.show=function(index,action){
//             getInitmenu(index,action);
//         };
//     function getInitmenu(index,action){   
//             console.log(index);   
//             console.log(action);                  
//         $http({url:action+"?access_token="+accesstokenstring,
//             method:'put',
//             params:{
//                 f:{
//                      MenuID:index,
//                      RoleID:index,
//                      ID:index,
//                      AccountID:index
//                   }
//             }
//         }).
//         success(function(response) {
//             $scope.formdata=response.data[0];
//             console.log($scope.formdata.ApplicationID);            
//             console.log('修改成功');
//             console.log(response);
//         }).
//         error(function(response) {
//             console.log('修改失败');                        
//             console.log(response);
//         });
//     }
     
//      //编辑完成提交信息
//      $scope.formdata={};
//      $scope.newedit = function(formdata,action) {
//          console.log(formdata);
//          console.log(action);
//          $http({
//             method:'put',
//             url:action+"?access_token="+accesstokenstring,
//             data:{
//                 formdata:$scope.formdata
//             }
//         }).
//         success(function(response) {
//             console.log($http.url)
//            console.log($scope.formdata);
//            console.log(response);
//            if(response.isSuccess){
//                console.log('提交成功'); 
//               alert(response.msg);
//            }else{
//               alert(response.msg);
//            }

//         }).
//         error(function(response) {
//             console.log('提交失败'); 
//             console.log(formdata);
//             alert(response.msg);
//            console.log(response);
//            console.log('no');
//         });
//     };
   

//     //删除
//      $scope.d={};
//      $scope.remove = function(index,action){
//          console.log('delete');
//          console.log(index);   
//          console.log(action);                        
//          $scope.d={
//              "AccountID":$scope.datas[index].AccountID,
//              "MenuID":$scope.datas[index].MenuID,
//              "ID":$scope.datas[index].ID,   
//              "RoleID" : $scope.datas[index].RoleID   
//          };
//          $http({
//             method:'delete',
//             url:action+"?access_token="+accesstokenstring,
//             params:{
//                 d:$scope.d 
//             }
//         }).
//         success(function(response) {
//             console.log($scope.d);            
//             alert.log('删除成功');            
//             console.log(response.msg);
//         }).
//         error(function(response) {
//             console.log($scope.d);
//             alert.log('删除失败');                        
//             console.log(response.msg);
//         });
//         $scope.datas.splice(index,1);
//         console.log($scope.d);
//       }


//       //显示用户模态框数据
//      $scope.moreuser = function(index,action){
//          console.log('more');
//          $scope.f={
//              "userID":$scope.datas[index].AccountID,
//          };
//          $http({
//             method:'get',
//             url:action+$scope.f.userID+"?access_token="+accesstokenstring,
//         }).
//         success(function(response) {
//             console.log(response);
//             $scope.data = response.data.Role;
//             console.log($scope.menus);

//         }).
//         error(function(response) {
//             console.log(response);
//         });
//       }


//        //显示角色模态框
//         $scope.morerole = function(index,action){
//                  console.log(action)
//                 console.log('more');
//                 $scope.f={
//                     "RoleID":$scope.datas[index].RoleID,
//                 };
//                 $http({
//                     method:'get',
//                     url:action+$scope.f.RoleID+"?access_token="+accesstokenstring,
//                 }).
//                 success(function(response) {
//                     console.log(response);
//                     $scope.data = response.data;
//                     console.log($scope.menus);

//                 }).
//                 error(function(response) {
//                     console.log(response);
//                 });
//             }
  

//        //显示角色新增页面
//       $scope.addrole=function(action){
//             getInitrole(action);
//         };
//     function getInitrole(action){   
//             console.log(action);                  
//         $http({
//             method:'get',
//             url:action+"?access_token="+accesstokenstring,
//             params:{
//                 f:{
//                      MenuID:index,
//                      RoleID:index,
//                      ID:index,
//                      AccountID:index,
//                   }
//             }
//         }).
//         success(function(response) {
//             $scope.formdata=response.data[0];
//             console.log($scope.formdata.ApplicationID);            
//             console.log('修改成功');            
//             console.log(response);
//         }).
//         error(function(response) {
//             console.log('修改失败');                        
//             console.log(response);
//         });
//     }


//     //显示项目模态框
//         $scope.moreproject = function(index,action){
//                 console.log('more');
//                 $scope.f={
//                     "projectID":$scope.datas[index].ID,
//                 };
//                 $http({
//                     method:'get',
//                     url:action+"?access_token="+accesstokenstring,
//                 }).
//                 success(function(response) {
//                     console.log(response);
//                     $scope.data = response.data;
//                     console.log($scope.menus);

//                 }).
//                 error(function(response) {
//                     console.log(response);
//                 });
//             }




//显示功能点页面 
 /*$scope.functions = [];
    function getFunction() {
        $http({
            method: 'get',
            url: "/func?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),

        }).
        success(function(response) {

            $scope.functions = response.data;
            console.log($scope.functions);
        }).
        error(function(response) {
            console.log(response);
        });
    }
    getFunction();*/

        
})
