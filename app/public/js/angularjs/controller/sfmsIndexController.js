/**
 * Created by Administrator on 2016/11/22.
 */
myApp.controller('sfmsIndexController',function($scope,$http){
    $scope.f={};
    function getList(){
        $http({
            method:'post',
            url:"/sfms/getmenu?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{pageindex:$scope.paginationConf.currentPage,pagesize:$scope.paginationConf.itemsPerPage,f:$scope.f}
        }).
        success(function(response) {
            var  data=response.datas;
            $scope.datas=JSON.parse(data);
            $scope.paginationConf.totalItems=  response.dataNum;

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

})