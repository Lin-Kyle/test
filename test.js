//继承自 Uint8Array
class FastBuffer extends Uint8Array {}
//原型指向 Buffer
FastBuffer.prototype.constructor = Buffer;

//Buffer原型指向FastBuffer原型
Buffer.prototype = FastBuffer.prototype;

console.log(Buffer.prototype === FastBuffer.prototype);
