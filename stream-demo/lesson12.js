const {pipeline} = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// 使用 pipeline API 轻松连接多个流
// 并在管道完成时获得通知

// 使用pipeline高效压缩一个可能很大的tar文件：

pipeline(fs.createReadStream('archive.tar'), zlib.createGzip(), fs.createWriteStream('archive.tar.gz'), (err) => {
    if (err) {
        console.error('管道架设失败', err);
    } else {
        console.log('管道架设成功');
    }
});
