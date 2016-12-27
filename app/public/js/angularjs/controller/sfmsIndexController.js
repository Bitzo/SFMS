/**
 * Created by Administrator on 2016/11/22.
 */
myApp.controller('sfmsIndexController',function($scope, $http,$q,baseService){
    $scope.f={};
    function getList(){
        $http({
            method:'post',
            url:"/sfms/getmenu?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                pageindex:$scope.paginationConf.currentPage,
                pagesize:$scope.paginationConf.itemsPerPage,
                f:$scope.f
            }
        }).
        success(function(response) {
            var  data=response.datas;
            $scope.datas=JSON.parse(data);
            $scope.paginationConf.totalItems=  response.total

        }).
        error(function(response) {
            getList();
        });
    }

    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15
    }
    getList();


    var data = [
        {
            ApplicationID:'',
            name:'应用名称1',
            FunctionID: 0,
            FunctionLevel: 0,
            ParentID:0,
            FunctionCode:'',
            Memo:'',
            type: 'folder',
            children: [
                {
                    ApplicationID:'',
                    name:'功能点名称1',
                    FunctionID: 0,
                    FunctionLevel: 0,
                    ParentID:0,
                    FunctionCode:'00001',
                    Memo:'aaaaaa',
                    
                },
                {
                    ApplicationID:'',
                    name:'功能点名称2',
                    FunctionID: 0,
                    FunctionLevel: 0,
                    ParentID:0,
                    FunctionCode:'00001',
                    Memo:'aaaaaa',
                }
            ]
            
        },
          {
            ApplicationID:'',
            name:'应用名称2',
            FunctionID: 0,
            FunctionLevel: 0,
            ParentID:0,
            FunctionCode:'',
            Memo:'',
            type: 'folder',
            children: [
                {
                    ApplicationID:'',
                    name:'功能点名称1',
                    FunctionID: 0,
                    FunctionLevel: 0,
                    ParentID:0,
                    FunctionCode:'00001',
                    Memo:'aaaaaa',
                    children:[
                        {
                            ApplicationID:'',
                            name:'功能点名称11',
                            FunctionID: 0,
                            FunctionLevel: 0,
                            ParentID:0,
                            FunctionCode:'00001',
                            Memo:'aaaaaa',
                        },
                        {
                            ApplicationID:'',
                            name:'功能点名称12',
                            FunctionID: 0,
                            FunctionLevel: 0,
                            ParentID:0,
                            FunctionCode:'00001',
                            Memo:'aaaaaa',
                        },


                    ]                    
                },
                {
                    ApplicationID:'',
                    name:'功能点名称2',
                    FunctionID: 0,
                    FunctionLevel: 0,
                    ParentID:0,
                    FunctionCode:'00001',
                    Memo:'aaaaaa',
                }
            ]
            
        },
    ];

    $scope.expanded_params = new ngTreetableParams({
       getNodes: function(parent) {
            return parent ? parent.children : data;
        },
        /*getNodes: function(parent) {
        var deferred = $q.defer();
        $http({
            method:'get',
            url:"/func?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
        }).
        success(function(response) {
           deferred.resolve(response.data);
           return response.data;
        }).
        error(function(response) {
        });
        return deferred.promise;
    },*/
        getTemplate: function(node) {
            return 'tree_node';
        },
        options: {
            initialState: 'expanded'
        }
    });


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
    
    //查询
    $scope.search=function(){
        getInit();
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
                $scope.datas.push($scope.formdata);
            }else{
                alert(response.msg);
            }

        }).
        error(function(response) {
            alert(response.msg);
            console.log(response);
            console.log('no');
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
            $scope.paginationConf.formdata=response.data[0];
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
        console.log(formdata);
        console.log(action);
        $http({
            method:'put',
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata:$scope.paginationConf.formdata
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
            alert(response.msg);
            console.log(formdata);
            console.log(response);
            console.log('no');
        });
    };


    //删除
    $scope.d={};
    $scope.remove = function(index,action){
        var mymessage=confirm("是否确认删除此项");  
        if(mymessage==true){
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
        }else{

        }

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
    

     //显示项目模态框
        $scope.moreproject = function(index,action){
                console.log(action);
                console.log('more');
                $scope.f={
                    "projectID":$scope.datas[index].ID,
                };
                $http({
                    method:'get',
                    url:action+$scope.f.projectID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
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
    
     //新增项目管理中的用户列表
    $scope.formdata.data=[];
    $scope.addUser = function(item){
        console.log('addUser');
        console.log(item.AccountID);
        $scope.formdata.data.push($scope.user);
        $scope.user={};
    }
    //重置项目管理中的用户列表
    $scope.resetUser = function(item){
        console.log(item.$index);
        $scope.formdata.data.splice(item.$index,1);
    }
   


    //删除项目模态框中的用户
    $scope.d={};
    $scope.removeUser = function(index,action){
        console.log('delete');
        console.log(index);
        console.log(action);
        $scope.d={
            "ID":$scope.data[index].ID,
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
        $scope.data.splice(index,1);
        console.log($scope.d);
    }
   

    

    //显示签到模态框数据
    $scope.moresign = function(index,action){
        console.log(index);
        console.log(action);        
                
        console.log('more');
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
            console.log(response);
            $scope.data = response.data;
        }).
        error(function(response) {
            console.log(response);
        });
    }
    
    

});