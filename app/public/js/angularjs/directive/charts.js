/**
 * Created by Administrator on 2016/12/6.
 */
jasonapp.service('myData', function($http){
    this.Iint = function (url,params) {
        return $http({
            method: 'get',
            url: ' /sfms/api/finance/count'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:params
        })

    }
       
 });
angular.module('Lee.canvas',[]).directive('jasonCanvas',['$location','myData',function(location,myData){
    return {
        restrict: 'EA',
        template:
           ' <p>'+
           ' <canvas id="inOutSum" width="1000" height="1000" '+
           ' 浏览器不支持canvas  '+
           '  </canvas> '+
           ' </p>',
        replace: true,
        scope: {
            conf: '='
        },
        replace:true,
        transclude:true,
        link: function (scope, element, attrs) {
             var params = location.search()

            if(attrs.source){
                var url= attrs.source;
                
            }

          myData.Iint(url,params).then(function(response){

                if(url == 'inOutSum'){
                    
                    var InSum = response.data.data.InSum;
                    var OutSum =  response.data.data.OutSum;        
                    var Sum = InSum + OutSum;   

                    var a = (InSum / Sum).toFixed(4);
                    var b = (OutSum / Sum).toFixed(4);                      
    
                    
                    var data_arr = [a, b];  
                    var color_arr = ["#92c5e2",  "#f5de69"];  
                    var text_arr = ["收入", "支出"];  
                    var mon_arr = [InSum, OutSum];                      
                    drawCircle("inOutSum", data_arr, color_arr, text_arr,mon_arr,0,'收入支出饼状图');  

                }else{
                    
                   var InDetail = response.data.data.detail;
                    var InSum = response.data.data.InSum;
                    var OutSum =  response.data.data.OutSum;  

                    var data_arr = [];  
                    var color_arr = [];  
                    var text_arr = []; 
                    var mon_arr = [];                                          
                    var in_data_arr = [];  
                    var in_color_arr = [];  
                    var in_text_arr = []; 
                    var in_mon_arr = [];                                                     
                    var a = 0;
                    var b = 0;

                   
                       for(var i = 0;i < InDetail.length;i++){    
                                      
                            if(InDetail[i].InOutType == 13){
                                in_data_arr[a] = (InDetail[i].sum / InSum ).toFixed(4);
                                in_text_arr[a] = InDetail[i].FITypeValue; 
                                in_mon_arr[a] = InDetail[i].sum;                                 
                                in_color_arr = ["#E5A2C1","#F8CCD1",'#9EA3D2','#7A8EC7'];
                                a++;
                            }else{
                                                               
                                data_arr[b] = (InDetail[i].sum / OutSum).toFixed(4) ;
                                text_arr[b] = InDetail[i].FITypeValue; 
                                mon_arr[b] = InDetail[i].sum;  
                                color_arr = ["#E5A2C1","#F8CCD1",'#9EA3D2','#7A8EC7'];
                                b++;
                            }   
                       }

         

                   drawCircle("inOutSum", in_data_arr, in_color_arr, in_text_arr,in_mon_arr,250,'收入明细饼状图');  
                   drawCircle("inOutSum", data_arr, color_arr, text_arr,mon_arr,500,'支出明细饼状图');  
                   


                }
                
            });

             function drawCircle(canvasId, data_arr, color_arr, text_arr,mon_arr,a,name)  
            {  

                var c = document.getElementById(canvasId);  
                var ctx = c.getContext("2d");  
  
                var radius = 80; //半径  
                var ox = radius + 180, oy = radius + 20 + a; //圆心  
               
  
                var width = 30, height = 10; //图例宽和高  
                var posX = ox + 120, posY = oy + 30;   //  
                var textX = posX + width + 5, textY = posY + 10;  
  
                var startAngle = 0; //起始弧度  
                var endAngle = 0;   //结束弧度  


               
                ctx.font = "18px Courier New";
                //设置字体填充颜色
                ctx.fillStyle = "black";
                //从坐标点(200+a,30+a)开始绘制文字
                ctx.fillText(name, ox-200, 30+a);                  

                for (var i = 0; i < data_arr.length; i++)  
                {  
                    //绘制饼图  
                    endAngle = endAngle + data_arr[i] * Math.PI * 2; //结束弧度  
                    ctx.fillStyle = color_arr[i];  
                    ctx.beginPath();  
                    ctx.moveTo(ox, oy); //移动到到圆心  
                    ctx.arc(ox, oy, radius, startAngle, endAngle, false);  
                    ctx.closePath();  
                    ctx.fill();  
                    startAngle = endAngle; //设置起始弧度  
  
                    //绘制比例图及文字  
                    ctx.fillStyle = color_arr[i];  
                    ctx.fillRect(posX, posY + 20 * i, width, height);  
                    ctx.moveTo(posX, posY + 20 * i);  
                    ctx.font = 'bold 12px 微软雅黑';    //斜体 30像素 微软雅黑字体  
                    ctx.fillStyle = color_arr[i]; //"#000000";  
                    var percent = text_arr[i] + "：" + 100 * data_arr[i] + "%" + "  " + "金额" + "："  + mon_arr[i].toFixed(2);
                    ctx.fillText(percent, textX, textY + 20 * i);  
                }  
            }  
            
           
  
           
        }
    }
}]);
