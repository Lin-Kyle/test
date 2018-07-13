var http = require('http');

let str = new Array(10*1024).join('a');

http.createServer(function(req, res) {
    res.writeHead(200);
    res.end(str);
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
