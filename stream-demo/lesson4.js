const fs = require('fs');

//没有就自动生成文件
const path = './lesson4.txt',
    options = {},
    writable = fs.createWriteStream(path, options);


//监听事件
writable.on('error', (err) => console.log(err))

//摧毁
writable.destroy('辣手摧花');
