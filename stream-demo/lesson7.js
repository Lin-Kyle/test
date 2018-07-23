const {PassThrough, Writable} = require('stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing 现在为 false。

pass.on('data', (chunk) => {
    console.log(chunk.toString());
});
pass.write('ok'); // 不会触发 'data' 事件。

console.log('稍微等待两秒钟！');
setTimeout(() => pass.resume(), 2000) // 必须调用它才会触发 'data' 事件。
