/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('userMenuController', function($scope, $http,$q,baseService,$location) {
       $scope.tree_data = [];
       //获取树形菜单数据
       $http.get('/backmenu/tree?'+"access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
       .success(function (response) {
           console.log(response)
            $scope.tree_data = response.data;
                        console.log($scope.tree_data)

            var tree_data= $scope.tree_data;     
            for(var i=0;i<tree_data.length;i++)
            { 
                if(tree_data[i].IsActive==0){
                    console.log(i)                    
                    console.log(tree_data[i])
                    tree_data[i].MenuName+='(失效)'
                }
                if(tree_data[i].children.length){
                    for(var j=0;j<tree_data[i].children.length;j++)
                { 
                    if(tree_data[i].children[j].IsActive==0){
                        tree_data[i].children[j].MenuName+='(失效)'
                    }
                }

                }
                
            }
        });
        
        
       
        //获取该用户的菜单信息
        $http.get('/usermenurole/userID/'+$location.search().AccountID+"?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
       .success(function (response) {
            console.log(response.data.Menu)
            $scope.menuTree = response.data.Menu || [];
            console.log($scope.menuTree)            
            $scope.tree_data.map(function (data, index) {
                console.log(data)
                    foreachtree(data);
                }
            );

        });
        function foreachtree(data){
            if(data.children&&data.children.length!=0){
                data.children.map(function(branch){
                    foreachtree(branch);
                })
            }
            var menuTree= $scope.menuTree;     
            for(var i=0;i<menuTree.length;i++)
            { 
                
                if(menuTree[i].MenuID==data.MenuID){
                    data.myselected=true;
                    break;
                }
            }
            if(i==menuTree.length){
                data.myselected=false;
            }else {
                data.myselected = true;
            }
        }

        //勾选点击效果
        $scope.clickHander=function(branch,parent){
            if(parent){
                parent.myselected = true;
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
            var f={
                "AccountID": $location.search().AccountID,
                "data":data
            }
            console.log(data);
            console.log(f);                   
            $http({
                method:'post',
                url:"/usermenurole?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
                data:f
            }).success(function(response) {
                alert(response.msg);
            }).
            error(function(response) {
                alert(response.msg);  
            });
        }
        //获取勾选菜单的ID
        function foreachsubmit(data,dataparam){
            if(data.children&&data.children.length!=0){
                data.children.map(function(branch){
                    foreachsubmit(branch,dataparam);
                })
            }
            if(data.myselected==true&&data.MenuID!=0){
                dataparam.push({"MenuID":data.MenuID,"MenuName":data.MenuName})             
            }
        }

       
})