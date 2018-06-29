const EventEmitter = require('events');
const fs = require("fs");

//創建類
class MyEmitter extends EventEmitter {}
//實例化
const myEmitter = new MyEmitter();
//監聽
myEmitter.on('data1', (file) => {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }
        console.log("第一次异步读取: " + data.toString());
        myEmitter.emit('data2', data.toString().trim());
    });
}).on('data2', (file) => {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }
        console.log("第二次异步读取: " + data.toString());
        myEmitter.emit('data3', data.toString().trim());
    });
}).on('data3', (file) => {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }
        console.log("第三次异步读取: " + data.toString());
    });
}).on('error', (err) => {
    console.log('有错误');
});

//觸發
myEmitter.emit('data1', 'data1.txt');
