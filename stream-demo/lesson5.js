const fs = require('fs');

//没有就自动生成文件
const path = './lesson5.txt',
    options = {},
    writable = fs.createWriteStream(path, options);

writable.on('close', () => console.log('你看看同目录的lesson5.txt是不是写了点什么？'))

//写死结束
writable.cork();
writable.write('我就随便写点什么吧！你就随便看看吧！');
process.nextTick(() => {
    writable.uncork();
    writable.end();
});
