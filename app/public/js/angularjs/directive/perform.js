/**
 * Created by Administrator on 2016/12/6.
 */
jasonapp.service('jasonformService', function ($http, $q) {
    this.IintGrid = function (url,params) {
        return $http({
            method: 'get',
            url: url + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            params:params
        })
    }
});
angular.module('jason.pagination').directive('ljbForm',function($location,jasonformService){
    return {
        restrict: 'EA',
        template:"<div class='form-horizontal' role='form'><div ng-transclude=''>" +

        "</div></div>",
        scope: {
            conf: '='
        },
        replace:true,
        transclude:true,
        link: function (scope, element, attrs) {
            
            var url= attrs.source+"?access_token=";
            // var params={f:$location.search()};
            var a = localStorage.getItem('jit_key');
            var params={f:{'AccountID':a}};
            console.log(params)
            console.log($location.search())
            jasonformService.IintGrid(url,params).then(function(response){
                scope.per=response.data.data[0];
                console.log(response)
                console.log(scope.per)
                var toCharColArr= attrs.tocc==null?[]:attrs.tocc.split(',');
                toCharColArr.forEach(function(o){
                    scope.conf.formdata[o]+='';    
                });
            });
            scope.submit=function(){

            }
        }
    }
});