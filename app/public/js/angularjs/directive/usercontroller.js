  myApp.controller('usercontroller', ['$scope','$http',function ($scope,$http) {
    $http({
    method:'get',
    url:"/user" , 
    }).
    success(function(response) {
        $scope.info = response.data;
    }).
    error(function(response) {
        console.log(response);     
  });
 
  

    
}]);
