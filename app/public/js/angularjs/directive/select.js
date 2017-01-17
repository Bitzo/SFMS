jasonapp.service('jasonService', function ($http, $q) {
    this.IintSelect = function (url,params) {
        if(params){
            return $http({
            method: 'get',
            url: url + accesstokenstring,
            params:params
        })
      }else{
          return $http({
            method: 'get',
            url: url + accesstokenstring,
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{}
            }
        })
      }
        
    }
});
angular.module('jason.pagination').directive('jasonSelect',function($http,jasonService){
    return {
        restrict: 'EA',
        template:
        '<select id ="selectChange" ng-click="getNew()">'+
        '<option value="">全部显示</option>'+
        '<option ng-repeat="item in options" value={{item.value}}>{{item.text}}</option>'+
        '</select>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs){
           

            if(attrs.selectparams){
                var url= attrs.source+"?access_token=";
                    var params={pageindex:1, pagesize:10,
                            f:JSON.parse(attrs.selectparams)
                    }                
            }else{
                 var url= attrs.source+"?access_token=";              
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