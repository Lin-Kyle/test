const EventEmitter = require('events');
//創建類
class MyEmitter extends EventEmitter {}
//實例化
const myEmitter = new MyEmitter();
//監聽
myEmitter.on('event', () => {
    console.log('1');
});
//監聽
myEmitter.on('event', () => {
    setImmediate(() => {
        console.log('2');
    });
});
//監聽
myEmitter.on('event', () => {
    console.log('3');
});
//觸發
myEmitter.emit('event');
