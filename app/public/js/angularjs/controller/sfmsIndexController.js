/**
 * Created by Administrator on 2016/11/22.
 */
myApp.controller('sfmsIndexController',function($scope,$http){

    function getList(){
        $http({
            method:'POST',
            url:"/sfms/gemeun",
            data:{pageindex:$scope.paginationConf.currentPage,pagesize:$scope.paginationConf.itemsPerPage}
        }).
        success(function(response) {
            var  data=response.datas;
            $scope.datas=JSON.parse(data);
            $scope.paginationConf.totalItems=  response.total

        }).
        error(function(response) {
            getList();
        });
    }

    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15
    }
    getList();
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
})