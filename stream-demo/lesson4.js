const fs = require('fs');

//没有就自动生成文件
const path = './lesson4.txt',
    options = {},
    writable = fs.createWriteStream(path, options);


//监听事件
writable.on('error', () => console.log('是我干的'))

//摧毁
writable.destroy();
