/**
 * Created by Administrator on 2016/11/21.
 */
var myApp = angular.module('myApp', ['ngRoute', 'jason.pagination']).config(function ($routeProvider) {
    $routeProvider.when('/sfms/index', {
        templateUrl: '/sfms/index' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        // controller: 'HomeController'
    }).when('/sfms/user', {
        templateUrl: '/sfms/user' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/userinfo', {
        templateUrl: '/sfms/userinfo' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/role', {
        templateUrl: '/sfms/role' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/roleAdd', {
        templateUrl: '/sfms/roleAdd' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/roleEdit', {
        templateUrl: '/sfms/roleEdit' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/application', {
        templateUrl: '/sfms/application' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/application-info', {
        templateUrl: '/sfms/application-info' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/menu', {
        templateUrl: '/sfms/menu' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).when('/sfms/appedit/:id', {
        templateUrl: '/sfms/appedit' + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        //controller: 'HomeController'
    }).otherwise({
        redirectTo: '/'
    });


}).run(['$rootScope', '$window', '$location', '$log', function ($rootScope, $window, $location, $log) {
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
    var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

    function locationChangeStart(event) {
        if ($location.$$path == "") {
            event.preventDefault();
        }
    }

    function locationChangeSuccess(event) {
        $log.log('locationChangeSuccess');
        $log.log(arguments);
        console.log($location.path());
    }

    function routeChangeStart(event) {
        $log.log('routeChangeStart');
        $log.log($location);
    }

    function routeChangeSuccess(event) {
        $log.log('routeChangeSuccess');
        $log.log(arguments);
    }
}]).controller('baseController', function ($scope, $http,$location) {
    $scope.menus = [];

    function getList() {
        $http({
            method: 'get',
            url: "/menu?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        }).success(function (response) {
            $scope.menus = response.data.Menu;
        }).error(function (response) {
            console.log(response);
        });
    }

    getList();
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        action: "",
        actiontype: ""
    };
    $scope.f = {};
    function getInit() {
        if ($scope.paginationConf.action != "" && $scope.paginationConf.actiontype != "") {
            if ($scope.paginationConf.actiontype == "page") {
                $http({
                    method: 'get',
                    url: $scope.paginationConf.action + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
                    params: {
                        pageindex: $scope.paginationConf.currentPage,
                        pagesize: $scope.paginationConf.itemsPerPage,
                        f: $scope.f
                    }
                }).success(function (response) {
                    var data = response.data;
                    $scope.datas = response.data;
                    $scope.paginationConf.totalItems = response.dataNum;

                })
            }
        }

    }
    $scope.$watch('paginationConf.action+paginationConf.currentPage+paginationConf.itemsPerPage', getInit);
 //   $scope.$watch('paginationConf.', getInit);
    $scope.search = function () {
        getInit();
    };
    $scope.submitform=function(action)
    {
        $http({
            method: 'post',
            url:action + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            params: {
                formdata: $scope.formdata
            }
        }).success(function (response) {


        })
    }
//添加角色
    $scope.roleSubmit = function (role) {
        $http({
            method: 'POST',
            url: "/role",
            data: {
                'ApplicationID': role.applicationID,
                'RoleName': role.roleName,
                'RoleCode': role.roleCode,
                'IsActive': role.isActive,
                'roleFunck': role.Funck,
                'access_token': localStorage.getItem('jit_token'),
                'jitkey': localStorage.getItem('jit_key')
            }

        }).success(function (response) {
            alert(response.data.msg);
            alert('提交成功');
        }).error(function (response) {
            if (response && response.data && !response.isSuccess) {
                alert(response.data.msg);
            } else {
                alert('提交失败!');
            }
        });
    };


    //删除角色
    $scope.del = function (RoleID) {
        var index = -1;
        for (var i = 0; i < $scope.datas.length; i++) {
            if ($scope.datas[i]['RoleID'] = RoleID) {
                index = i;
                break;
            }
        }
        $scope.datas.splice(index, 1);
    };

    //编辑角色
    $scope.update = function (RoleID) {

    }


});