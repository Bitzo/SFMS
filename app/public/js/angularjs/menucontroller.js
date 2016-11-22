 myApp.controller('menucontroller', ['$scope','$http',function ($scope,$http) {
    $scope.li = 'huhuhu';
    $http({
    method:'get',
    url:"/querymenus?userID=" + 1,
    // data:{
    //      'userID': 1,
    //      }    
    }).
    success(function(response) {
        $scope.menu = response.data.Menu;
        $scope.smallmenu = response.data.Menu[0].children;
        console.log($scope.smallmenu);
        

    }).
    error(function(response) {
        console.log(response);
        
});
 

}]);