const fs = require('fs');

let rs = fs.createReadStream('test.txt', {highWaterMark: 11}),
    data = '';

rs.setEncoding('utf8');
rs.on("data", function(chunk) {
    data += chunk;
});
rs.on("end", function() {
    console.log(data);
});
