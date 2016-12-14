/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('baseController', function($scope, $http,baseService) {

    //显示左侧菜单栏
    $scope.menus =baseService.InitMenu().then(function(response){
        $scope.menus = response.data.data.Menu;
    });
    ;
    //分页初始化数据
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        action: "1111"
    }


    //应用角色菜单用户首页数据显示
    $scope.f={};
    function getInit(){
        $http({
            method:'get',
            url:$scope.paginationConf.action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex:$scope.paginationConf.currentPage,
                pagesize:$scope.paginationConf.itemsPerPage,
                f:$scope.f
            }
        }).
        success(function(response) {
            $scope.datas=response.data;
            $scope.paginationConf.totalItems= response.dataNum;
        }).
        error(function(response) {
        });
    }
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15
    }
    $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
    $scope.$watch( 'paginationConf.action',getInit);
    $scope.search=function(){
        getInit();
    }


//添加角色
    $scope.roleSubmit=function(role){
        $http({
            method: 'POST',
            url: "/role",
            data: {
                'ApplicationID':role.applicationID,
                'RoleName':role.roleName,
                'RoleCode':role.roleCode,
                'IsActive':role.isActive,
                'roleFunck':role.Funck,
                'access_token':localStorage.getItem('jit_token'),
                'jitkey':localStorage.getItem('jit_key')
            }

        }).
        success(function(response) {

        }).
        error(function(response) {
            if (response && response.data && !response.isSuccess) {
                alert(response.data.msg);
            } else {
                alert('提交失败!');
            }
        });
    }

    //删除角色
    $scope.del=function(RoleID){
        var index=-1;
        for(var i=0;i<$scope.datas.length;i++){
            if($scope.datas[i]['RoleID']=RoleID){
                index=i;
                break;
            };
        }
        $scope.datas.splice(index,1);
    }
    //编辑角色
    $scope.update=function(RoleID){

    }


    //新增
    $scope.formdata={};
    $scope.addnew = function(formdata,action) {
        console.log(formdata);
        console.log(action);
        $http({
            method:'post',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.formdata
            }
        }).
        success(function(response) {
            console.log($http.url)
            console.log($scope.formdata);
            console.log(response);
            if(response.isSuccess){
                alert(response.msg);
            }else{
                alert(response.msg);
            }

        }).
        error(function(response) {
            console.log(response);
            console.log('no');
        });
    };


    //修改
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
            $scope.formdata=response.data[0];
            console.log($scope.formdata.ApplicationID);
            console.log('修改成功');
            console.log(response);
        }).
        error(function(response) {
            console.log('修改失败');
            console.log(response);
        });
    }

    //提交修改
    $scope.formdata={};
    $scope.newedit = function(formdata,action) {
        console.log(formdata);
        console.log(action);
        $http({
            method:'put',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.formdata
            }
        }).
        success(function(response) {
            console.log($http.url)
            console.log($scope.formdata);
            console.log(response);
            if(response.isSuccess){
                console.log('提交成功');
                alert(response.msg);
            }else{
                alert(response.msg);
            }

        }).
        error(function(response) {
            console.log('提交失败');
            console.log(formdata);
            console.log(response);
            console.log('no');
        });
    };


    //删除
    $scope.d={};
    $scope.remove = function(index,action){
        console.log('delete');
        console.log(index);
        console.log(action);
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
            console.log($scope.d);
            console.log('删除成功');
            console.log(response.msg);
        }).
        error(function(response) {
            console.log($scope.d);
            console.log('删除失败');
            console.log(response.msg);
        });
        $scope.datas.splice(index,1);
        console.log($scope.d);
    }


    //显示用户模态框数据
    $scope.moreuser = function(index,action){
        console.log('more');
        $scope.f={
            "userID":$scope.datas[index].AccountID,
        };
        $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            console.log(response);
            $scope.data = response.data.Role;
            console.log($scope.menus);

        }).
        error(function(response) {
            console.log(response);
        });
    }


    //显示角色模态框
    $scope.morerole = function(index,action){
        console.log('more');
        $scope.f={
            "RoleID":$scope.datas[index].RoleID,
        };
        $http({
            method:'get',
            url:action+$scope.f.RoleID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            console.log(response);
            $scope.data = response.data;
            console.log($scope.menus);

        }).
        error(function(response) {
            console.log(response);
        });
    }


    //显示角色新增页面
    $scope.addrole=function(iaction){
        getInitrole(action);
    };


    function getInitrole(action){
        console.log(action);
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
            console.log($scope.formdata.ApplicationID);
            console.log('修改成功');
            console.log(response);
        }).
        error(function(response) {
            console.log('修改失败');
            console.log(response);
        });
    }

})