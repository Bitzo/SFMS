 myApp.controller('menucontroller', ['$scope','$http',function ($scope,$http) {
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