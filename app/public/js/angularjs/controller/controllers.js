// Declare angular JS level module wich depends on filters, and services
myApp.controller('formController', ['$scope','$http',  function ($scope,$http) {
    $scope.tips = '用户登录';
    $scope.changeCode = function() {
        console.log($scope.codeSrc);
        $scope.codeSrc = '/generatecode?date=' + new Date();
        console.log($scope.codeSrc);
    };
    $scope.submit = function(userdata) {
        $http({
            method: 'POST',
            url: "/login",
            data: {
                'username': userdata.username,
                'password': userdata.password,
                'code': userdata.code
            }
        }).
        success(function(response) {
            if (response !== undefined && response.data !== undefined && response.data.isSuccess) {
                location.href = './index';
            } else {
                alert(response.msg);
                location.reload();
            }
        }).
        error(function(response) {
            console.log('登录失败');
            alert(response.msg);
            location.reload();
        });
    };
}]);
//菜单显示
myApp.controller('menucontroller', ['$scope','$http',function ($scope,$http) {
    $scope.li = 'huhuhu';
    $http({
    method:'get',
    url:"/querymenus?userID=" + 1,  
    }).
    success(function(response) {
        $scope.menu = response.data.Menu;

    }).
    error(function(response) {
        console.log(response);
        
  });
 
}]);
//所有用户信息显示
myApp.controller('usercontroller', ['$scope','$http',function ($scope,$http) {
    $scope.AccountID = 'hhh';
    $http({
    method:'get',
    url:"/backuser" , 
    }).
    success(function(response) {
        console.log(response.data);
        $scope.info = response.data;
        
    }).
    error(function(response) {
        console.log(response);     
  });
}]);



//查询用户信息
myApp.controller('searchcontroller', ['$scope','$http',function ($scope,$http) {
    $scope.aaa = '查询';
    $http({
    method:'get',
    url:"/backuser?userID=" + 1,
    }).
    success(function(response) {
       
    }).
    error(function(response) {
         
  });
}]);



//新增编辑用户信息
myApp.controller('addusercontroller', ['$scope','$http',function ($scope,$http) {
    $scope.aaa = '新增编辑';
    $http({
    method:'get',
    url:"/backuser?userID=" + 1,
    }).
    success(function(response) {
       
    }).
    error(function(response) {
         
  });
}]);



//所有应用信息显示
myApp.controller('applicationcontroller', ['$scope','$http',function ($scope,$http) {
    $scope.ID = 'hhh';
    $http({
    method:'get',
    url:"/app" , 
    }).
    success(function(response) {
        console.log(response.data);
        $scope.info = response.data;
        
    }).
    error(function(response) {
        console.log(response);     
  });
}]);



//新增编辑应用信息
myApp.controller('addapplicationcontroller', ['$scope','$http',function ($scope,$http) {
    $scope.aaa = '新增编辑';
    $http({
    method:'get',
    url:"/app?userID=" + 1,
    }).
    success(function(response) {
       
    }).
    error(function(response) {
         
  });
}]);