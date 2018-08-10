# 前言
这篇文章实话说我有点虚，因为平时都不怎么研究这一块的，然后涉及到的知识点超多，我只能到处看看资料总结一下相关信息，所以在此我只想说句：
**本文章内容只代表个人立场，有错必改！**
原本打算一次性总结，后来越扯越多超过字数限制了，就干脆做成http系列文章了，不定时更新原有内容（发现哪里出错的话），不定时新增系列文章，请见谅!

因为之前写得太臃肿又不够详细，最近刚好复习到这一块的内容，所以决定把这些文章都拆分成更加细致一点，补充详细内容，优化排版布局，目前来看还是应该的。后续没勾选的只是还没改到那里去，可以先不看。
+ [x] [Http协议系列 — 协议原理构成与连接管理](https://www.qdfuns.com/article/40831/577fa2647a7eb3123c6b138c6299c640.html)
- [x] [Http协议系列 — cookie，Session，缓存机制](https://www.qdfuns.com/article/40831/8fbe235d81b5ada00b53ddde9fd848a4.html)
- [x] [Http协议系列—-进阶Https基础](https://www.qdfuns.com/article/40831/3ffb59e3d1dfc7ed44e521c2a57aeec7.html)
- [x] [WebSocket协议入门基础](https://www.qdfuns.com/article/40831/6db7957dad157aa4239ec144c0aa9c55.html)
- [ ] [简单使用Nodejs+Socket.io2.0+boostrap4.0实现聊天室功能](https://www.qdfuns.com/article/40831/18843630b0a73d009fe9ed56e70156a8.html)

### 修改
忘记日期 [color=#ff4753]好多人反映看不懂繁体字，鉴于这些理论性东西不仅枯燥而且复杂，我就都转简体吧。[/color]
2018/08/10 [color=#ff4753]重新排版[/color]


## 為什麼需要WebSocket协议?
在学习[color=#2b91e3]WebSocket[/color]协议之前我们需要先问问自己这个问题，我们熟悉的有[color=#2b91e3]HTTP1.0，HTTP1.x[/color]，甚至[color=#2b91e3]HTTP2.0[/color]，近年来安全性更高的[color=#2b91e3]HTTPS[/color]也开始普及起来，在这些情况為什麼还需要一个新的协议？它能解决哪些上面协议不能解决的难题么？



## WebSocket协议是什麼?
WebSocket协议是基于[color=#2b91e3]TCP[/color]的一种新的网络协议[color=#b1b1b1]（有很多人说是HTML5的东西，实际上HTML5只是提供了实现API而已）[/color].它实现了浏览器与服务器[color=#2b91e3]全双工（full-duplex）通信[/color]——允许服务器主动发送信息给客户端。
虽然和 HTTP 协议没有关系，但是为了兼容现有浏览器采用 HTTP 协议握手规范[color=#b1b1b1]（即使如此也不代表两者有关係，HTTP只负责建立WebSocket连接）[/color]。


## WebSocket协议实现原理
我直接去百度找一张图片来解释.
![图片描述](attimg://article/content/picture/201806/14/111655kypjhhjeylp68bq8.jpg)
WebSocket 协议本质上是一个基于 TCP 的协议，为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求相比较平时使用的 HTTP 请求多了一些

### 附加头信息：
> //请求服务器升级到另一个协议.不能在[color=#2b91e3]HTTP2[/color]中使用
Upgrade: WebSocket
Connection: Upgrade

### 握手信息
|header|描述|
|-|-|
|Sec-WebSocket-Key   | 浏览器随机生成的base64编码字节|
|Sec-WebSocket-Protocol   | 用户定义的字符串，用来区分同URL下，不同的服务所需要的协议|
|Sec-WebSocket-Version  | 告诉服务器所使用的协议版本|

服务器端解析这些头信息，并在握手的过程中依据这些信息生成一个 16 位的安全密钥并返回给客户端，以表明服务器端获取了客户端的请求，同意创建 WebSocket 连接.一旦连接建立，客户端和服务器端就可以通过这个通道双向传输数据了，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接.

大概流程如下：
![图片描述](attimg://article/content/picture/201806/14/111734lh7ycnq08e5qleqe.jpg)
([color=#757575]图片来自百度搜索[/color])
([color=#757575]更多内容请自行查阅，本节到此为止了.[/color])


##WebSocket协议解决了哪些HTTP做不到的事?
传统的信息交互过程就是浏览器发起请求，后端解析之后进行处理组装返回响应数据，浏览器接收执行业务逻辑之后渲染到界面.
在WebSocket协议出现之前，如果有些需求例如需要获取订单信息变化等业务逻辑我们一般常规操作就是不断发起[color=#ff4753]HTTP请求轮询[/color]，即使今时今日也有為数不少的人这麼做(例如我)，实际这没有绝对好坏，取决於需求与代价间的权衡.
![图片描述](attimg://article/content/picture/201806/14/112339jhbw9002998c9w8b.jpg)
([color=#757575]图片来自百度搜索[/color])
这种做法效率低，浪费资源，还会引起一些主要问题：
前端频繁访问服务器(瀏览器对并行请求数有限制，也会占用服务器线程资源)，期间创建http请求(中间建立连接环节多，携带数据量大)，DNS解析等(这些可以利用缓存)，服务器响应处理(如果是异步非阻塞像Nodejs也不怕)等过程不断重复，如果获取结果是未变化的相当于该次请求是多余的.

还有一些成熟的技术统称Comet，用于web的推送技术，服务器能够实时地将数据返回给前端而无须发出请求，两种主流实现方式:

###基于 AJAX 的长轮询（long-polling）方式
前端发起HTTP长连接请求之后如果服务器还没有响应数据可以返回就保持连接，直到返回数据或者超时之后会关闭然后再重新建立连接.
1， 服务器端会阻塞请求直到有数据传递或超时才返回.
2， 客户端 JavaScript 响应处理函数会在处理完服务器返回的信息后，再次发出请求，重新建立连接.
3， 当客户端处理接收的数据、重新建立连接时，服务器端可能有新的数据到达；这些信息会被服务器端保存直到客户端重新建立连接，客户端会一次把当前服务器端所有的信息取回.
优点: 有效降低多余请求频率，请求异步发出；无须安装插件；IE、Mozilla FireFox 都支持 AJAX.
缺点: 本质上没有改善，处理机制部分瀏览器会有不同.
![图片描述](attimg://article/content/picture/201806/14/112358qfolhx5vflh5lfjh.jpg)
([color=#757575]图片来自百度搜索[/color])

###基于 Iframe 及 htmlfile 的流（streaming）方式
在客户端的页面使用一个隐藏的窗口向服务端发出一个长连接的请求.服务器端接到这个请求后作出回应并不断更新连接状态以保证客户端和服务器端的连接不过期.通过这种机制可以将服务器端的信息源源不断地推向客户端.跟长轮询的区别:
1， 服务器一般都不是返回数据，而是直接调用客户端定义好的方法，将数据作為入参调用执行来实时更新页面；
2， 返回数据之后不会关闭连接，除非发生通信错误，或者超时重新建立连接；
优点: 请求异步发出；无须安装插件；IE、Mozilla FireFox 都支持 AJAX；
缺点: 需要针对不同的浏览器设计不同的方案来改进用户体验，并发量大情况下服务器压力大；
![图片描述](attimg://article/content/picture/201806/14/112432l4mjq4cvsssdhiiv.jpg)
([color=#757575]找不到更好看的图片，直接引用原文章的，详细地址文章末尾会附上所有参考资料[/color])

这些用 Ajax 方式来模拟实时的效果技术為了达到目的必须做出某种程度的牺牲，因为HTTP最初的目的不是为了双向通讯.而WebSocket协议提供了一个用来替代HTTP轮询实现网页到远程主机的双向通信的方法.因为 WebSocket 连接本质上就是一个 TCP 连接，所以在数据传输的稳定性和数据传输量的大小方面，和轮询以及 Comet 技术比较，具有很大的性能优势.
有一张简单请求效率对比图可做参考
![图片描述](attimg://article/content/picture/201806/14/112946f253pl2hre33h7sl.jpg)
([color=#757575]直接引用原文章的，详细地址文章末尾会附上所有参考资料[/color])

WebSocket协议能够做到:
1， 只需一次请求，这是真正意义上的长连接；
2， 允许服务器/客户端主动发送信息给对方，不需要一问一答方式交流；
3， 互相沟通的Header是很小的-大概只有 2 Bytes
4， 不同的URL可以复用同一个WebSocket连接；
5， 没有同源限制，客户端可以与任意服务器通信；
6， 适合实时要求高、海量并发的场景；

([color=#757575]更多内容请自行查阅，本节到此为止了.[/color])




##API
###创建
```javascript
new WebSocket(url， [protocol])
```
|属性|描述|
|-|-|
| url| 指定连接的 URL|
|protocol  | 可选的，指定了可接受的子协议|

###属性
|属性|描述|
|-|-|
| readyState| 只读属性 readyState 表示连接状态，可以是以下值：0 - 表示连接尚未建立.1 - 表示连接已建立，可以进行通信.2 - 表示连接正在进行关闭.3 - 表示连接已经关闭或者连接不能打开.|
|bufferedAmount | 只读属性 bufferedAmount 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数.|


###事件
|事件|事件处理程序|描述|
|-|-|-|
|open | onopen| 连接建立时触发|
| message| onmessage|客户端接收服务端数据时触发 |
|error | onerror| 通信发生错误时触发|
| close|onclose| 连接关闭时触发|

###方法
|方法|描述|
|-|-|
| send| 使用连接发送数据|
| close| 关闭连接|


###检测
```javascript
function canWebSocket() {
    if ("WebSocket" in window) {
        alert("您的浏览器支持 WebSocket!")；
        //支持的话你就在这裡乾点啥的唄
        //当然更好的方式是返回一个布尔值而不是每次都进行判断
    } else {
        alert("您的浏览器不支持 WebSocket!")；
    }
}
```

###例子
```javascript
//最简单简短的例子
var ws = new WebSocket("xx")；

ws.onopen = function() {
    ws.send("发送数据")；
}；

ws.onmessage = function(evt) {
    //接受数据
}；

ws.onclose = function() {
    // 关闭 websocket
}；
```


##网络协议的进化和补充
1， HTTP1.0 协议是一种无状态的、无连接的、单向的基於请求/响应模型的应用层协议，HTTP连接中只能发送一次请求和响应之后结束；
2， HTTP1.x 改善持久连接，HTTP连接中可发送多次请求和响应之后结束，每个请求对应一个响应；
2， HTTP2能够压缩headers的可复用二进制协议；
3， HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议；
4， WebSocket协议是一种持久化连接的全双工(full-duplex)通信应用层协议；
([color=#757575]更多内容请自行查阅，本节到此为止了.[/color])


##参考资料
更详细资料请参考原文
[WebSocket](https://baike.baidu.com/item/WebSocket/1953845?fr=aladdin)
[WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561)
[Comet：基于 HTTP 长连接的“服务器推”技术](https://www.ibm.com/developerworks/cn/web/wa-lo-comet/)
[使用 HTML5 WebSocket 构建实时 Web 应用](https://www.ibm.com/developerworks/cn/web/1112_huangxa_websocket/)
[HTML5 WebSocket](http://www.runoob.com/html/html5-websocket.html)
