/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('userMenuController', function($scope, $http,$q,baseService,$location) {
       $scope.tree_data = [];

       $http.get('/backmenu?'+"access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
       .success(function (response) {
            $scope.tree_data = response.data.Menu;
            console.log($scope.tree_data);
        });
        

       
})