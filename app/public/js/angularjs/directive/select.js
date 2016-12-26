jasonapp.service('jasonService', function ($http, $q) {
    this.IintSelect = function (url,params) {
        return $http({
            method: 'get',
            url: url + accesstokenstring,
            params:params
        })
    }
});
angular.module('jason.pagination').directive('jasonSelect',function($http,jasonService){
    return {
        restrict: 'EA',
        template:
        '<select>'+
        '<option value="">全部显示</option>'+
        '<option ng-repeat="item in options" value={{item.value}}>{{item.text}}</option>'+
        '</select>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs){
            var url= attrs.source+"?access_token=";
            var params={pageindex:1, pagesize:10,
                    f:JSON.parse(attrs.selectparams)
            }
            jasonService.IintSelect(url,params).then(function(reponse){
                scope.options=reponse.data.data;
                scope.options.forEach(
                    function(o){
                        Object.assign(o,{text: o[attrs.stext],value:o[attrs.svalue]});
                    }
                );
            });
        }
    };
});