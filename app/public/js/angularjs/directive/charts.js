/**
 * Created by Administrator on 2016/12/6.
 */
jasonapp.service('myData', function($http){
     return $http({
        method: 'get',
        url: ' /sfms/api/finance/count'+"?access_token="+localStorage.getItem('jit_token')+"&jitkey="+localStorage.getItem('jit_key'),
        params:{
                 startTime:'',
                 endTime:''
        }
    }).
    success(function(response) {
        return 1;
    }).
    error(function(response) {
        console.log($scope.formdata);
        alert(response.msg);
    });  
     
 });



//     this.IintGrid = function (url,params) {
//         return $http({
//             method: 'get',
//             url: url + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
//             params:params
//         })
//     }
// });
angular.module('Lee.canvas',[]).directive('jasonCanvas',['myData',function(myData){
    return {
        restrict: 'EA',
        template:
           ' <p>'+
           ' <canvas id="canvas_circle" width="500" height="300" '+
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

           console.log(myData.success)

            //绘制饼图  
            //比例数据和颜色  
            var data_arr = [0.05, 0.25, 0.6, 0.1];  
            var color_arr = ["#92c5e2", "#f5d3d3", "#bdf3c2", "#fdfb9d"];  
            var text_arr = ["办公耗材消费", "图书", "餐饮", "其他"];  

            drawCircle("canvas_circle", data_arr, color_arr, text_arr);  

             function drawCircle(canvasId, data_arr, color_arr, text_arr)  
            {  
                var c = document.getElementById(canvasId);  
                var ctx = c.getContext("2d");  
  
                var radius = c.height / 2 - 20; //半径  
                var ox = radius + 20, oy = radius + 20; //圆心  
  
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
