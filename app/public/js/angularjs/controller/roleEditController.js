/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('roleEditController', function($scope, $http,$q,baseService,$location) {
    $scope.tree_data = [];//树形数据，获取 $scope.tree_data过程是异步的如果没有初始化会导致报错
    $scope.disable=true;//右边的编辑框是否可编辑
    $scope.btnSaveMessage='编辑';//编辑框中的提交按钮的作用
    $scope.parent=[];//新增时，当前节点的父节点
    $scope.Config={
        ModelTitle:'确定',
        ModelBody:'保存成功',
        BtnCancel:'取消',
        BtnSave:'确定',
        Cancel:function(){
            $("#functionModel").modal('hide');
        },
        Save:function(){
            $("#functionModel").modal('hide');
        }
    };

    $http.get("/func?access_token=" + accesstokenstring)
        .success(function (response) {
            $scope.tree_data = response.data;
            console.log($scope.tree_data);
            getrolefunction();
        });
    //获取树形数据
    $http({
        method: 'get',
        url: "/backrole?access_token=" + accesstokenstring,
        params: {
            f: {"RoleID":$location.search().RoleID}
        }
    }).success(function (response) {
        $scope.formdata =response.data[0];
        $scope.formdata.ApplicationID=$scope.formdata.ApplicationID+'';
    })
    function getrolefunction() {
        $http.get("/rolefunc/" + $location.search().RoleID + "?access_token=" + accesstokenstring)
            .success(function (response) {
                $scope.rolefunction = response.data || [];
                $scope.tree_data.map(function (data, index) {
                        foreachtree(data);
                    }
                );
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
    //grid展示的列
    $scope.col_defs = [
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
        },
        {
            field: "IsActive",
            displayName: "是否删除",
            cellTemplate: "<i>{{row.branch[col.field]=='0'?'是':'否'}}</i>"
        }
    ];
    $scope.clickHander=function(branch,parent){
        if(branch.myselected==false) {
            parent.myselected = false;
        }
        changeseletedChild(branch,branch.myselected)
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
    $scope.submit=function(){
        var  data=[];
        $scope.tree_data.map(function(tree){
            foreachsubmit(tree,data);
        });

        var param={
            formdata:$scope.formdata,
            funcdata:data
        };

        $http({
            method:'put',
            url:"/backrole?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:param
        }).success(function(response){
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