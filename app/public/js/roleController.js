
function roleMainController($scope,$location){
    $scope.jumpToRoleAdd=function(path){
        $location.path(path);
        var curUrl = $location.absUrl(); 
    }
}