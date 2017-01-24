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
           ' <canvas id="inOutSum" width="500" height="300" '+
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

          myData.Iint().then(function(response){
                console.log(response);

                var InSum = response.data.data.InSum;
                var OutSum =  response.data.data.OutSum;        
                var Sum = InSum + OutSum;   

                var a = InSum / Sum;
                var b = OutSum / Sum;                        
 
                console.log(a)
                console.log(b)
                
                var data_arr = [a, b];  
                var color_arr = ["#92c5e2",  "#f5de69"];  
                var text_arr = ["{{chartName}}", "支出"];  
                drawCircle("inOutSum", data_arr, color_arr, text_arr,0);  
            });
      
        //   $scope.changed = function(valueID){
        //             console.log(scope.chartName)
        //   }

            

             function drawCircle(canvasId, data_arr, color_arr, text_arr,a)  
            {  

                var c = document.getElementById(canvasId);  
                var ctx = c.getContext("2d");  
  
                var radius = c.height / 2 - 20; //半径  
                var ox = radius + 20 + a, oy = radius + 20 + a; //圆心  
                console.log(ox,oy)
  
                var width = 30, height = 10; //图例宽和高  
                var posX = ox * 2 + 20, posY = 30;   //  
                var textX = posX + width + 5, textY = posY + 10;  
  
                var startAngle = 0; //起始弧度  
                var endAngle = 0;   //结束弧度  
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
