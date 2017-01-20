/**
 * Created by Administrator on 2016/12/14.
 */
myApp.controller('baseController', function($scope, $http,$q,baseService) {
    //显示左侧菜单栏
    $scope.menus =baseService.InitMenu().then(function(response){
        $scope.menus = response.data.data.Menu;
    });

//------所有模块------
    //分页初始化数据
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        action: ""
    };

    //首页 数据显示
    $scope.f={};
    function getInit(){
        if($scope.paginationConf&&$scope.paginationConf.action&&$scope.paginationConf.action!="") {
            $http({
                method: 'get',
                url: $scope.paginationConf.action + "?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
                params: {
                    pageindex: $scope.paginationConf.currentPage,
                    pagesize: $scope.paginationConf.itemsPerPage,
                    f: $scope.f
                }
            }).success(function (response) {
                $scope.datas = response.data;
                $scope.paginationConf.totalItems = response.dataNum;
            }).error(function (response) {
            });
        }
    }
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10
    }
    $scope.$watch( 'paginationConf.currentPage+paginationConf.itemsPerPage',getInit);
    $scope.$watch( 'paginationConf.action',getInit);
    
    //首页 查询
    $scope.search=function(){
        $scope.paginationConf.currentPage = 1;
        getInit();
        $scope.formdata={};
    }

    //首页 删除
    $scope.d={};
    $scope.remove = function(index,a,action){
        var mymessage=confirm("是否确认删除  "+a);  
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

    //新增页面  添加
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
                console.log($scope.formdata);
                //$scope.datas.push($scope.formdata);
                //$scope.formdata={};
            }else{
                alert(response.msg);
            }

        }).
        error(function(response) {
            alert(response.msg);
        });
    };

    //编辑页面   确认修改
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


    //获取编辑信息
    $scope.show=function(index,action){
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
            console.log(response);
            console.log($scope.paginationConf.formdata);
            console.log('修改成功');
            console.log(response);
        }).
        error(function(response) {
            console.log('修改失败');
            console.log(response);
        });
    };
    

//------基础模块------
    //用户管理--首页  更多
    $scope.moreuser = function(index,action){
        $scope.f={
            "userID":$scope.datas[index].AccountID,
        };
        $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {

            $scope.dataRole = response.data.Role;

            // console.log(response);
            // $scope.dataRole = response.data.Role;
            // console.log($scope.dataRole);
            // $scope.dataMenu = response.data.Menu;
            // console.log($scope.dataMenu);


        }).
        error(function(response) {
        });
    }

    //角色管理--首页 更多
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
    
//------实验室管理系统------
    //签到管理--首页  更多
    $scope.moresign = function(index,page,action){
        $scope.f={
            "userID":index,
        };
        $scope.jumpPageNum = page;
        $scope.currentPage = page;
        
        $http({
            method:'get',
            url:action+$scope.f.userID+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                pageindex: $scope.jumpPageNum,
                pagesize: 10,
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
            $scope.numberOfPages = response.totalPage; 

            console.log('当前页数'+$scope.currentPage);                      
            console.log('总计页数'+$scope.numberOfPages);   
            console.log(response);  

            $scope.length = response.dataNum;
                  
            $scope.pageList = [];
            
            if($scope.numberOfPages <= 7){
                // 判断总页数如果小于等于7，若小于则直接显示
                for(i =1; i <= $scope.numberOfPages; i++){
                        $scope.pageList.push(i);
                    }
            }else{
                // 总页数大于7（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                // 计算中心偏移量
                var a = $scope.currentPage + 2;
                console.log('最大页数'+a); 
                console.log('当前页数'+ $scope.currentPage);                        
                if(($scope.currentPage-2) <= 1){
                    // 左边没有...
                    for(i =1; i <= 5; i++){
                        $scope.pageList.push(i);
                        console.log($scope.pageList);
                    }
                    $scope.pageList.push('...');
                    $scope.pageList.push($scope.numberOfPages);
                }else if(($scope.currentPage + 2) >= $scope.numberOfPages){//右边没有
                    var a = $scope.currentPage + 2;                      
                    $scope.pageList.push(1);
                    $scope.pageList.push('...');
                    console.log($scope.pageList);
                    for(i = 3; i >= 1; i--){
                        $scope.pageList.push($scope.numberOfPages - i);
                        console.log($scope.pageList);
                    }
                    $scope.pageList.push($scope.numberOfPages);
                }else{
                    // 最后一种情况，两边都有...
                    $scope.pageList.push(1);
                    $scope.pageList.push('...');

                    for(i = 1 ; i >= 1; i--){
                        $scope.pageList.push($scope.currentPage - i);
                    }
                    $scope.pageList.push($scope.currentPage);
                    for(i = 1; i <= 1; i++){
                        $scope.pageList.push($scope.currentPage + i);
                    }

                    $scope.pageList.push('...');
                    $scope.pageList.push($scope.numberOfPages);
                }
            }

                       
        }).
        error(function(response) {
        });
        //页数点击按钮
        $scope.pageChanged = function(n) {
            page = n.item;
            $scope.moresign(index,page,'/sfms/api/sign/')   
        }
        //页数输入按钮
        $scope.jumpToPage = function(m){
            $scope.moresign(index,m.jumpPageNum,'/sfms/api/sign/')          
        };
        //下一页
        $scope.nextPage = function(){
            if(page<$scope.pageList.length){
                page = page+1;
                $scope.moresign(index,page,'/sfms/api/sign/')
            }                      
        };
        //上一页
        $scope.prevPage = function(m){
           if(page>1){
                page = page-1;
                $scope.moresign(index,page,'/sfms/api/sign/')
            }     
        };    
  
    }
    
    //项目管理--首页 更多
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

    //查询列表点击表头排序
    $scope.logSort = function (sortindex) {
        var allArrow = document.getElementsByClassName("arrow");
        for(var i = 0;i < allArrow.length;i++){
            allArrow[i].style.display = 'none';
        }      
        var thisArrow = document.getElementById(sortindex).getElementsByClassName("arrow"); 

        if ($scope.f.sortindex == sortindex) {
            $scope.f.sortDirection = $scope.f.sortDirection == 'asc' ? 'desc' : 'asc';
        } else {
            $scope.f.sortDirection = 'asc';
        } 

        if($scope.f.sortDirection == 'desc'){             
           thisArrow[1].style.display = 'block';
        }else{           
           thisArrow[0].style.display = 'block';
        }   
        $scope.f.sortindex = sortindex;
        getInit();
    }

    //绩效统计--首页 更多
    $scope.moreKPI = function(index,page,f,action){
        $scope.f={
            "UserID":$scope.datas[index].userID,
            "StartTime":f.startTime,
            "EndTime":f.endTime,
            'KPIStatus': '通过',
            'IsActive':1
        };
        $scope.jumpPageNum = page;
        $scope.currentPage = page;
        $http({
            method:'get',
            params:{
                pageindex: $scope.jumpPageNum,
                pagesize: 10,
                f:$scope.f
            },
            url:action+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        }).
        success(function(response) {
            $scope.data = response.data;

        }).
        error(function(response) {
            console.log(response);
        });
    }
//------金科小哥------
    //订单管理--首页  模态框
     //修改
     $scope.jitOrderEdit = function(OrderID,OrderStatus,OrderStatusDesc){
         $scope.order = {
             'OrderID': OrderID ,
             'OrderStatus':OrderStatus,
             'OrderStatusDesc':OrderStatusDesc
         }
         console.log($scope.order);
         $http({
            method:'get',
            url: '/datadict/plain' +"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                isPaging:1,
                pageindex:1,
                pagesize:10,
                f:{
                    Category:"dc_orderstatus"
                }
            }
        }).
        success(function(response) {
            $scope.orderStatus=response.data;
        }).
        error(function(response) {
        });    
    }

    //确认修改
    $scope.saveOrderEdit = function(){
         $scope.formdata= {
             "OrderID" : $scope.order.OrderID,
             "OrderStatus" : parseInt($scope.order.OrderStatus),
         }
         console.log($scope.formdata);
         $http({
            method:'put',
            url: "jinkeBro/order"+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            data:{
                formdata : $scope.formdata
            }
        }).
        success(function(response) {
            if(response.isSuccess){
                alert(response.msg);
                console.log($scope.formdata);
            }else{
                alert(response.msg);
            }

        }).
        error(function(response) {
            alert(response.msg);
        });  
    }

})