  myApp.controller('appcontroller', ['$scope',function ($scope) {
     
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
        }
    ]
    $scope.head = []
    var i = 0;
     for (var name in  $scope.records[0]){
         $scope.head[i++] = name;
     }
     console.log($scope.head);
    
}]);
