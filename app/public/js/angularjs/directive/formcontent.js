/**
 * Created by Administrator on 2016/12/6.
 */
angular.module('jason.form',[]).directive('jasonFormcontent',[function(){
    return {
        restrict: 'EA',
        template:"<div><div ng-transclude=''></div></div>",
        scope: {
            conf: '='
        },
        replace:true,
        transclude:true,
        link: function (scope, element, attrs) {
            scope.conf.action = attrs.action;
            scope.conf.actiontype = attrs.type;
        }
    }
}]);