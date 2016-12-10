/**
 * Created by Administrator on 2016/12/6.
 */
angular.module('jason.form').directive('jasonForm',[function(){
    return {
        restrict: 'EA',
        template:"<div class='form-horizontal' role='form'><div ng-transclude=''></div></div>",
        scope: {
            conf: '='
        },
        replace:true,
        transclude:true,
        link: function (scope, element, attrs) {
            scope.conf.formactionsubmit = attrs.action;
        }
    }
}]);