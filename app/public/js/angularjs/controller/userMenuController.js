/**
 * Created by Administrator on 2017/1/11.
 */

myApp.controller('userMenuController', function($scope, $http,$q,baseService,$location) {
       $scope.tree_data = [];

       $http.get('/backmenu?'+"access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'))
       .success(function (response) {
            $scope.tree_data = response.data.Menu;
            console.log($scope.tree_data);
        });
       
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