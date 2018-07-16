const fs = require('fs');

//没有就自动生成文件
const writable = fs.createWriteStream('');

console.log(writable);
