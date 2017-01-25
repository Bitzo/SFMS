/**
 * Created by Administrator on 2016/12/6.
 */
jasonapp.service('myData', function($http){
    this.Iint = function (url,params) {
        return $http({
            method: 'get',
            url: ' /sfms/api/finance/count'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
            params:{
                f:{
                    startTime:'',
                    endTime:''
                }
            }
        })

    }
       
 });
angular.module('Lee.canvas',[]).directive('jasonCanvas',['myData',function(myData){
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
            
            if(attrs.source){
                var url= attrs.source;
                console.log(url)              
            }

          myData.Iint().then(function(response){
                console.log(response);

                if(url == 'inOutSum'){
                    
                    var InSum = response.data.data.InSum;
                    var OutSum =  response.data.data.OutSum;        
                    var Sum = InSum + OutSum;   

                    var a = InSum / Sum;
                    var b = OutSum / Sum;                        
    
                    console.log(a)
                    console.log(b)
                    
                    var data_arr = [a, b];  
                    var color_arr = ["#92c5e2",  "#f5de69"];  
                    var text_arr = ["收入", "支出"];  
                    drawCircle("inOutSum", data_arr, color_arr, text_arr,0,'收入支出饼状图');  

                }else{
                    
                   var InDetail = response.data.data.detail;
                    console.log(InDetail.length)
                    var InSum = response.data.data.InSum;
                    var OutSum =  response.data.data.OutSum;  

                    var data_arr = [];  
                    var color_arr = [];  
                    var text_arr = []; 
                    var in_data_arr = [];  
                    var in_color_arr = [];  
                    var in_text_arr = []; 
                    var a = 0;
                    var b = 0;

                   
                       for(var i = 0;i < InDetail.length;i++){    
                           console.log(InDetail[i].FIType)               
                            if(InDetail[i].InOutType == 13){
                                in_data_arr[a] = InDetail[i].sum / InSum ;
                                in_text_arr[a] = InDetail[i].FITypeValue; 
                                in_color_arr = ["#92c5e2"];
                                a++;
                            }else{
                                console.log(InDetail[i].sum)
                                console.log(InSum)                                
                                data_arr[b] = InDetail[i].sum / OutSum ;
                                text_arr[b] = InDetail[i].FITypeValue; 
                                color_arr = ["#92c5e2","#f5de69"];
                                b++;
                            }   
                       }

                       console.log(data_arr)
                       console.log(text_arr)
                       console.log(color_arr)

                   drawCircle("inOutSum", in_data_arr, in_color_arr, in_text_arr,250,'收入明细饼状图');  
                   drawCircle("inOutSum", data_arr, color_arr, text_arr,500,'支出明细饼状图');  
                   


                }
                
            });

             function drawCircle(canvasId, data_arr, color_arr, text_arr,a,name)  
            {  

                var c = document.getElementById(canvasId);  
                var ctx = c.getContext("2d");  
  
                var radius = 80; //半径  
                var ox = radius + 20 + a, oy = radius + 20 + a; //圆心  
                console.log(ox,oy)
  
                var width = 30, height = 10; //图例宽和高  
                var posX = ox + 90, posY = oy + 30;   //  
                var textX = posX + width + 5, textY = posY + 10;  

                var width = 30, height = 10; //名称宽和高  
                var titX = ox , titY = oy -80;   //  
                var titleX = titX + width + 5, titleY = titY + 10;  
  
                var startAngle = 0; //起始弧度  
                var endAngle = 0;   //结束弧度  


                console.log(name)  
                ctx.font = "18px Courier New";
                //设置字体填充颜色
                ctx.fillStyle = "black";
                //从坐标点(50,50)开始绘制文字
                ctx.fillText(name, 200+a, 30+a);                  

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
                    var percent = text_arr[i] + "：" + 100 * data_arr[i] + "%";  
                    ctx.fillText(percent, textX, textY + 20 * i);  
                }  
            }  
            
           
  
           
        }
    }
}]);
