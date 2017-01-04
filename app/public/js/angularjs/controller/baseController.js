/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('baseController', function($scope, $http,$q,baseService) {

    $http.get("/func?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
        .success(function (response) {
            $scope.tree_data =response.data;
        });
    $scope.expanding_property = {
        field: "FunctionName",
        displayName: "功能名字",
        sortable: true,
        filterable: true,
        cellTemplate: "<input type='checkbox'><i>{{row.branch[expandingProperty.field]}}</i>"
    };
    $scope.col_defs = [
        {
            field: "FunctionName",
            sortable: true,
            sortingType: "string",
            displayName:"功能名字",
            cellTemplate: "{{row.branch[col.field]}}</strong>"
        },
        {
            field: "ApplicationID",
            sortable: true,
            sortingType: "number",
            filterable: true
        },
        {
            field: "FunctionID",
            sortable: true,
            sortingType: "number"
        },
        {
            field: "ParentID"
        }
    ];
    //显示左侧菜单栏
    $scope.menus =baseService.InitMenu().then(function(response){
        $scope.menus = response.data.data.Menu;
    });
    ;
    //分页初始化数据
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
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
        itemsPerPage: 10
    }
    $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
    $scope.$watch( 'paginationConf.action',getInit);
    
    //查询
    $scope.search=function(){
        getInit();
        $scope.formdata={};
    }


    //新增
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


    //编辑完成提交信息
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



    //删除
    $scope.d={};
    $scope.remove = function(index,action){
        var a = index+1;
        var mymessage=confirm("是否确认删除第"+a+"项");  
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


    //显示用户模态框数据
    $scope.moreuser = function(index,action){
        $scope.f={
            "userID":$scope.datas[index].AccountID,
        };
        $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {

            $scope.data = response.data.Role;

            // console.log(response);
            // $scope.dataRole = response.data.Role;
            // console.log($scope.dataRole);
            // $scope.dataMenu = response.data.Menu;
            // console.log($scope.dataMenu);


        }).
        error(function(response) {
        });
    }


    //显示角色模态框
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
    

     //显示项目模态框
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
    

    //删除项目编辑中的用户
    $scope.d={};
    $scope.removeUser = function(index,action){
        var mymessage=confirm("是否确认删除此项");  
        $scope.d={
            "ID":$scope.paginationConf.formdata.userdata[index].ID,
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
        $scope.paginationConf.formdata.userdata.splice(index,1);
    }
   

    

    //显示签到模态框数据
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
    
    

})