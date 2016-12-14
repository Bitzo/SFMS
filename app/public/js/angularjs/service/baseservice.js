/**
 * Created by Administrator on 2016/12/14.
 */
myApp.service('baseService',function($http,$q){

    this.InitMenu=function(){
       return  $http({
            method: 'get',
            url: "/backmenu?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        })
    }
});