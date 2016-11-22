  myApp.controller('appcontroller', ['$scope',function ($scope) {
    $scope.roles = ["管理员", "项目负责人", "普通成员"];
    $scope.apps = ["sfms", "Jinkebro"];   
    $scope.records = [
         {
            "ID" : "1",  
            "Account" : "001",
            "Username" : "Lee",
            "IsActive" : "1",  
        },{
            "ID" : "2",  
            "Account" : "002",
            "Username" : "Shi",
            "IsActive" : "1"
        },{
            "ID" : "3",  
            "Account" : "003",
            "Username" : "Zhu",
            "IsActive" : "1"
        },{
            "ID" : "4",  
            "Account" : "004",
            "Username" : "Huang",
            "IsActive" : "0"
        },{
            "ID" : "1",  
            "Account" : "001",
            "Username" : "Lee",
            "IsActive" : "1",  
        },{
            "ID" : "2",  
            "Account" : "002",
            "Username" : "Shi",
            "IsActive" : "1"
        },{
            "ID" : "3",  
            "Account" : "003",
            "Username" : "Zhu",
            "IsActive" : "1"
        },{
            "ID" : "4",  
            "Account" : "004",
            "Username" : "Huang",
            "IsActive" : "0"
        },
    ]
    $scope.head = []
    var i = 0;
     for (var name in  $scope.records[0]){
         $scope.head[i++] = name;
     }
     console.log($scope.head);
    
}]);
