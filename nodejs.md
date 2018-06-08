#前言
終於開始我nodejs的博客生涯了,先從基本的原理講起.

#什麽是nodejs?
用官網的説法就是:
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
Node.js 的包管理器 npm，是全球最大的开源库生态系统。
一三我就跳過不講了,那是外部條件因素,我們集中精力瞭解第二條.


#什麽是非阻塞式 I/O?
爲了更加全面講解這個點,我們可以把I/O都列出來,分別是:
当进程调用一个进行I/O操作的API請求时（例如讀寫操作）
* 阻塞I/O(blocking I/O): 在結果沒有返回之前會阻塞著進程/线程執行其他操作,直到得到結果爲止才結束阻塞狀態;

* 非阻塞I/O(non-blocking I/O): 不等待結果就立即返回讓進程/线程繼續執行其他操作,想要知道請求結果完成的方法
1) 輪詢;
2) I/O多路復用;

>摘抄自<<深入淺出nodejs>>
操作系統對計算機進行了抽象,將所有輸入輸出設備抽象為文件.内核在進行文件I/O操作時,通過文件描述符進行管理,而文件描述符類似於應用程序與系統内核之間的憑證.應用程序如果需要進行I/O調用,需要先打開文件描述符,然後再根據文件描述符去實現文件的數據讀寫.此處[color=#ff4753]非阻塞I/O與阻塞I/O的區別在於阻塞I/O完成整個獲取數據的過程,而非阻塞I/O則不帶數據直接返回,要獲取數據,還需要通過文件描述符再次讀取.[/color]

当進程/线程发起I/O操作之后:
* 同步I/O(synchronous I/O): 将process阻塞等待I/O操作的完成或数据的返回。按照这个定义，之前所述的阻塞I/O，非阻塞I/O，I/O多路復用都属于同步I/O。

* 异步I/O(synchronous I/O): 直接返回继续执行下一条语句，当操作系统完成IO操作时，以事件的形式通知执行IO操作的進程/线程.

例如有兩段I/O代碼執行分別需時a和b:
同步執行需時: a+b;
異步執行需時: Math.max(a,b);
這就是爲什麽異步I/O是nodejs的主要理念,因爲I/O代價非常昂貴.

簡單總結:
**阻塞I/O和非阻塞I/O区别在于：调用后是否立即返回！**
**同步I/O和异步I/O区别在于：會不會将process阻塞！**

用個生活化的例子就是等外賣吧
阻塞I/O: 白領A下完單就守著前臺小姐直到收到外賣才離開,後面其他人在排隊等他走開;
非阻塞I/O: 白領B下完單每隔一段時間就去詢問前臺小姐外賣到了沒,然後回去上班,需要來回走多次;
异步I/O: 白領C下完單就不管,直到前臺小姐告訴他外賣到了;


#nodejs的異步I/O實現
四個共同構成Node異步I/O模型的基本要素:

##事件循環
進程啓動之後node就會創建一個循環,每執行一次循環體的過程稱爲Tick.每個Tick的過程就是看是否有事件待處理,有就取出事件及其相關回調執行,然後再重複Tick,否則退出進程.

##觀察者
每個事件循環中有一個或多個的觀察者,通過詢問這些觀察者就能得知是否有事件需要進行處理.
瀏覽器中的事件可能來源於界面的交互或者文件加載而產生,而Node主要來源於網絡請求,文件I/O等,這些產生的事件都有對應的觀察者

##請求對象
對於Node中異步I/O調用,從發起調用到内核執行完I/O操作的過渡過程中存在一種中間產物請求對象.
在Javascript層面代碼會調用C++核心模塊,核心模塊會調用内建模塊通過libuv進行系統調用.創建一個請求對象并將入參和當前方法等所有狀態都封裝在請求對象,包括送入綫程池等待執行以及I/O操作完畢之後的回調處理.然後被推入綫程池等待執行,Javascript調用至此返回繼續執行當前任務的後續操作,第一階段完成.


##執行回調
綫程池中的I/O操作調用完成之後會保存結果然後向IOCP提交執行狀態告知當前對象操作完成并將綫程歸還綫程池.中間還動用到事件循環的觀察者,每次Tick都會檢查綫程池是否有執行完的請求,有就將請求對象加入到I/O觀察者的隊列中當作事件處理.至此整個異步I/O流程結束.

#事件驱动
一种通过监听事件或状态的变化而执行回调函数的流程控制方法,一般步骤
1、确定响应事件的元素;
2、为指定元素确定需要响应的事件类型;
3、为指定元素的指定事件编写相应的事件处理程序;
4、将事件处理程序绑定到指定元素的指定事件;



#nodejs事件循環
當nodejs開始運行的時候會初始化事件循環,處理所提供的輸入腳本(或者放置進REPL,暫時不懂什麼東西??),進行異步API調用.定時器調度,或者process.nextTick(),然後開始處理事件循環的流程.
下面來自官網的炫酷流程代碼示意圖
┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
└───────────────────────────┘
注意: 每個框都被稱為事件循環的一個流程階段.

每個階段都有一個FIFO(先進先出)執行回調函數的隊列,然而每個階段都有其獨特之處.通常當事件循環進入到給定階段會執行特定于該階段的所有操作.然後執行該階段隊列的回調事件直到隊列耗盡或者超過最大執行限度為止,然後事件循環就會走向下一階段,以此類推.

因為這些操作可能會調度更多的操作並且在poll階段中新的處理事件會經由內核排序,即處理poll事件時候可以對poll事件排序,因此,長時間運行回調事件會讓poll階段運行時間超過定時器的閾值.

##階段綜述:
* timers(定時器): 這階段執行setTimeout和setInterval調度的回調;
* pending callbacks(等待回調): 推遲到下一次循環迭代執行I/O回調;
* idle,prepare(閒置,準備): 只能內部使用;
* poll(輪詢): 檢索新的I/O事件;執行I/O相關回調(幾乎是關閉回調,定時器調度,和setImmediate()),當運行時候node會適當地佔用阻塞;
* check(檢測): setImmediate()回調就在這執行;
* close callbacks(關閉回調): 一些關閉回調,例如socket.on('close', ...),

在事件循環的每次運行過程中,nodejs會檢測是否有任何待處理的異步I/O或者定時器,沒有的話就徹底清除關閉.



##Timers(定时器)
在定时器設定了一個閾值之後,被提供的回調函數實際執行時間可能不是開發者想要它被執行的時間,定時器回調會在指定閾值過去后盡可能早的運行,然而操作系統調度或者其他回調運行都可能會導致延遲.



##pending callbacks(等待回調)
這階段會執行一些系統操作回調像TCP錯誤類型,例如當一個TCP socket想要連接的時候接收到ECONNREFUSED,一些*nix系統會等待錯誤報文,這會被排在pending callbacks 階段執行.

##poll(輪詢)
這階段有兩個主要功能:
1, 計算I/O應該阻塞輪詢的時間;
2, 處理poll隊列事件;

當事件循環進入poll階段,並且沒有timers調度,會發生其中一種情況:
1, 如果poll隊列不為空,事件循環會迭代回調隊列同步執行它們直到隊列耗盡或者到達系統限制;
2, 如果poll隊列為空,一件或者多件情況會發生:
1) 如果setImmediate()腳本已經被調度,事件循環的poll階段完成然後繼續到check階段去執行那裡的調度腳本;
2) 如果setImmediate()腳本還沒被調度,事件循環會等待回調被添加到隊列,然後立即執行.

一旦poll隊列清空了事件循環會檢測有沒有定時器閾值是否到達,如果一個或多個定時器已經準備好,事件循環會繞回到timers階段去執行它們的定時器回調函數.

##check(檢測)
這階段允許開發者在poll階段完成之後立即執行回調函數,如果poll階段在閒置中和腳本已經被setImmediate()排序,事件循環可能會跳到check階段而不是等待.

setImmediate()實際上是一個特殊的定時器,它會在事件循環的單獨階段運行.通過libuvAPI在poll階段完成之後調度回調去執行.

一般來說,當代碼執行完,事件循環最終會到達poll階段去等待即將到來的連接,請求等等.然而,如果一個回調函數被setImmediate()調度並且poll階段是閒置狀態,它會結束並且跳到check階段而不是在等待poll事件.


##close callbacks(關閉回調)
如果一個socket或handle突然被關閉(例如socket.destroy()),'關閉'事件會在這階段被觸發,否則會通過process.nextTick()被觸發.







Node.js 中的计时器函数实现使用了一个與瀏覽器類似但不同的内部实现，它是基于 Node.js 事件循环构建的。

##瀏覽器定時器
###setTimeout(callback,delay,lang) ：
在指定的毫秒数后调用函数或计算表达式。
参数	描述
callback	必需。要调用的函数后要执行的 JavaScript 代码串。
delay	必需。在执行代码前需等待的毫秒数。
lang	可选。脚本语言可以是：JScript | VBScript | JavaScript

###setInterval(callback,delay,lang) ：
按照指定的周期（以毫秒计）来调用函数或计算表达式。方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。
参数	描述
callback	必需。要调用的函数或要执行的代码串。
delay	必须。周期性执行或调用 callback 之间的时间间隔，以毫秒计。
lang	可选。 JScript | VBScript | JavaScript


##nodejs定時器
###setTimeout(callback, delay[, ...args])
预定在 delay 毫秒之后执行的单次 callback。 返回一个用于 clearTimeout() 的 Timeout。
callback 可能不会精确地在 delay 毫秒被调用。 Node.js 不能保证回调被触发的确切时间，也不能保证它们的顺序。 回调会在尽可能接近所指定的时间上调用。
当 delay 大于 2147483647 或小于 1 时，delay 会被设为 1。
callback <Function> 当定时器到点时要调用的函数。
delay <number> 调用 callback 之前要等待的毫秒数。
...args <any> 当调用 callback 时要传入的可选参数。
此外還增加一些方法timeout.ref(),timeout.unref()等,請自行查看.


###setInterval(callback, delay[, ...args])
预定每隔 delay 毫秒重复执行的 callback。 返回一个用于 clearInterval() 的 Timeout。

当 delay 大于 2147483647 或小于 1 时，delay 会被设为 1。
callback <Function> 当定时器到点时要调用的函数。
delay <number> 调用 callback 之前要等待的毫秒数。
...args <any> 当调用 callback 时要传入的可选参数。

此外還增加一些方法timeout.ref(),timeout.refresh(),timeout.unref()等,請自行查看.

###setImmediate(callback[, ...args])
预定立即执行的 callback，它是在 I/O 事件的回调之后被触发。 返回一个用于 clearImmediate() 的 Immediate。
当多次调用 setImmediate() 时，callback 函数会按照它们被创建的顺序依次执行。 每次事件循环迭代都会处理整个回调队列。 如果一个立即定时器是被一个正在执行的回调排入队列的，则该定时器直到下一次事件循环迭代才会被触发。
callback <Function> 在 Node.js 事件循环的当前回合结束时要调用的函数。
...args <any> 当调用 callback 时要传入的可选参数。

對應的清除方法clearImmediate(),此外還增加一些方法setImmediate.ref(),setImmediate.unref()等,請自行查看.

###nodejs新增
process.nextTick() 会在所有 setImmedate() 设定的回调和所有I/O之前执行且不可清除
setImmediate() I/O 本次事件循环的所有I/O操作之后, 且在下次事件循环的所有定时器之前执行

###promise寫法
可用util.promisify()提供的promises常用变体

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




##process.nextTick(callback[, ...args])
将 callback 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在next tick队列中的所有callbacks会被依次调用。但是不同于上面的定时器.在内部的处理机制不同,nextTick拥有比延时更多的特性.
注意： 每次事件轮询后，在额外的I/O执行前，next tick队列都会优先执行。 递归调用nextTick callbacks 会阻塞任何I/O操作，就像一个while(true); 循环一样。
