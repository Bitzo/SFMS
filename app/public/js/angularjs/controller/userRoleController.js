/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('userRoleController', function($scope, $http,$q,baseService,$location) {
       $scope.tree_data = [];
       //获取树形角色数据
       $http({
            method:'get',
            url: '/backrole' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{}
            }
        })
        .success(function (response) {
            $scope.tree_data = response.data;
            var tree_data= $scope.tree_data;  
            console.log(tree_data.length)       
            for(var i=0;i<tree_data.length;i++)
            { 
                    tree_data[i].RoleName+="---"
                    tree_data[i].RoleName+=tree_data[i].ApplicationName   
            }
            //获取该用户的角色信息
            $http.get('/userrole/userID/'+$location.search().AccountID+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
            .success(function (response) {
                    console.log(response)  
                    $scope.roleTree = response.data || [];  
                    $scope.tree_data.map(function (data, index) {
                            console.log(data+index)
                            foreachtree(data);
                        }
                    );
             });
        });
        
        //显示已经勾选的用户角色
        function foreachtree(data){
            if(data.children&&data.children.length!=0){
                data.children.map(function(branch){
                    foreachtree(branch);
                })
            }
            var roleTree= $scope.roleTree;
            for(var i=0;i<roleTree.length;i++)
            {
                if(roleTree[i].RoleID==data.RoleID){
                    data.myselected=true;
                    break;
                }
            }
            if(i==roleTree.length){
                data.myselected=false;
            }else {
                data.myselected = true;
            }
        }

       
        //确认提交传递数据
        $scope.submit=function(){
        var  data=[];
            $scope.tree_data.map(function(tree){
                foreachsubmit(tree,data);
            })
            var f={
                "AccountID": $location.search().AccountID,
                "data":data
            }
            console.log(data);
            console.log(f);                   
            $http({
                method:'post',
                url:"/userrole?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                data:f
            }).success(function(response) {
                alert(response.msg);
            }).
            error(function(response) {
                alert(response.msg);  
            });
        }
        //获取勾选角色的ID
        function foreachsubmit(data,dataparam){
            if(data.children&&data.children.length!=0){
                data.children.map(function(branch){
                    foreachsubmit(branch,dataparam);
                })
            }
            if(data.myselected==true&&data.RoleID!=0){
                dataparam.push({"RoleID":data.RoleID,"RoleName":data.RoleName})             
            }
        }

       
})