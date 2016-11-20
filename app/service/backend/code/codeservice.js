/**
 * @Author: luozQ
 * @Date:   2016-11-20 14:35:38
 * @Last Modified by:   luozQ
 * @Last Modified time: 2016-11-20 20:41
 * @Function: 验证码生成
 */

var captchapng=require('captchapng');

//生成验证码
exports.generateCode=function(req,res)
{
    var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):100;
    var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):30;
    var code = parseInt(Math.random()*9000+1000);
    req.session.code = code;
    console.log("生成验证码"+code);
    var p = new captchapng(width,height, code);
    p.color(0, 0, 0, 0); 
    p.color(80, 80, 80, 255);
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}