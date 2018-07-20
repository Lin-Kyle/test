const fs = require('fs');

//没有就自动生成文件
const path = './test.txt',
    options = {},
    readable = fs.createReadStream(path, options);

//监听事件
readable.on('ready', () => console.log('ready'))
readable.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
    console.log('There will be no more data.');
});
readable.on('close', () => console.log('close'))
readable.on('error', () => console.log('error'))
