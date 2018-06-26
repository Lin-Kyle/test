const EventEmitter = require('events');
//創建類
class MyEmitter extends EventEmitter {}
//實例化
const myEmitter = new MyEmitter();
//監聽
myEmitter.on('newListener', () => {
    console.log('触发了一个事件！');
});
myEmitter.on('event', () => {
  console.log('A');
});
//觸發
myEmitter.emit('event');



##EventProxy



##Promise()



##connect



##async




##step






#異步并發控制
##bagpipe
