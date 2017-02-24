jasonapp.service('jasonService', function ($http, $q) {
    this.IintSelect = function (url,params,isActive) {
        if(params){
            return $http({
            method: 'get',
            url: url + accesstokenstring,
            params:params
        })
      }else{
          if(isActive){
              return $http({
                method: 'get',
                url: url + accesstokenstring,
                params:{
                    isPaging:1,
                    pageindex:1,
                    pagesize:10,
                    f:{
                        StaffType: 1,
                        isActive : 1
                    }
                }
            })
          }else{
              return $http({
                method: 'get',
                url: url + accesstokenstring,
                params:{
                    isPaging:1,
                    pageindex:1,
                    pagesize:10,
                    f:{
                        StaffType: 1
                    }
                }
            })
          }
          
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

           
            if (attrs.selectparams) {
                var url = attrs.source + "?access_token=";
                var params = {
                    pageindex: 1,
                    pagesize: 10,
                    isPaging : 1,
                    f: JSON.parse(attrs.selectparams)
                }
            } else {
                var url = attrs.source + "?access_token=";
            }

            if (attrs.sactive){
                var isActive = 1;
            }else{
                var isActive = 0;
            }


            jasonService.IintSelect(url,params,isActive).then(function(reponse){
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