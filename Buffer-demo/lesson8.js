const fs = require('fs'),
    iconv = require('iconv-lite');

let rs = fs.createReadStream('test.txt', {highWaterMark: 11}),
    chunks = [],
    size = 0;

rs.on("data", function(chunk) {
    chunks.push(chunk);
    size += chunk.length;
});
rs.on("end", function() {
    const buf = Buffer.concat(chunks, size),
        str = iconv.decode(buf, 'utf8');
    console.log(str);
});
