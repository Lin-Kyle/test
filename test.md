##setImmediate() vs setTimeout()
setImmediate() vs setTimeout()很相似,但是行为方式的不同取決於他們調用時機.
* setImmediate()被設計為在當前poll階段完成之後執行腳本.
* setTimeout()會在消耗一段時間閾值之後調度一段腳本去運行.
定時器被執行時候的順序變化取決於它們被調用時候的上下文,如果都是在主模塊內部被調用會受到進程性能的約束(可能被本機其他應用運行影響);

例如,如果我們不在I/O循環運行下面的腳本(也就是在主模塊中),兩個定時器的執行順序是不確定的,因為它們受到進程性能的約束.
// timeout_vs_immediate.js
setTimeout(function timeout () {
  console.log('timeout');
},0);

setImmediate(function immediate () {
  console.log('immediate');
});

>$ node timeout_vs_immediate.js
timeout
immediate

>$ node timeout_vs_immediate.js
immediate
timeout

可是如果你把兩個代碼放進I/O循環內部,immediate()回調函數總是先執行;
>// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});

>$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout

使用setImmediate()而不是setTimeout()的主要優勢是如果在I/O循環內部調用,setImmediate()總會在所有定時器之前執行,與你定義多少個定時器無關.


##理解process.nextTick()
你可能已經注意到process.nextTick()並沒有出現在圖表,雖然它是異步API的一部分,那是因為process.nextTick()技術上不是事件循環部分.相反,process.nextTick()會在當前操作完成之後被處理,不管事件循環的當前階段如何.

回顧我們的圖表,在給定階段的任何時候你調用process.nextTick(),传递给process.nextTick()的回調函數都會在事件循環繼續之前被解決,這會造成一些糟糕情況因為它允許你通過執行遞歸process.nextTick()調用去'餓死'(starve)你的I/O,从而阻止事件循環到達poll階段.

###為什麼會被允許?
為什麼一些像這樣的內容會被包含在Nodejs?這部分是因為它是一種設計哲學,API應該總是異異步即使它並不需要,看這段代碼片段例子
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(callback,
    new TypeError('argument should be string'));
}

這片段會檢查入參,如果不正確會傳遞錯誤到回調函數,最近更新的API允許傳遞入參到process.nextTick(),允許他在回調后取傳遞的任何參數作為回調的入參,這樣就不必嵌套函數了.
(這句又長又繞口,附上部分原文:)
>The API updated fairly recently to allow passing arguments to process.nextTick() allowing it to take any arguments passed after the callback to be propagated as the arguments to the callback so you don't have to nest functions.

我們要做的是傳遞一個錯誤給開發者但僅僅是我們已經允許開發者其餘的代碼執行之後.通過使用process.nextTick()我們保證apiCall()總會在開發者其餘代碼執行之後事件循環允許執行之前運行它的回調函數,為了實現這一步,JS調用堆棧允許展開立即執行所提供的回調函數,允許開發者執行遞歸調用process.nextTick()而不會達到引用错误: Maximum call stack size exceeded from v8.
(這句又長又繞口,附上部分原文:)
> the JS call stack is allowed to unwind then immediately execute the provided callback which allows a person to make recursive calls to process.nextTick() without reaching a RangeError.

這種哲學會導致一些潛在的有問題的情況,看看這段片段例子
let bar;

// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) { callback(); }

// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
  // since someAsyncApiCall has completed, bar hasn't been assigned any value
  console.log('bar', bar); // undefined
});

bar = 1;

開發者定義someAsyncApiCall()有一個異步簽名(signature),實際上卻是同步操作,當它調用時候提供給someAsyncApiCall()的回調函數會在事件循環的相同階段被調用因為someAsyncApiCall()實際上并沒有做任何異步事情,結果回調函數試著去引用bar即使它可能還沒在作用域里,因為代碼不可能运行完成.

但是如果把它放進process.nextTick(),代碼依舊有能力跑完,允許所有變量,函數等等在回調函數被調用之前優先初始化完,它具有不讓事件循環繼續的優點,在允许事件循环继续之前，提醒用户注意错误可能是有用的。

（这两句真的有点奇怪，翻译不顺畅）
The user defines someAsyncApiCall() to have an asynchronous signature, but it actually operates synchronously. When it is called, the callback provided to someAsyncApiCall() is called in the same phase of the event loop because someAsyncApiCall() doesn't actually do anything asynchronously. As a result, the callback tries to reference bar even though it may not have that variable in scope yet, because the script has not been able to run to completion.

By placing the callback in a process.nextTick(), the script still has the ability to run to completion, allowing all the variables, functions, etc., to be initialized prior to the callback being called. It also has the advantage of not allowing the event loop to continue. It may be useful for the user to be alerted to an error before the event loop is allowed to continue. Here is the previous example using process.nextTick():

這是上面使用process.nextTick()的例子
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});

bar = 1;

这是另一个现实世界的例子:
const server = net.createServer(() => {}).listen(8080);

server.on('listening', () => {});
(這句又長又繞口,不想翻了:)
When only a port is passed, the port is bound immediately. So, the 'listening' callback could be called immediately. The problem is that the .on('listening') callback will not have been set by that time.

想要避開這問題,'listening'事件會加入nextTick()隊列以容許腳本運行完,這允許開發者設置任何他們想要的任何事件處理器.



##process.nextTick() vs setImmediate()
就用户而言，我们有两个类似的调用,不過他們的名字令人困惑.
process.nextTick() 在同一階段立刻觸發(原文fires: 点燃；解雇；开除；使发光；烧制；激动；放枪???)
setImmediate() 在即將到來的迭代或者事件循環的'tick'中觸發(原文fires: 点燃；解雇；开除；使发光；烧制；激动；放枪???)

本質上,名字應該調換,process.nextTick()比setImmediate()更加容易觸發,但這是一種不可變得的过去的产物,這種轉換會在npm中破壞大量的包,每天都有很多新包被添加,意味著我們每等待一天就有更多潛在的破壞發生,即使它們多困惑也不能更改它們的名字.

我們建議開發者們在任何情況使用setImmediate()因為它容易推出(reason about？？)(它會让代碼兼容更广泛的环境變量,像browser JS)


##為什麼使用process.nextTick()?
兩個原因:
1, 允許開發者們處理錯誤,清除任何不需要的資源,或者嘗試在事件循環繼續之前再次發起請求.
2, 在需要的時候允許調用棧釋放(unwound??)之後但事件循環繼續之前運行一個回調函數.

一個符合開發者們期望的簡單例子
const server = net.createServer();
server.on('connection', (conn) => { });

server.listen(8080);
server.on('listening', () => { });
假设listen()在事件循环开始的时候运行，但是监听回调被放置在setImmediate()。除非传递主机名立即绑定端口，想让事件循环继续进行必须进入poll阶段，意味着有机会（a non-zero chance？？）已经接收到一个连接，允许在监听事件之前触发连接事件。
(有段名词不懂怎么翻译:)
which means there is a non-zero chance that a connection could have been received allowing the connection event to be fired before the listening event

另一个例子是运行构造函数，从EventEmitter继承并且想要在构造函数内部调用一个事件。
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
  this.emit('event');
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});

我们不能在构造函数立刻发出事件是因为脚本可能还没处理到开发者设置触发事件回调函数的位置，所以在构造函数内部本身你能使用process.nextTick()设置触发事件回调函数以在构造函数已经完成之后提供期望结果。

const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);

  // use nextTick to emit the event once a handler is assigned
  process.nextTick(() => {
    this.emit('event');
  });
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
}); 
