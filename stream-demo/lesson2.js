const fs = require('fs');

//没有就自动生成文件
const path = './lesson2.txt',
    options = {},
    writable = fs.createWriteStream(path, options);

//写死结束
write('我就随便写点什么吧！', () => {
    console.log('write completed, do more writes now');
});
writable.end();

//做简单判断，写入失败推到下一个
function write(data, cb) {
    if (!writable.write(data)) {
        //监听事件
        writable.once('drain', cb);
    } else {
        process.nextTick(cb);
    }
}
