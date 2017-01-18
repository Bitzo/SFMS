/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('userMenuController', function($scope, $http,$q,baseService) {
       $scope.tree_data = [];
       $http.get("/userrole/userID/1?access_token=" + accesstokenstring)
        .success(function (response) {
            $scope.tree_data = response.data.Menu;
            console.log($scope.tree_data);
        });

       
})