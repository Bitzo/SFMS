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
    //获取树形数据
    $http.get("/func?access_token=" + accesstokenstring)
        .success(function (response) {
            $scope.tree_data = response.data;
            $scope.tree_data.map(function(val){
                foreachtree(val);
            })
        });
    $http.get("/rolefunc/"+$location.search().RowID+"?access_token=" + accesstokenstring)
        .success(function (response) {
           var rolefunction= response.data||[];
            $scope.tree_data.map(function(data,index){
                 for(var i=0;i<rolefunction.length;i++)
                 {
                     if(rolefunction[i].FunctionID==data.FunctionID){
                         data.myselected=true;
                         break;
                     }
                 }
                if(i==rolefunction.length){
                    data.myselected=false;
                }
                data.myselected=true;
            }
            )
        });
    function foreachtree(data){
        if(data.children&&data.children.length!=0){
            data.children.map(function(branch){
                foreachtree(branch);
            })
        }
        data.myselected=true;
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
})