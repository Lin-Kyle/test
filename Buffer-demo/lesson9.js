var http = require('http');

let str = new Array(10*1024).join('a');

http.createServer(function(req, res) {
    res.writeHead(200);
    res.end(str);
}).listen(3000);
console.log('已建立连接，现在可以新开一个终端运行loadtest命令测试效果。');
