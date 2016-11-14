var express=require('express');
var url = require("url");
var crypto = require("crypto");

var router=express.Router();

//金科小哥主站点
router.get('/', function(req, res, next) {
    res.json({
        title: '实验室管理系统主站'
    });
});

//微信开发者认证
router.get('/wechat/accesscheck',function(req,res){
  var query = url.parse(req.url,true).query;
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;

  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = 'snail',
  oriArray.sort();

  var original = oriArray.join('');
  var md5sum = crypto.createHash("sha1");
  md5sum.update(original);
  var scyptoString = md5sum.digest("hex");
  if(signature == scyptoString){
    console.log("Confirm and send echo back");
    res.send(echostr);
  }else {
    console.log("Failed!");

    res.send("false");
  }
});

module.exports=router;

