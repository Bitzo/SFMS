/**
 * Created by Administrator on 2017/1/4.
 */
myApp.controller('functionController', function($scope, $http,$q,baseService) {
    $scope.tree_data = [];
    $http.get("/func?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
        .success(function (response) {
            $scope.tree_data = response.data;
        });
    $scope.expanding_property = {
        field: "FunctionName",
        displayName: "功能名字",
        sortable: true,
        filterable: true,
        cellTemplate: "<input type='checkbox'><i>{{row.branch[expandingProperty.field]}}</i>"
    };
    $scope.col_defs = [
        {
            field: "ApplicationID",
            sortable: true,
            sortingType: "number",
            filterable: true
        },
        {
            field: "FunctionID",
            sortable: true,
            sortingType: "number"
        },
        {
            field: "ParentID"
        }
    ];
    $scope.clickHander = function(e){
        e.ApplicationID= e.ApplicationID+'';
        $scope.currentData=e;
        // $scope.currentData=Object.assign({},e);
        //for(key in $scope.currentData){
      //      $scope.currentData[key]=$scope.currentData[key]+'';
       // }
    }
    $scope.clickHanderAdd = function(e){
        e.ApplicationID= e.ApplicationID+'';
        $scope.currentData=e;
        // $scope.currentData=Object.assign({},e);
        //for(key in $scope.currentData){
        //      $scope.currentData[key]=$scope.currentData[key]+'';
        // }
    }
    $scope.disable=true;
    $scope.edit=function(){
        $scope.disable=false;
    }

})