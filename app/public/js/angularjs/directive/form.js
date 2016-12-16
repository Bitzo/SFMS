/**
 * Created by Administrator on 2016/12/6.
 */
jasonapp.service('jasonformService', function ($http, $q) {
    this.IintGrid = function (url,params) {
        return $http({
            method: 'get',
            url: url + accesstokenstring,
            params:params
        })
    }
});
angular.module('jason.pagination').directive('jasonForm',function($location,jasonformService){
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
            scope.conf.formactionsubmit = attrs.action;
            var url= attrs.source+"?access_token=";
            var params={f:$location.search()};
            jasonformService.IintGrid(url,params).then(function(response){
                scope.conf.formdata=response.data.data[0];
            });
            scope.submit=function(){

            }
        }
    }
});