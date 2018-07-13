var http = require('http');
var helloworld = "";
for (var i = 0; i < 1024 * 10; i++) {
    helloworld += "a";
}
// helloworld = new Buffer(helloworld);
http.createServer(function(req, res) {
    res.writeHead(200);
    res.end(helloworld);
}).listen(8001);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
