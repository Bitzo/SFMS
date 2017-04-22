/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('jitgoodsAddController', ['$scope', '$http', function($scope, $http,$q,baseService) {

        //库存区域
        $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_stockArea"
                }
            }
        }).
        success(function(response) {
            $scope.StockArea=response.data;
        }).
        error(function(response) {
        });

        $http({
            method:'get',
            url: '/jinkeBro/staff' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    StaffType:3,
                    IsActive : 1
                }
            }
        }).
        success(function(response) {
            $scope.CreateUsers=response.data;
        }).
        error(function(response) {
        });

        $http({
            method:'get',
            url: '/jinkeBro/staff' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    StaffType:1,
                    IsActive : 1
                }
            }
        }).
        success(function(response) {
            $scope.Suppliers=response.data;
        }).
        error(function(response) {
        });

        $("#input-44").fileinput({
            uploadUrl: '/jinkeBro/product/imgupload'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            allowedFileExtensions: ['jpg', 'png'],
            showUploadedThumbs:false,
            maxFileCount: 5,
            language : 'zh',
            maxFilePreviewSize: 10240,
            uploadExtraData: function (previewId, index) {
                var SKU = {
                    SKU: [$scope.SKU,$scope.ProductID]
                };
                return SKU;
            }
        }).on('fileuploaded', function(event, data, previewId, index) {
            // initPicture();
            console.log("触发上传图片的事件!");
        });
}]);