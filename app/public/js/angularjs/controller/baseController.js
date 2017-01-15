/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('baseController', function($scope, $http,$q,baseService) {
    //显示左侧菜单栏
    $scope.menus =baseService.InitMenu().then(function(response){
        $scope.menus = response.data.data.Menu;
    });

//------所有模块------
    //分页初始化数据
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        action: ""
    };

    //首页 数据显示
    $scope.f={};

    function getInit(){
        if($scope.paginationConf&&$scope.paginationConf.action&&$scope.paginationConf.action!="") {
            $http({
                method: 'get',
                url: $scope.paginationConf.action + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
                params: {
                    pageindex: $scope.paginationConf.currentPage,
                    pagesize: $scope.paginationConf.itemsPerPage,
                    f: $scope.f
                }
            }).success(function (response) {
                $scope.datas = response.data;
                $scope.paginationConf.totalItems = response.dataNum;
            }).error(function (response) {
            });
        }
    }
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10
    }
    $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
    $scope.$watch( 'paginationConf.action',getInit);
    
    //首页 查询
    $scope.search=function(){
        getInit();
        $scope.formdata={};
    }

    //首页 删除
    $scope.d={};
    $scope.remove = function(index,a,action){
        var mymessage=confirm("是否确认删除  "+a);  
        if(mymessage==true){
        $scope.d={
            "AccountID":$scope.datas[index].AccountID,
            "MenuID":$scope.datas[index].MenuID,
            "ID":$scope.datas[index].ID,
            "RoleID" : $scope.datas[index].RoleID
        };
        $http({
            method:'delete',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                d:$scope.d
            }
        }).
        success(function(response) {     
        }).
        error(function(response) {
        });
        $scope.datas.splice(index,1);
        location.reload();
        }else{

        }
    }

    //新增页面  添加
    $scope.formdata={};
    $scope.addnew = function(formdata,action) {
        $http({
            method:'post',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.formdata
            }
        }).
        success(function(response) {
            if(response.isSuccess){
                alert(response.msg);
                console.log($scope.formdata);
                $scope.datas.push($scope.formdata);
                $scope.formdata={};
            }else{
                alert(response.msg);
            }

        }).
        error(function(response) {
            alert(response.msg);
        });
    };

    //编辑页面   确认修改
    var formdata=$scope.paginationConf.formdata={};
    $scope.newedit = function(formdata,action) {
        $http({
            method:'put',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.paginationConf.formdata
            }
        }).
        success(function(response) {
            if(response.isSuccess){
                alert(response.msg);
            }else{
                alert(response.msg);
            }
        }).
        error(function(response) {
            alert(response.msg);
        });
    };


    //获取编辑信息
    $scope.show=function(index,action){
        getInitmenu(index,action);
    };
    function getInitmenu(index,action){
        console.log(index);
        console.log(action);
        $http({
            method:'get',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{
                    MenuID:index,
                    RoleID:index,
                    ID:index,
                    AccountID:index
                }
            }
        }).
        success(function(response) {
            console.log($scope.paginationConf.formdata);
            console.log('修改成功');
            console.log(response);
        }).
        error(function(response) {
            console.log('修改失败');
            console.log(response);
        });
    }

//------基础模块------
    //用户管理--首页  更多
    $scope.moreuser = function(index,action){
        $scope.f={
            "userID":$scope.datas[index].AccountID,
        };
        $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {

            $scope.dataRole = response.data.Role;

            // console.log(response);
            // $scope.dataRole = response.data.Role;
            // console.log($scope.dataRole);
            // $scope.dataMenu = response.data.Menu;
            // console.log($scope.dataMenu);


        }).
        error(function(response) {
        });
    }

    //角色管理--首页 更多
    $scope.morerole = function(index,action){
        $scope.f={
            "RoleID":$scope.datas[index].RoleID,
        };
        $http({
            method:'get',
            url:action+$scope.f.RoleID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            $scope.data = response.data;

        }).
        error(function(response) {
        });
    }


    //显示角色新增页面
    $scope.addrole=function(iaction){
        getInitrole(action);
    };
    function getInitrole(action){
        $http({
            method:'get',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{
                    MenuID:index,
                    RoleID:index,
                    ID:index,
                    AccountID:index,
                }
            }
        }).
        success(function(response) {
            $scope.formdata=response.data[0];
        }).
        error(function(response) {
        });
    }
    
//------实验室管理系统------
    //签到管理--首页  更多
    $scope.moresign = function(index,action){
        $scope.f={
            "userID":index,
        };
        $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{
                    MenuID:index,
                    RoleID:index,
                    ID:index,
                    AccountID:index,
                }
            }
        }).
        success(function(response) {
            $scope.data = response.data;
        }).
        error(function(response) {
        });
    }
    
    //项目管理--首页 更多
    $scope.moreproject = function(index,action){
            $scope.f={
                "projectID":$scope.datas[index].ID,
            };
            $http({
                method:'get',
                url:action+$scope.f.projectID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            }).
            success(function(response) {
                $scope.data = response.data;

            }).
            error(function(response) {
                console.log(response);
            });
        }
})