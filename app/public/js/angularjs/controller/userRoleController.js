/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('userRoleController', function($scope, $http,$q,baseService,$location) {
       console.log('role')
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
            console.log($scope.tree_data);
        });
        
        //获取该用户的角色信息
        var account = $location.search().AccountID;
        console.log(account);
        $http.get('/usermenurole/userID/'+$location.search().AccountID+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
       .success(function (response) {
            console.log(response.data);
            $scope.roleTree = response.data || [];
            console.log($scope.roleTree);
            console.log($scope.tree_data);
            $scope.tree_data.map(function (data, index) {
                    foreachtree(data);
                }
            );
            console.log($scope.tree_data);
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
                if(roleTree[i].Role==data.RoleID){
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

        //勾选点击效果
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
        //确认提交传递数据
        $scope.submit=function(){
        var  data=[];
        $scope.tree_data.map(function(tree){
            foreachsubmit(tree,data);
        })
        var param={
            "AccountID": $location.search().AccountID,
            "data":data
        }
        console.log(data);
        console.log(param);                   
        // $http({
        //     method:'put',
        //     url:"/backrole?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        //     data:param1
        // }).success(function(data){
        //     $http({
        //         method:'post',
        //         url:"/rolefunc?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        //         data:param
        //     }).success(function(data){
        //         $("#functionModel").modal('show');
        //     })
        // });
        }
        //获取勾选角色的ID
        function foreachsubmit(data,dataparam){
            if(data.children&&data.children.length!=0){
                data.children.map(function(branch){
                    foreachsubmit(branch,dataparam);
                })
            }
            if(data.myselected==true&&data.RoleID!=0){
                dataparam.push({"Role":data.RoleID,"RoleName":data.RoleName})             
            }
        }

       
})