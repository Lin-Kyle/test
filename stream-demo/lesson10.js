const fs = require('fs');

//没有就自动生成文件
const readable = fs.createReadStream('test.txt');

console.log(readable.readableHighWaterMark, readable.readableLength);
//65536 0
