function Person() {
    process.nextTick(() => {
        console.log('綁定事件處理器');
    });
    this.read = function() {
        console.log('讀取文件!');
    }
}

var man = new Person();
man.read();
