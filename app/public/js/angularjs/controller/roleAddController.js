/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('roleAddController', function($scope, $http,$q,baseService,$location) {
    $scope.tree_data = [];//树形数据，获取 $scope.tree_data过程是异步的如果没有初始化会导致报错
    $http.get("/func?access_token=" + accesstokenstring)
    .success(function (response) {
        $scope.tree_data = response.data;
    });
    
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