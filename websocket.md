##WebSocket
WebSocket协议是基于TCP的一种新的网络协议。它实现了浏览器与服务器全双工(full-duplex)通信——允许服务器主动发送信息给客户端。
浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。

长久以来, 创建实现客户端和用户端之间双工通讯的web app都会造成HTTP轮询的滥用: 客户端向主机不断发送不同的HTTP呼叫来进行询问。
这会导致一系列的问题：
1.服务器被迫为每个客户端使用许多不同的底层TCP连接：一个用于向客户端发送信息，其它用于接收每个传入消息。
2.有些协议有很高的开销，每一个客户端和服务器之间都有HTTP头。
3.客户端脚本被迫维护从传出连接到传入连接的映射来追踪回复。
一个更简单的解决方案是使用单个TCP连接双向通信。 这就是WebSocket协议所提供的功能。 结合WebSocket API ，WebSocket协议提供了一个用来替代HTTP轮询实现网页到远程主机的双向通信的方法。
WebSocket协议被设计来取代用HTTP作为传输层的双向通讯技术,这些技术只能牺牲效率和可依赖性其中一方来提高另一方，因为HTTP最初的目的不是为了双向通讯。

##实现原理
在实现websocket连线过程中，需要通过浏览器发出websocket连线请求，然后服务器发出回应，这个过程通常称为“握手” 。在 WebSocket API，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。在此WebSocket 协议中，为我们实现即时服务带来了两大好处：
1. Header 互相沟通的Header是很小的-大概只有 2 Bytes
2. Server Push 服务器的推送，服务器不再被动的接收到浏览器的请求之后才返回数据，而是在有新数据时就主动推送给浏览器。


WebSocket 协议本质上是一个基于 TCP 的协议。
为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息"Upgrade: WebSocket"表明这是一个申请协议升级的 HTTP 请求，服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。


##API
###創建
```javascript
new WebSocket(url, [protocol])
```
|属性|描述|
|-|-|
| url| 指定连接的 URL|
|protocol  | 可选的，指定了可接受的子协议|

###属性
|属性|描述|
|-|-|
| readyState| 只读属性 readyState 表示连接状态，可以是以下值：0 - 表示连接尚未建立。1 - 表示连接已建立，可以进行通信。2 - 表示连接正在进行关闭。3 - 表示连接已经关闭或者连接不能打开。|
|bufferedAmount | 只读属性 bufferedAmount 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。|


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


###檢測
```javascript
function canWebSocket() {
    if ("WebSocket" in window) {
        alert("您的浏览器支持 WebSocket!");
        //支持的話你就在這裡乾點啥的唄
        //當然更好的方式是返回一個布爾值而不是每次都進行判斷
    } else {
        alert("您的浏览器不支持 WebSocket!");
    }
}
```

###例子
```javascript
//最簡單簡短的例子
var ws = new WebSocket("xx");

ws.onopen = function() {
    ws.send("发送数据");
};

ws.onmessage = function(evt) {
    //接受數據
};

ws.onclose = function() {
    // 关闭 websocket
};
```
