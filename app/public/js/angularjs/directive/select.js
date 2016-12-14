/**
 * name: jason.select
 * Version: 0.0.2
 */
jasonapp.service('jasonService', function ($http, $q) {
    this.IintGrid = function (url) {
        return $http({
            method: 'get',
            url: url + accesstokenstring,
            params:{
                pageindex:1,
                pagesize:10,
                f:{}
            }
        })
    }
});
angular.module('jason.pagination').directive('jasonSelect',function($http,jasonService){
    return {
        restrict: 'EA',
        template: '<select>'+
            '<option ng-repeat="item in options" value={{item.MenuID}}>{{item.Memo}}</option>'+
        '</select>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs){
           var url= attrs.source+"?access_token=";

            jasonService.IintGrid(url).then(function(reponse){
              scope.options=reponse.data.data;
            });
        },
        controller: function ($http) {
          var aaa;
        }
    };
});
