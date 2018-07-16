const fs = require('fs');

//没有就自动生成文件
const path = './lesson1.txt',
    options = {},
    writable = fs.createWriteStream(path, options);

//监听事件
writable.on('open', () => console.log('open'))
writable.on('ready', () => console.log('ready'))
writable.on('finish', () => console.log('finish'))
writable.on('close', () => console.log('close'))
writable.on('error', () => console.log('error'))

//写死结束
writable.write('我就随便写点什么吧！');
writable.write('你就随便看看吧！');
writable.end();
