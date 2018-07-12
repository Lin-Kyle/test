var http = require('http');

let str = '',
    i = 0,
    len = 10 * 1024;

for (; i < len; i++) str += i;
// str =  Buffer.from(str);
http.createServer(function(req, res) {
    res.writeHead(200);
    res.end(str);
}).listen(3000);
