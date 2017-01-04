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
            field: "FunctionName",
            sortable: true,
            sortingType: "string",
            displayName: "功能名字",
            cellTemplate: "{{row.branch[col.field]}}</strong>"
        },
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
})