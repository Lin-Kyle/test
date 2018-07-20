const fs = require('fs');

//没有就自动生成文件
const path = './test.txt',
    options = {},
    readable = fs.createReadStream(path, options);

//监听事件
readable.on('error', (err) => console.log(err))

//摧毁
readable.destroy('辣手摧花');
