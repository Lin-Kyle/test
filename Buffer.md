# BR介绍
> 在 [ECMAScript 2015] (ES6) 引入 TypedArray 之前，JavaScript 语言没有读取或操作二进制数据流的机制。 Buffer 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流或文件系统操作等场景中处理二进制数据流。

> TypedArray 现已被添加进 ES6 中，Buffer 类以一种更优化、更适合 Node.js 用例的方式实现了 Uint8Array API。

> Buffer 类的实例类似于整数数组，但 Buffer 的大小是固定的、且在 V8 堆外分配物理内存。 Buffer 的大小在被创建时确定，且无法调整。

> Buffer 类在 Node.js 中是一个全局变量，因此无需使用 require('buffer').Buffer。

(摘自Nodejs中文API)


### ~~new Buffer(num)~~
在 Node.js v6 之前的版本中，Buffer 实例是通过 Buffer 构造函数创建的，它根据提供的参数返回不同的 Buffer。

如果是指定数值则分配一个指定大小的新建的 Buffer 对象，在 Node.js 8.0.0 之前，分配给这种 Buffer 实例的内存是没有初始化的，且可能包含敏感数据。 这种 Buffer 实例随后必须被初始化，可以使用 buf.fill(0) 或写满这个 Buffer。 虽然这种行为是为了提高性能而有意为之的，但开发经验表明，创建一个快速但未初始化的 Buffer 与创建一个慢点但更安全的 Buffer 之间需要有更明确的区分。从 Node.js 8.0.0 开始， Buffer(num) 和 new Buffer(num) 将返回一个初始化内存之后的 Buffer。

因为 new Buffer() 的行为会根据所传入的第一个参数的值的数据类型而明显地改变，所以如果应用程序没有正确地校验传给 new Buffer() 的参数、或未能正确地初始化新分配的 Buffer 的内容，就有可能在无意中为他们的代码引入安全性与可靠性问题。

为了使 Buffer 实例的创建更可靠、更不容易出错，各种 new Buffer() 构造函数已被 废弃，并由 Buffer.from()、Buffer.alloc()、和 Buffer.allocUnsafe() 方法替代。


### Buffer.alloc(size[, fill[, encoding]])
|参数|描述|
|-|-|
|size (integer) | Buffer长度|
|fill (string，Buffer，integer) | 预填充值，默认：0 |
|encoding (string) |如果 fill 是字符串，则该值是它的字符编码。 默认：'utf8' |


|支持的字符编码|描述|
|-|-|
|ascii | 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的|
|utf8 | 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8|
|utf16le | 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）|
|ucs2 | 'utf16le' 的别名|
|base64 | Base64 编码。当从字符串创建 Buffer 时，按照 RFC4648 第 5 章的规定，这种编码也将正确地接受“URL 与文件名安全字母表”|
|latin1 |  一种把 Buffer 编码成一字节编码的字符串的方式（由 IANA 定义在 RFC1345 第 63 页，用作 Latin-1 补充块与 C0/C1 控制码）|
|binary | 'latin1' 的别名|
|hex | 将每个字节编码为两个十六进制字符|

分配一个大小为 size 字节的新建的 Buffer，后期也可以通过BR对象的toString()转换编码。
注意：
1，8.2.0新增buffer.constants模块属性，里面有个buffer.constants.MAX_LENGTH属性，意思是单个Buffer实例允许的最大量度，在32位体系结构上，这个值是(2^30)-1 (~1GB)。 在64位体系结构上，这个值是(2^31)-1 (~2GB)，也可在buffer.kMaxLength查看该值。
2，现代浏览器遵循 WHATWG 编码标准 将 'latin1' 和 ISO-8859-1 别名为 win-1252。 这意味着当进行例如 http.get() 这样的操作时，如果返回的字符编码是 WHATWG 规范列表中的，则有可能服务器真的返回 win-1252 编码的数据，此时使用 'latin1' 字符编码可能会错误地解码数据。

如果 size 大于 buffer.constants.MAX_LENGTH 或小于 0，则抛出 [RangeError] 错误。
```
const buf = Buffer.alloc(-1);
// buffer.js:269
//     throw err;
//     ^
//
// RangeError [ERR_INVALID_OPT_VALUE]: The value "-1" is invalid for option "size"
//     at Function.alloc (buffer.js:278:3)
//     at Object.<anonymous> (C:\project\test\Buffer-demo\lesson1.js:1:82)
//     at Module._compile (internal/modules/cjs/loader.js:702:30)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:713:10)
//     at Module.load (internal/modules/cjs/loader.js:612:32)
//     at tryModuleLoad (internal/modules/cjs/loader.js:551:12)
//     at Function.Module._load (internal/modules/cjs/loader.js:543:3)
//     at Function.Module.runMain (internal/modules/cjs/loader.js:744:10)
//     at startup (internal/bootstrap/node.js:238:19)
//     at bootstrapNodeJSCore (internal/bootstrap/node.js:572:3)
```

如果 size 不是一个数值，则抛出 TypeError 错误。

```
const buf = Buffer.alloc('abc');
// buffer.js:269
//     throw err;
//     ^
//
// TypeError [ERR_INVALID_ARG_TYPE]: The "size" argument must be of type number. Received type string
//     at Function.alloc (buffer.js:278:3)
//     at Object.<anonymous> (C:\project\test\Buffer-demo\lesson1.js:1:82)
//     at Module._compile (internal/modules/cjs/loader.js:702:30)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:713:10)
//     at Module.load (internal/modules/cjs/loader.js:612:32)
//     at tryModuleLoad (internal/modules/cjs/loader.js:551:12)
//     at Function.Module._load (internal/modules/cjs/loader.js:543:3)
//     at Function.Module.runMain (internal/modules/cjs/loader.js:744:10)
//     at startup (internal/bootstrap/node.js:238:19)
//     at bootstrapNodeJSCore (internal/bootstrap/node.js:572:3)
```


### Buffer.allocUnsafe(size)
和Buffer.alloc()的区别除了没有可选项之外（可以使用fill()填充），以这种方式创建的 Buffer 实例的底层内存是未初始化的。 新创建的 Buffer 的内容是未知的，且可能包含敏感数据。而size的注意事项和Buffer.alloc()一样。

Buffer 模块会预分配一个大小为 Buffer.poolSize（默认：8192，用于决定预分配的、内部 Buffer 实例池的大小的字节数，可修改） 的内部 Buffer 实例作为快速分配池， 用于使用 Buffer.allocUnsafe() 新创建的 Buffer 实例，以及废弃的 new Buffer(size) 构造器， 仅限于当 size 小于或等于 Buffer.poolSize >> 1 （即4096，不清楚的下面会提到）。

对这个预分配的内部内存池的使用，是调用 Buffer.alloc(size, fill) 和 Buffer.allocUnsafe(size).fill(fill) 的关键区别。 具体地说，Buffer.alloc(size, fill) 永远不会使用这个内部的 Buffer 池，但如果 size 小于或等于 Buffer.poolSize 的一半， Buffer.allocUnsafe(size).fill(fill) 会使用这个内部的 Buffer 池。 当应用程序需要 Buffer.allocUnsafe() 提供额外的性能时，这个细微的区别是非常重要的。


### >> 计算符
除以2的幂函数后的最大整数值
```
console.log(10000 >> 1);
console.log(10000 >> 2);
console.log(10000 >> 3);
console.log(10000 >> 4);
// 5000
// 2500
// 1250
// 625
```


# BR 結構

## 模塊結構
BR是一個典型的JS與C++結合的模塊，性能部分用C++實現，非性能部分用JS實現。因爲屬於核心模塊，所以NS在進程啓動的時候就已經加載好了，所以無需引入直接使用。
上次說過因爲BR屬於非V8分配的堆外内存，所以非常適用於大多數場景下的大内存操作。

## BR對象
BR對象類似數組，它的元素為16進制的兩位數，即0~255的數值。
```
var str = "Buffer對象。",
    buf = new Buffer(str, 'utf-8');
console.log(buf);
//<Buffer 42 75 66 66 65 72 e5 b0 8d e8 b1 a1 e3 80 82>
```

之所以說BR對象和數組很像是因爲它們實例化方式，訪問length長度和下標訪問賦值元素都一樣。
```
var buf = new Buffer(100);
console.log(buf.length); //100
console.log(buf[0]); //0
buf[0] = 100;
console.log(buf[0]); //100
```

注意：如果賦值非整數則捨棄小數，小於 0 會逐次加 256 ，大於 255 則逐次減 256。
```
var buf = new Buffer(100);
buf[0] = 100.01;
buf[1] = -100;
buf[2] = 300;
console.log(buf[0], buf[1], buf[2]); //100 156 44
```


## BR内存分配
BR對象的内存分配是在NS的C++層面實現内存申請的，因爲處理大量的字節數據不能采用需要多少就像操作系統申請多少的方式，這可能造成大量的内存申請的系統調用，對操作系統有一定壓力。因此NS采用C++層面申請内存，JS中分配内存的策略。

为了高效使用申请的内存，NS采用了 slab 动态内存管理机制，简单来说就是一块申请好的固定大小的内存区域，有三种状态：
* full：完全分配
* parital：部分分配
* empty：没有被分配

NS以 8KB 作为界限区分大小对象，也是每个slab的大小值，在JS层面作为单位单元进行内存分配。


### 分配小对象
如果指定大小小于8KBNS会按照小对象的方式进行分配，主要使用一个局部变量 pool 作为中间处理对象，处于分配状态的slab单元都指向它。
```
var pool;
function allocPool(){
    pool = new SlowBuffer(Buffer.poolSize);
    pool.used = 0;
}
```

|----------------------------------------|
|
|----------------------------------------| 8KB的pool
|
user：0
当前slab处于empty状态，构造小BR对象的时候会去检查pool对象，如果pool没有被创建将会创建新的slab单元指向它。
```
new Buffer(1024);
if (!pool || pool.length - pool.used < this.length) allocPool();
```
同时当前BR对象的parent属性指向该slab，并记录下是从这个slab的哪个位置（offset）开始使用，slab对象也会记录自身使用了多少字节。
```
this.parent = pool;
this.offset = pool.used;
this.used = this.length;
if(pool.used & 7) pool.used = (pool.used + 8) & ~7;
```

这时候的slab状态为partial，当再次创建一个BR对象时，构造过程会判断这个slab剩余空间是否足够使用并更新分配状态，如果不够会构建新的slab，原有slab的剩余空间就被浪费了。

例如分别构建1个字节和8192字节
```
new Buffer(1);//剩余8191字节被浪费了
new Buffer(8192);
```
除非slab上的BR对象都被释放且可回收，否则即使只有一个字节实际上可能占据8KB内存。


### 分配大对象
创建超过8KB的BR对象将会直接分配一个 SR对象 作为slab单元而且是被独占。
```
// Big buffer, just alloc one
this.parent = new SlowBuffer(this.length);
this.offset = 0;
```
 SR类是C++定义的，虽然buffer模块可以访问，但是不建议直接操作，而是使用BR替代。

 BR对象是JS层面的，能够被V8垃圾回收标记，但是内部的parent属性指向的SR对象却来自NS自身C++中的定义，是C++层面的BR对象，所用内存不在V8堆中。

###小结
JS层面只是提供给使用BR对象，真正的内存还是NS的C++层面提供。
分配小BR对象是采用slab的机制进行预先申请和事后分配。
分配大BR对象是直接由C++层面提供的独享内存。
