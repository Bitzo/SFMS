/**
 * @Author: bitzo
 * @Date: 2017/4/2 14:18
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/4/2 14:18
 * @Function:
 */
myApp.controller('kpiAddController', function($scope, $http,$q,baseService) {

    $("#input-44").fileinput({
        uploadUrl: '/sfms/api/kpi/file'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        allowedFileExtensions: ['jpg', 'png'],
        showUploadedThumbs:false,
        maxFileCount: 5,
        language : 'zh',
        maxFilePreviewSize: 10240,
        uploadExtraData: function (previewId, index) {
            var ID = {
                ID:$scope.kpiMaterialID
            };
            return ID;
        }
    }).on('fileuploaded', function(event, data, previewId, index) {
        // initPicture();
    });

    // function initPicture() {
    //     $http({
    //         method: 'get',
    //         url: '/sfms/api/kpi/file' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
    //         params: {
    //             ID: $scope.kpiMaterialID
    //         }
    //     }).success(function (response) {
    //         console.log(response);
    //         $scope.files = [];
    //         if(response.isSuccess) {
    //             for( var i in response.data)
    //             {
    //                 $scope.files.push( {
    //                     'url': response.data[i].fileUrl,
    //                     'fileName': response.data[i].fileName,
    //                     'size': bytesToSize(response.data[i].size)
    //                 })
    //             }
    //         }
    //     }).error(function (response) {
    //         $scope.files = [];
    //     });
    // }


});