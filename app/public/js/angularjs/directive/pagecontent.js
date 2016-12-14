/**
 * Created by Jaosn on 2016/11/28.
 * Description :page context
 */


angular.module('jason.pagination',[]).directive('jasonPagecontent',[function(){
    return {
        restrict: 'EA',
        template:"<div class='page-content'><div ng-transclude=''></div></div>",
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