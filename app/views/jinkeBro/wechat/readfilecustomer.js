/** 
 * @Author: Duncan
 * @Date:   2016-12-30 14:33:36
 * @Last Modified by:   Duncan
 * @Last Modified time: 2016-11-12 16:30
 * @Function 读取customer.html里面的内容
 */
var fs = require('fs');
module.exports = function (res) {

    fs.readFile(__dirname + '/index.html', 'utf-8', function (err, data) {
        if (err) {
            console.log('读取文件的时候出错');
        }
        else {
            console.log('sdada');
            res.set('Content-Type', 'text/html');
            res.send(new Buffer(data));
            res.end();
        }
    })
}
