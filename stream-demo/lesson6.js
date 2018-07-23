const fs = require('fs');

//没有就自动生成文件
const writable = fs.createWriteStream('lesson5.txt');

console.log(writable.writableHighWaterMark, writable.writableLength);
