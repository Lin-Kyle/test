const fs = require('fs');

//没有就自动生成文件
const path = './lesson3.txt',
    options = {},
    writable = fs.createWriteStream(path, options);


//监听事件
writable.on('error', () => console.log('在调用了 stream.end() 方法之后不能再调用 stream.write() 方法'))

//写死结束
writable.end('我就随便写点什么吧！', null, () => console.log('你可以看看lesson3.txt写了什么了'));
writable.write('你就随便看看吧！');
