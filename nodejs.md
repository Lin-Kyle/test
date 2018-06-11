#前言
终於开始我nodejs的博客生涯了,先从基本的原理讲起.
([color=#757575]更详细内容请看大神阮一峰的[SSL/TLS协议运行机制的概述](http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html),下文也会讲解握手内容[/color])
([color=#757575]更多内容请自行查阅,本节到此为止了.[/color])

#什么是nodejs?
用官网的説法就是:
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
Node.js 的包管理器 npm，是全球最大的开源库生态系统。
一三我就跳过不讲了,那是外部条件因素,我们集中精力瞭解第二条.



#事件驱动
事件是一种通过监听事件或状态的变化而执行回调函数的流程控制方法,一般步骤
1、确定响应事件的元素;
2、为指定元素确定需要响应的事件类型;
3、为指定元素的指定事件编写相应的事件处理程序;
4、将事件处理程序绑定到指定元素的指定事件;

我们就以每个入门必学的创建服务器為例子
```javascript
http.createServer((req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk)
    req.on('end', () => { res.end(data) })
}).listen(8080)
```

所谓的事件驱动就是nodejs里有个事件队列,每个进来的请求都会被推进队列,通过一种循环方式检测队列事件有没变化,有就执行相对应的回调函数,没有就跳过到下一步,如此往復.更加详细内容下面会讲到.



#什么是非阻塞式 I/O?
I/O是指磁盘文件系统或者数据库的写入和读出,其中听到一些名词像异步,非阻塞,同步,阻塞之间好像是同一回事,实际效果而言又好像真的就是同一回事,但是从计算机内核I/O来説真不是同一回事,为了更加全面讲解这个点,我们可以把它们都列出来,分别是:

* 阻塞I/O(blocking I/O): [color=#ff4753]在I/O操作的完成或数据的返回之前会阻塞著进程执行其他操作,直到得到结果为止[/color];
	例子: 调用一个进行I/O操作的API请求时（如读写操作）,一定要等待系统内核层面完成所有操作如磁盘寻道,读取数据,复製数据到内存等等;
    缺点: 阻塞造成CPU无谓的等待没法充分应用;

* 非阻塞I/O(non-blocking I/O): [color=#ff4753]不等待I/O操作的完成或数据的返回就立即返回让进程继续执行其他操作[/color];
	例子: 调用一个进行I/O操作的API请求时（如读写操作）,不等待系统内核层面完成所有操作如磁盘寻道,读取数据,复製数据到内存等等就返回;
    优点: 提高性能减少等待时间;
    缺点: 返回的仅仅是当前调用状态,想要获取完整数据需要重复去请求判断操作是否完成造成CPU损耗,基本方法就是轮询;



>摘抄自<<深入浅出nodejs>>
操作系统对计算机进行了抽象,将所有输入输出设备抽象為文件.内核在进行文件I/O操作时,通过文件描述符进行管理,而文件描述符类似於应用程序与系统内核之间的凭证.应用程序如果需要进行I/O调用,需要先打开文件描述符,然后再根据文件描述符去实现文件的数据读写.此处[color=#ff4753]非阻塞I/O与阻塞I/O的区别在於阻塞I/O完成整个获取数据的过程,而非阻塞I/O则不带数据直接返回,要获取数据,还需要通过文件描述符再次读取.[/color]

* I/O多路復用;[color=#999]\(不是这章内容,先不讲)[/color]

* 同步I/O(synchronous I/O): [color=#ff4753]将进程阻塞等待I/O操作的完成或数据的返回。按照这个定义，之前所述的阻塞I/O，非阻塞I/O，I/O多路復用都属于同步I/O。[/color]
	例子: 上面讲的不管是等待完成所有操作还是通过轮询等方式获取操作结果,其实都是会阻塞著进程,区别无非是中间等待时间怎么分配;
    优点: 编写执行顺序一目瞭然;
    缺点: 阻塞造成CPU无谓的等待或多餘的查询,没法充分应用;

* 异步I/O(synchronous I/O): [color=#ff4753]直接返回继续执行下一条语句，当I/O操作完成或数据返回时，以事件的形式通知执行IO操作的进程.[/color]
    优点: 提高性能无需等待或查询,会有通知信息;
    缺点: 代码閲读和流程控制较为复杂;


![图片描述](attimg://article/content/picture/201806/10/201330joo24omtpdtc56tt.jpg)
[color=#b1b1b1]\(这里原本想直接过,但是相似性太高容易模糊就打算画图,因为太多又懒得话想去百度找张图,然后找不齐,最终在一个文章找到一个更加清晰明瞭的示意图,很无耻又不失礼貌的借用了)[/color]
[IO - 同步，异步，阻塞，非阻塞 （亡羊补牢篇）](https://blog.csdn.net/historyasamirror/article/details/5778378)

简单总结:
**阻塞I/O和非阻塞I/O区别在于：调用后是否立即返回！**
**同步I/O和异步I/O区别在于：会不会将进程阻塞！**

用个生活化的例子就是等外卖吧
阻塞I/O: 白领A下完单就守著前臺小姐直到收到外卖才离开,后面其他人在排队等他走开;
非阻塞I/O: 白领B下完单每隔一段时间就去询问前臺小姐外卖到了没,然后回去上班,需要来回走多次;
异步I/O: 白领C下完单就不管,直到前臺小姐告诉他外卖到了;


#为什么Nodejs这么推崇非阻塞异步I/O?
##用户体验
我们都知道Javascript在瀏览器中是单綫程执行,JS引擎线程和GUI渲染线程是互斥的,如果你用同步方式加载资源的时候UI停止渲染,也不能进行交互,你猜用户会干嘛?而使用异步加载的话就没这问题了,这不仅仅是阻塞期间的体验问题,还是加载时间的问题.
>例如有两段I/O代码执行分别需时a和b,一般:
同步执行需时: a+b;
异步执行需时: Math.max(a,b);

这就是为什么异步非阻塞I/O是nodejs的主要理念,因为I/O代价非常昂贵.

##资源分配
主流方法有两种:

###单綫程串行依次执行
优点: 编写执行顺序一目瞭然;
缺点: 无法充分利用多核CPU;

###多綫程并行处理
优点: 有效利用多核CPU;
缺点: 创建/切换綫程开销大,还有锁,状态同步等繁杂问题;

###Nodejs方案:单綫程事件驱动、非阻塞式 I/O
优点: 免去锁,状态同步等繁杂问题,又能提高CPU利用率;



#nodejs的异步I/O实现
四个共同构成Node异步I/O模型的基本要素:[color=#ff4753]事件循环, 观察者, 请求对象, 执行回调.[/color]
[color=#b1b1b1]\(因为涉及到底层语言和系统实现不同,我衹能根据内容简单説説过程,再多无能为力了)[/color]

##事件循环
进程启动之后node就会创建一个循环,每执行一次循环体的过程称为Tick.每个Tick的过程就是看是否有事件待处理,有就取出事件及其相关回调执行,然后再重复Tick,否则退出进程.
![图片描述](attimg://article/content/picture/201806/10/204209st6ma29l53xf9lpp.jpg)
[color=#b1b1b1]\(百度找到<<深入浅出nodejs>>书本里的示意图)[/color]

##观察者
每个事件循环中有一个或多个的观察者,通过询问这些观察者就能得知是否有事件需要进行处理.
瀏览器中的事件可能来源於界面的交互或者文件加载而產生,而Node主要来源於网络请求,文件I/O等,这些產生的事件都有对应的观察者.
[color=#b1b1b1]\(window下基於IOCP创建,*nix基於多綫程创建)[/color]

##请求对象
对於Node中异步I/O调用,从发起调用到内核执行完I/O操作的过渡过程中存在一种中间產物请求对象.
在Javascript层面代码会调用C++核心模块,核心模块会调用内建模块通过libuv进行系统调用.创建一个请求对象并将入参和当前方法等所有状态都封装在请求对象,包括送入綫程池等待执行以及I/O操作完毕之后的回调处理.然后被推入綫程池等待执行,Javascript调用至此返回继续执行当前任务的后续操作,第一阶段完成.
![图片描述](attimg://article/content/picture/201806/10/204412gxmlglifjl9iio8a.jpg)
[color=#b1b1b1]\(百度找到<<深入浅出nodejs>>书本里的示意图)[/color]


##执行回调
綫程池中的I/O操作调用完成之后会保存结果然后向IOCP[color=#b1b1b1]\(还记得上面说window下基於IOCP创建么)[/color]提交执行状态告知当前对象操作完成并将綫程归还綫程池.中间还动用到事件循环的观察者,每次Tick都会调用IOCP相关的方法检查綫程池是否有执行完的请求,有就将请求对象加入到I/O观察者的队列中当作事件处理.至此整个异步I/O流程结束.完整流程如下
![图片描述](attimg://article/content/picture/201806/10/204855x33g313fgukknjlj.jpg)
[color=#b1b1b1]\(百度找到<<深入浅出nodejs>>书本里的示意图)[/color]




#Nodejs事件循环详解
基本来自[The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/),可以説这部分我就是翻译功能,部分翻译太绕口会和谐一下,基本忠於原文.

当nodejs开始运行的时候会初始化事件循环,处理所提供的输入脚本[color=#b1b1b1]\(或者放置进REPL,暂时不懂什麼东西??)[/color],可能会进行异步API调用.定时器调度,或者process.nextTick(),然后开始处理事件循环的流程.

下面来自官网的炫酷流程代码示意图[color=#b1b1b1]\(官网直接用符号拼凑出来,这里因为编辑器问题衹能截图)[/color]
![图片描述](attimg://article/content/picture/201806/11/200314nu3gudgudvzv2v2z.png)
[color=#ff4753]注意: 每个框都被称為事件循环的一个流程阶段.[/color]

每个阶段都有一个FIFO(先进先出)执行回调函数的队列,然而每个阶段都有其独特之处.通常当事件循环进入到给定阶段会执行特定于该阶段的所有操作.然后执行该阶段队列的回调事件直到队列耗尽或者超过最大执行限度為止,然后事件循环就会走向下一阶段,以此类推.

因為这些操作可能会调度更多的操作并且在poll阶段中新的处理事件会加入到内核的队列,即处理轮询事件时候又加入新的轮询事件,因此,长时间运行回调事件会让poll阶段运行时间超过定时器的閾值.

##阶段综述:
* timers(定时器): 这阶段执行setTimeout和setInterval调度的回调;
* pending callbacks(等待回调): 推迟到下一次循环迭代执行I/O回调;
* idle,prepare(閒置,準备): 只能内部使用;
* poll(轮询): 检索新的I/O事件;执行I/O相关回调(几乎是关闭回调,定时器调度,和setImmediate()),当运行时候nodejs会适当地佔用阻塞;
* check(检测): setImmediate()回调就在这执行;
* close callbacks(关闭回调): 一些关闭回调,例如socket.on('close', ...),

在事件循环的每次运行过程中,nodejs会检测是否有任何待处理的异步I/O或者定时器,没有的话就彻底清除关闭.



##Timers(定时器)
在定时器设定了一个閾值之后,被提供的回调函数实际执行时间可能不是开发者想要它被执行的时间,定时器回调会在指定閾值过去后尽可能早的运行,然而操作系统调度或者其他回调运行都可能会导致延迟.
[color=#ff4753]注意: 为了防止轮询阶段持续时间太长，libuv 会根据操作系统的不同设置一个轮询的上限。(這就是爲什麽上面會説执行该阶段队列的回调事件直到队列耗尽或者超过最大执行限度為止)[/color]
[color=#b1b1b1]\(下面会单独详细讲解定时器的東西)[/color]



##pending callbacks(等待回调)
这阶段会执行一些系统操作回调像TCP错误类型,例如当一个TCP socket想要连接的时候接收到ECONNREFUSED,一些*nix系统会等待错误报文,这会被排在pending callbacks 阶段执行.

##poll(轮询)
这阶段有两个主要功能:
1, 计算I/O应该阻塞和轮询的时间;
2, 处理poll队列事件;

当事件循环进入poll阶段,并且没有timers调度,会发生其中一种情况:
1, 如果poll队列不為空,事件循环会迭代回调队列同步执行它们直到队列耗尽或者到达系统限制;
2, 如果poll队列為空,一件或者多件情况会发生:
  1) 如果setImmediate()脚本已经被调度,事件循环的poll阶段完成然后继续到check阶段去执行那裡的调度脚本;
  2) 如果setImmediate()脚本还没被调度,事件循环会等待回调被添加到队列,然后立即执行.

一旦poll队列清空了事件循环会检测有没有定时器閾值是否到达,如果一个或多个定时器已经準备好,事件循环会绕回到timers阶段去执行它们的定时器回调函数.

##check(检测)
这阶段允许开发者在poll阶段完成之后立即执行回调函数,如果poll阶段在閒置中并且脚本已经被setImmediate()加入队列,事件循环会跳到check阶段而不是等待.

setImmediate()实际上是一个特殊的定时器,它会在事件循环的单独阶段运行.通过libuv API在poll阶段完成之后调度回调去执行.

一般来说,当代码执行完,事件循环最终会到达poll阶段去等待即将到来的连接,请求等等.然而,如果一个回调函数被setImmediate()调度并且poll阶段是閒置状态,它会结束并且跳到check阶段而不是在等待轮询事件.


##close callbacks(关闭回调)
如果一个socket或handle突然被关闭(例如socket.destroy()),'关闭'事件会在这阶段被触发,否则会通过process.nextTick()被触发.


##非异步API(强势插楼)
事件循环阶段部分已经讲完了,剩下的是定时器之间区别部分,在那之前我想在这里补充一下定时器知识!

[color=#ff4753]Node.js 中的计时器函数实现使用了一个与瀏览器类似但不同的内部实现，它是基于 Node.js 事件循环构建的。[/color]

##瀏览器定时器
###setTimeout(callback,delay,lang) ：
在指定的毫秒数后调用函数或计算表达式,返回一个用于 clearTimeout() 的Timeout或窗口被关闭。
|参数|描述|
|-|-|
| callback| 必需。要调用的函数后要执行的 JavaScript 代码串。|
| delay| 必需。在执行代码前需等待的毫秒数。|
| lang| 可选。脚本语言可以是：JScript | VBScript | JavaScript|



###setInterval(callback,delay,lang) ：
按照指定的周期（以毫秒计）来调用函数或计算表达式。方法会不停地调用函数，返回一个用于 clearInterval() 的Timeout或窗口被关闭。
参数请看上面setTimeout.

##nodejs定时器
###setTimeout(callback, delay[, ...args])
在指定的毫秒数后调用函数或计算表达式,返回一个用于 clearTimeout() 的Timeout或窗口被关闭。
|参数|描述|
|-|-|
| callback| 必需。要调用的函数后要执行的 JavaScript 代码串。|
| delay| 必需。在执行代码前需等待的毫秒数。当 delay 大于 2147483647 或小于 1 时，delay 会被设为 1。|
| ...args| 可选, 当调用 callback 时要传入的可选参数。|
此外还增加一些方法timeout.ref(),timeout.unref()等,请自行查看.[Timeout 类](http://nodejs.cn/api/timers.html#timers_class_timeout)


###setInterval(callback, delay[, ...args])
按照指定的周期（以毫秒计）来调用函数或计算表达式。方法会不停地调用函数，返回一个用于 clearInterval() 的Timeout或窗口被关闭。
参数请看上面setTimeout.


###setImmediate(callback[, ...args])
预定立即执行的 callback，它是[color=#ff4753]在 I/O 事件的回调之后被触发[/color]。 返回一个用于 clearImmediate() 的 Immediate。
[color=#ff4753]当多次调用 setImmediate() 时，callback 函数会按照它们被创建的顺序依次执行。 每次事件循环迭代都会处理整个回调队列。 如果一个即时定时器是被一个正在执行的回调排入队列的，则该定时器直到下一次事件循环迭代才会被触发。[/color]
|参数|描述|
|-|-|
| callback| 在 Node.js 事件循环的当前回合结束时要调用的函数。|
| ...args| 可选, 当调用 callback 时要传入的可选参数。|

对应的清除方法clearImmediate(),此外还增加一些方法setImmediate.ref(),setImmediate.unref()等,请自行查看.[Immediate 类](http://nodejs.cn/api/timers.html#timers_class_immediate)



##promise写法(题外话)
可用util.promisify()提供的promises常用变体

```javascript
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout),
        setImmediatePromise = util.promisify(setImmediate);

setTimeoutPromise(40, 'foobar').then((value) => {
  // value === 'foobar' (passing values is optional)
  // This is executed after about 40 milliseconds.
});

setImmediatePromise('foobar').then((value) => {
  // value === 'foobar' (passing values is optional)
  // This is executed after all I/O callbacks.
});

// or with async function
async function timerExample() {
  console.log('Before I/O callbacks');
  await setImmediatePromise();
  console.log('After I/O callbacks');
}
timerExample()
```


##[process.nextTick(callback[, ...args])](http://nodejs.cn/api/process.html#process_process_nexttick_callback_args)
将 callback 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在next tick队列中的所有callbacks会被依次调用。但是不同于上面的定时器.在内部的处理机制不同,nextTick拥有比延时更多的特性.
[color=#ff4753]注意：这不是定时器,而且递归调用nextTick callbacks 会阻塞任何I/O操作，就像一个while(true)循环一样[/color]
|参数|描述|
|-|-|
| callback| 在 Node.js 事件循环的当前回合结束时要调用的函数。|
| ...args| 可选, 当调用 callback 时要传入的可选参数。|

* 事件轮询随后的ticks 调用，会在任何I/O事件（包括定时器）之前运行。
```javascript
console.log('start');
process.nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
* 在对象构造好但还没有任何I/O发生之前，想给用户机会来指定某些事件处理器。
```javascript
function MyThing(options) {
  this.setupOptions(options);

  process.nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() gets called now, not before.
```
* 每次事件轮询后，在额外的I/O执行前，next tick队列都会优先执行。
```javascript
//使用场景
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();

//危险写法,因为不清楚foo() 或 bar() 哪个会被先调用
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}

//优化写法,每次事件轮询后，在额外的I/O执行前，next tick队列都会优先执行
function definitelyAsync(arg, cb) {
  if (arg) {
    process.nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```





##setImmediate() vs setTimeout()[color=#b1b1b1]\(继续回到文章)[/color]
setImmediate() vs setTimeout()很相似,但是行为方式的不同取决於他们调用时机.
* setImmediate()被设计為在当前poll阶段完成之后执行脚本.
* setTimeout()会在消耗一段时间閾值之后调度一段脚本去运行.
定时器被执行时候的顺序变化取决於它们被调用时候的上下文,如果都是在主模块内部被调用会受到进程性能的约束(可能被本机其他应用运行影响);

例如,如果我们不在I/O循环运行下面的脚本(也就是在主模块中),两个定时器的执行顺序是不确定的,因為它们受到进程性能的约束.
```javascript
// timeout_vs_immediate.js
setTimeout(function timeout () {
  console.log('timeout');
},0);

setImmediate(function immediate () {
  console.log('immediate');
});
```


>$ node timeout_vs_immediate.js
timeout
immediate

>$ node timeout_vs_immediate.js
immediate
timeout

可是如果你把两个代码放进I/O循环内部,immediate()回调函数总是先执行;
```javascript
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```


>$ node timeout_vs_immediate.js
immediate
timeout

>$ node timeout_vs_immediate.js
immediate
timeout

使用setImmediate()而不是setTimeout()的主要优势是如果在I/O循环内部调用,setImmediate()总会在所有定时器之前执行,与你定义多少个定时器无关.


##理解process.nextTick()
你可能已经注意到process.nextTick()并没有出现在图表,虽然它是异步API的一部分,那是因為process.nextTick()技术上不是事件循环部分.相反,process.nextTick()会在当前操作完成之后被处理,不管事件循环的当前阶段如何.

回顾我们的图表,在给定阶段的任何时候你调用process.nextTick(),传递给process.nextTick()的回调函数都会在事件循环继续之前被解决,这会造成一些糟糕情况因為它允许你通过执行递归process.nextTick()调用去'饿死'(starve)你的I/O,从而阻止事件循环到达poll阶段.

###為什麼会被允许?
為什麼一些像这样的内容会被包含在Nodejs?这部分是因為它是一种设计哲学,API应该总是异步即使它并不需要,看这段代码片段例子
```javascript
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(callback,
    new TypeError('argument should be string'));
}
```


这片段会检查入参,如果不正确会传递错误到回调函数,最近更新的API允许传递入参到process.nextTick(),允许他在回调后取传递的任何参数作為回调的入参,这样就不必嵌套函数了.
>这句又长又绕口,附上部分原文:
The API updated fairly recently to allow passing arguments to process.nextTick() allowing it to take any arguments passed after the callback to be propagated as the arguments to the callback so you don't have to nest functions.

我们要做的是传递一个错误给开发者但仅仅是我们已经允许开发者其餘的代码执行之后.通过使用process.nextTick()我们保证apiCall()总会在开发者其餘代码执行之后事件循环允许执行之前运行它的回调函数,為了实现这一步,JS调用堆栈允许展开立即执行所提供的回调函数,允许开发者执行递归调用process.nextTick()而不会达到引用错误: Maximum call stack size exceeded from v8.
>这句又长又绕口,附上原文:
What we're doing is passing an error back to the user but only after we have allowed the rest of the user's code to execute. By using process.nextTick() we guarantee that apiCall() always runs its callback after the rest of the user's code and before the event loop is allowed to proceed. To achieve this, the JS call stack is allowed to unwind then immediately execute the provided callback which allows a person to make recursive calls to process.nextTick() without reaching a RangeError: Maximum call stack size exceeded from v8.

这种哲学会导致一些潜在的有问题的情况,看看这段片段例子
```javascript
let bar;

// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) { callback(); }

// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
  // since someAsyncApiCall has completed, bar hasn't been assigned any value
  console.log('bar', bar); // undefined
});

bar = 1;
```


开发者定义someAsyncApiCall()有一个异步签名(signature),实际上却是同步操作,当它调用时候提供给someAsyncApiCall()的回调函数会在事件循环的相同阶段被调用因為someAsyncApiCall()实际上并没有做任何异步事情,结果回调函数试著去引用bar即使它可能还没在作用域里,因為代码不可能运行完成.

但是如果把它放进process.nextTick(),代码依旧有能力跑完,允许所有变量,函数等等在回调函数被调用之前优先初始化完,它具有不让事件循环继续的优点,在允许事件循环继续之前，提醒用户注意错误可能是有用的。

>这句又长又绕口,附上原文:
The user defines someAsyncApiCall() to have an asynchronous signature, but it actually operates synchronously. When it is called, the callback provided to someAsyncApiCall() is called in the same phase of the event loop because someAsyncApiCall() doesn't actually do anything asynchronously. As a result, the callback tries to reference bar even though it may not have that variable in scope yet, because the script has not been able to run to completion.

>By placing the callback in a process.nextTick(), the script still has the ability to run to completion, allowing all the variables, functions, etc., to be initialized prior to the callback being called. It also has the advantage of not allowing the event loop to continue. It may be useful for the user to be alerted to an error before the event loop is allowed to continue. Here is the previous example using process.nextTick():

这是上面使用process.nextTick()的例子
```javascript
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});

bar = 1;
```


这是另一个现实世界的例子:
```javascript
const server = net.createServer(() => {}).listen(8080);

server.on('listening', () => {});
```

(这句又长又绕口,不想翻了:)
When only a port is passed, the port is bound immediately. So, the 'listening' callback could be called immediately. The problem is that the .on('listening') callback will not have been set by that time.

想要避开这问题,'listening'事件会加入nextTick()队列以容许脚本运行完,这允许开发者设置任何他们想要的任何事件处理器.



##process.nextTick() vs setImmediate()
就用户而言，我们有两个类似的调用,不过他们的名字令人困惑.
process.nextTick() 在同一阶段立刻触发[color=#b1b1b1]\(原文fires: 点燃；解雇；开除；使发光；烧制；激动；放枪???)[/color]
setImmediate() 在即将到来的迭代或者事件循环的'tick'中触发[color=#b1b1b1]\(原文fires)[/color]

本质上,名字应该调换,process.nextTick()比setImmediate()更加容易触发,但这是一种不可变得的过去的产物,这种转换会在npm中破坏大量的包,每天都有很多新包被添加,意味著我们每等待一天就有更多潜在的破坏发生,即使它们多困惑也不能更改它们的名字.

我们建议开发者们在任何情况使用setImmediate()因為它容易推出(reason about？？)(它会让代码兼容更广泛的环境变量,像browser JS)


##為什麼使用process.nextTick()?
两个原因:
1, 允许开发者们处理错误,清除任何不需要的资源,或者尝试在事件循环继续之前再次发起请求.
2, 在需要的时候允许调用栈释放(unwound??)之后但事件循环继续之前运行一个回调函数.

一个符合开发者们期望的简单例子
```javascript
const server = net.createServer();
server.on('connection', (conn) => { });

server.listen(8080);
server.on('listening', () => { });
```

假设listen()在事件循环开始的时候运行，但是监听回调被放置在setImmediate()。除非传递主机名立即绑定端口，想让事件循环继续进行必须进入poll阶段，意味着有机会（a non-zero chance？？）已经接收到一个连接，允许在监听事件之前触发连接事件。
>(有段名词不懂怎么翻译:)
which means there is a non-zero chance that a connection could have been received allowing the connection event to be fired before the listening event

另一个例子是运行构造函数，从EventEmitter继承并且想要在构造函数内部调用一个事件。
```javascript
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
```


我们不能在构造函数立刻发出事件是因为脚本可能还没处理到开发者设置触发事件回调函数的位置，所以在构造函数内部本身你能使用process.nextTick()设置触发事件回调函数以在构造函数已经完成之后提供期望结果。

```javascript
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
```










#参考资源
<<深入浅出nodejs>>
[IO - 同步，异步，阻塞，非阻塞 （亡羊补牢篇）](https://blog.csdn.net/historyasamirror/article/details/5778378)
[Node.js 中文网 API](http://nodejs.cn/api/)
[The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
