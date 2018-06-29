const EventEmitter = require('events');
//創建類
class MyEmitter extends EventEmitter {}
//實例化
const myEmitter = new MyEmitter();
//監聽
myEmitter.on('event', () => {
    console.log('触发了一个事件！');
});
//觸發
myEmitter.emit('event');
