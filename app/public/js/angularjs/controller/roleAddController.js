/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('roleAddController', function($scope, $http,$q,baseService,$location) {
     //应用名称
        $http({
            method:'get',
            url: '/app'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    isActive : 1
                }
            }
        }).
        success(function(response) {
            $scope.applicationNames=response.data;
        }).
        error(function(response) {
        });


    $scope.tree_data = [];  
    //获取角色数据
    $http({
        method: 'get',
        url: "/backrole?access_token=" + accesstokenstring,
        params: {
            f: {"RoleID":1}
        }
    }).success(function (response) {
        $scope.formdata.ApplicationID=1;
        //获取树形菜单数据
        $http.get("/func?access_token=" + accesstokenstring)
        .success(function (response) {
            for (i=0;i<response.data.length;i++)
            {                 
                if(response.data[i].ApplicationID == $scope.formdata.ApplicationID)
                  $scope.tree_data[0] = response.data[i];
            }
            console.log($scope.tree_data);
        });
    })
   $scope.appChanged = function() {
            console.log($scope.formdata.ApplicationID)
             $http.get("/func?access_token=" + accesstokenstring)
            .success(function (response) {
                for (i=0;i<response.data.length;i++)
                {                   
                    if(response.data[i].ApplicationID == $scope.formdata.ApplicationID)
                    $scope.tree_data[0] = response.data[i];
                    
                }
                console.log($scope.tree_data);
                $http.get("/rolefunc/" + $location.search().RoleID + "?access_token=" + accesstokenstring)
                .success(function (response) {
                    console.log(response)
                    $scope.rolefunction = response.data || [];
                    $scope.tree_data.map(function (data, index) {
                            foreachtree(data);
                        }
                    );
                });
            });
        }
    
    function foreachtree(data){
        if(data.children&&data.children.length!=0){
            data.children.map(function(branch){
                foreachtree(branch);
            })
        }
        var rolefunction= $scope.rolefunction;
        for(var i=0;i<rolefunction.length;i++)
        {
            if(rolefunction[i].FunctionID==data.FunctionID){
                data.myselected=true;
                break;
            }
        }
        if(i==rolefunction.length){
            data.myselected=false;
        }else {
            data.myselected = true;
        }
    }
    //第一列显示的数据
    $scope.expanding_property = {
        field: "FunctionName",
        displayName: "功能名字",
        sortable: true,
        filterable: true,
        cellTemplate: "<i>{{row.branch[expandingProperty.field]}}</i>"
    };
    
    //勾选点击效果
        $scope.clickHander=function(branch,parent){
            if(parent){
                parent.myselected = true;
                for(var i=0,j=0;i<parent.children.length;i++){
                if(!parent.children[i].myselected){
                     j++;
                }
                }
                if(j == parent.children.length){
                    parent.myselected = false;
                }
            }
            changeseletedChild(branch,branch.myselected);
            
        }
        function changeseletedChild(branch,val){
            if(branch.children&&branch.children.length!=0){
                branch.children.map(function(branch){
                    changeseletedChild(branch,val);
                })
            }
            branch.myselected=val;
            branch.expanded=true;
        }
    //添加角色
    $scope.submit=function() {
        var data = [];
        $scope.tree_data.map(function (tree) {
            foreachsubmit(tree, data);
        })
        var param1 = {
            formdata: $scope.formdata,
            funcData: data
        }
        console.log(param1)
        $http({
            method: 'post',
            url: "/backrole?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
            data: param1
        }).success(function (response) {
            console.log(response.msg)
            alert(response.msg);
        }).error(function (response) {
            console.log(response.msg);
            alert(response.msg);
        });
    }
    function foreachsubmit(data,dataparam){
        if(data.children&&data.children.length!=0){
            data.children.map(function(branch){
                foreachsubmit(branch,dataparam);
            })
        }
        if(data.myselected==true&&data.FunctionID!=0){
            dataparam.push({"FunctionID":data.FunctionID})
        }
    }
})