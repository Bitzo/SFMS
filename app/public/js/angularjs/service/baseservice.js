/**
 * Created by Administrator on 2016/12/14.
 */
myApp.service('baseService', function($http, $q) {
    var me = this;
    
    this.InitMenu = function() {
        return $http({
            method: 'get',
            url: '/backmenu?' + me.getPassToken()
        })
    }

    this.getPassToken = function() {
        return "access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key');
    }
});