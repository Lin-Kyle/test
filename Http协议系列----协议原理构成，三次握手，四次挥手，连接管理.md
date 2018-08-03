# 前言
这篇文章实话说我有点虚，因为平时都不怎么研究这一块的，然后涉及到的知识点超多，我只能到处看看资料总结一下相关信息，所以在此我只想说句：
**本文章内容只代表个人立场，有错必改！**
原本打算一次性总结，后来越扯越多超过字数限制了，就干脆做成http系列文章了，不定时更新原有内容（发现哪里出错的话），不定时新增系列文章，请见谅!
- [x] [Http协议系列----协议原理构成与连接管理](https://www.qdfuns.com/article/40831/577fa2647a7eb3123c6b138c6299c640.html)
- [ ] [Http协议系列—-字符编码，cookie，缓存，疑难杂症](https://www.qdfuns.com/article/40831/8fbe235d81b5ada00b53ddde9fd848a4.html)
- [ ] [Http协议系列—-进阶Https基础](https://www.qdfuns.com/article/40831/3ffb59e3d1dfc7ed44e521c2a57aeec7.html)
- [ ] [WebSocket协议入门基础](https://www.qdfuns.com/article/40831/6db7957dad157aa4239ec144c0aa9c55.html)
- [ ] [简单使用Nodejs+Socket.io2.0+boostrap4.0实现聊天室功能](https://www.qdfuns.com/article/40831/18843630b0a73d009fe9ed56e70156a8.html)

[bgcolor=#bf360c][color=#fff]PS: 好多人反映看不懂繁体字，鉴于这些理论性东西不仅枯燥而且复杂，我就都转简体吧。[/color][/bgcolor]



## 什么是HTTP协议？（来自百度百科）
超文本传输协议（HTTP HyperText Transfer Protocol）是互联网上应用最为广泛的一种网络协议。所有的WWW文件都必须遵守这个标准。设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法，用于从WWW服务器传输超文本到本地浏览器的传输协议。它可以[color=#ff5722]使浏览器更加高效，使网络传输减少。它不仅保证计算机正确快速地传输超文本文档，还确定传输文档中的哪一部分，以及哪部分内容首先显示（如文本先于图形）等。[/color]


## HTTP协议基本性质
* 简单
	HTTP报文能够被人读懂，还允许简单测试，降低了门槛

* 可扩展
	只要服务端和客户端就新 headers 达成语义一致，新功能就可以被轻松加入进来

* 无状态，有会话
	1） 在同一个连接中，两个执行成功的请求之间是没有关系的。这就带来了一个问题，用户没有办法在同一个网站中进行连续的交互；
    2） HTTP的头部扩展[color=#2b91e3]Cookies[/color]就可以解决这个问题，创建一个会话让每次请求都能共享相同的上下文信息，达成相同的状态；

* 连接
	一个连接是由传输层来控制的，这从根本上不属于HTTP的范围。HTTP并不需要其底层的传输层协议是面向连接的，只需要它是可靠的，或不丢失消息的（至少返回错误）。


## HTTP架构（来自百度百科）
HTTP是客户端和服务端请求和应答的标准，之间可能隔著多个中间层。
通常，由HTTP客户端发起一个请求，建立一个到服务器指定端口（默认是[color=#2b91e3]80[/color]端口）的TCP连接。HTTP服务器则在那个端口监听客户端发送过来的请求。一旦收到请求，服务器（向客户端）发回一个状态行和（响应的）消息，消息的消息体可能是请求的文件、错误消息、或者其它一些信息。
[color=#ff5722]HTTP使用TCP而不是UDP的原因在于（打开）一个网页必须传送很多数据，而TCP协议提供传输控制，按顺序组织数据，和错误纠正。[/color]
通过HTTP或者HTTPS协议请求的资源由**[color=#2b91e3]统一资源标示符（Uniform Resource Identifiers）[/color]**（或者，更准确一些，URLs）来标识。


## 统一资源标示符URI（Uniform Resource Identifiers）
用于标识某一互联网资源名称的字符串。 该种标识允许用户对任何（包括本地和互联网）的资源（HTML文档、图像、视频片段、程序等）通过特定的协议进行交互操作。
组成：[color=#b1b1b1](具体来源已经无法考察）[/color]
1）访问资源的命名机制；
2）存放资源的主机名；
3）资源自身的名称，由路径表示，著重强调于资源；

URI又分成两种：
### 统一资源定位器URL（uniform resource locator）
URL是Internet上用来描述信息资源的字符串，主要用在各种WWW客户程序和服务器程序上。
采用URL可以用一种统一的格式来描述各种信息资源，包括文件、服务器的地址和目录等。
组成：
1）协议（或称为服务方式）；
2）存有该资源的主机IP地址（有时也包括端口号）；
3）主机资源的具体地址，如目录和文件名等；
[color=#ff5722]第一部分和第二部分之间用“：//”符号隔开，第二部分和第三部分用“/”符号隔开。[/color]第一部分和第二部分是不可缺少的，第三部分有时可以省略。例如：
> https://www.qdfuns.com/

### 统一资源命名URN（uniform resource name）
标识持久性 Internet 资源。
URN 可以提供一种机制，用于查找和检索定义特定命名空间的架构文件。尽管普通的 URL 可以提供类似的功能，但是在这方面，URN 更加强大并且更容易管理，因为URN 可以引用多个 URL。
URN是作为特定内容的唯一名称使用的，[color=#ff5722]与当前资源的所在地无关[/color]。使用URN，就可以将资源四处迁移，而不用担心迁移后无法访问。

[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]


## 工作原理（来自百度百科）
一次HTTP操作称为一个事务，其工作过程可分为四步：
* 首先客户端与服务器需要[color=#ff5722]建立连接[/color]。只要单击某个超级链接，HTTP的工作就开始了。
* 建立连接后，客户端[color=#ff5722]发送请求[/color]给服务器，请求方式的格式为：统一资源标识符（URL）、协议版本号，后边是MIME信息包括请求修饰符、客户机信息和可能的内容。
* 服务器接到请求后，给予相应的[color=#ff5722]响应信息[/color]，其格式为一个状态行，包括信息的协议版本号、一个成功或错误的代码，后边是MIME信息包括服务器信息、实体信息和可能的内容。
* 客户端接收服务器所返回的信息通过浏览器显示在用户的显示屏上，然后客户端与服务器[color=#ff5722]断开连接[/color]。

如果在以上过程中的某一步出现错误，那么产生错误的信息将返回到客户端，由显示屏输出。对于用户来说，这些过程是由HTTP自己完成的，用户只要用鼠标点击，等待信息显示就可以了。
许多HTTP通讯是由一个用户代理初始化的并且包括一个申请在源服务器上资源的请求。最简单的情况可能是在用户代理和服务器之间通过一个单独的连接来完成。在Internet上，HTTP通讯通常发生在TCP/IP连接之上。缺省端口是TCP 80，但其它的端口也是可用的。但[color=#ff5722]这并不预示著HTTP协议在Internet或其它网络的其它协议之上才能完成。HTTP只预示著一个可靠的传输[/color]。


## 建立连接 --- 三次握手（three-way handshake）
所谓的“[color=#f4511e]三次握手[/color]”即对每次发送的数据量是怎样跟踪进行协商使数据段的发送和接收同步，根据所接收到的数据量而确定的数据确认数及数据发送、接收完毕后何时撤消联系，并建立虚连接。
为了提供可靠的传送，TCP在发送新的数据之前，以特定的顺序将数据包的序号，并需要这些包传送给目标机之后的确认消息。TCP总是用来发送大批量的数据。当应用程序在收到数据后要做出确认时也要用到TCP。
* 第一次握手：建立连接时，客户端发送[color=#2b91e3]syn包（syn=j）[/color]到服务器，并进入[color=#2b91e3]SYN_SENT状态[/color]，等待服务器确认；
* 第二次握手：服务器收到syn包，必须确认客户的[color=#2b91e3]SYN（ack=j+1）[/color]，同时自己也发送一个[color=#2b91e3]SYN包（syn=k）[/color]，即SYN+ACK包，此时服务器进入[color=#2b91e3]SYN_RECV状态[/color]；
* 第三次握手：客户端收到服务器的[color=#2b91e3]SYN+ACK包[/color]，向服务器发送[color=#2b91e3]确认包ACK（ack=k+1）[/color]，此包发送完毕，客户端和服务器进入[color=#2b91e3]ESTABLISHED（TCP连接成功）状态[/color]，完成三次握手。

![图片描述](attimg://article/content/picture/201804/07/135318nx9nmymnzbfn1z74.jpg)
[color=#b1b1b1]（还没太懂也懒，直接百度图片找张清晰的拿来用的。。）[/color]

为什么需要三次握手（three-way handshake）呢?
为了沟通包的顺序问题保证数据可靠性。
例如有这样一种情况：客户端发出的第一个连接请求报文段并没有丢失，而是在某个网络结点长时间的滞留了，以致延误到连接释放以后的某个时间才到达服务器。本来这是一个早已失效的报文段。但服务器收到此失效的连接请求报文段后，就误认为是客户端再次发出的一个新的连接请求。于是就向客户端发出确认报文段，同意建立连接。假设不采用“三次握手”，那么只要服务器发出确认，新的连接就建立了。由于现在客户端并没有发出建立连接的请求，因此不会理睬服务器的确认，也不会向服务器发送数据。但服务器却以为新的运输连接已经建立，并一直等待客户端发来数据。这样，服务器的很多资源就白白浪费掉了。采用“三次握手”的办法可以防止上述现象发生。例如刚才那种情况，客户端不会向服务器的确认发出确认。服务器于收不到确认，就知道客户端并没有要求建立连接。
总结而言:[color=#ff5722]防止因为特殊原因导致服务器接收到已失效的请求造成其一直在等待浪费资源[/color]。


### 术语
|名称|描述|
|-|-|
|ACK |acknowledgement 回复连接 |
| FIN| finish 结束连接|
| RST| reset 重新连接|
| SYN|synchronous 发起连接 |


了解到这我觉得就差不多了，再深我就看不懂了，有兴趣的深入研究吧
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]

##断开连接 ---- 四次挥手（four-way handshake）
为什么建立连接要[color=#2b91e3]三次握手（three-way handshake）[/color]而断开连接却需要[color=#2b91e3]四次挥手（four-way handshake）[/color]?
这是因为服务端的LISTEN状态下的SOCKET当收到SYN报文的建连请求后，它可以把ACK和SYN[color=#ff5722](ACK起应答作用，而SYN起同步作用）[/color]放在一个报文里来发送。但关闭连接时，当收到对方的FIN报文通知时，它仅仅表示对方没有数据发送给你了；但未必你所有的数据都全部发送给对方了，所以你可以未必会马上会关闭SOCKET，也即你可能还需要发送一些数据给对方之后，再发送FIN报文给对方来表示你同意现在可以关闭连接了，所以它这里的ACK报文和FIN报文多数情况下都是分开发送的。

* 当主机A的应用程序通知TCP数据已经发送完毕时，TCP向主机B发送一个带有[color=#ff5722]FIN附加标记[/color]的报文段；
* 主机B收到这个FIN报文段之后，并不立即用FIN报文段回复主机A，而是先向主机A发送一个[color=#ff5722]确认序号ACK[/color]，同时通知自己相应的应用程序：对方要求关闭连接[color=#b1b1b1](先发送ACK的目的是为了防止在这段时间内，对方重传FIN报文段）[/color]；
* 主机B的应用程序告诉TCP：我要彻底的关闭连接，TCP向主机A送一个[color=#ff5722]FIN报文段[/color]；
* 主机A收到这个FIN报文段后，向主机B发送一个[color=#ff5722]ACK[/color]表示连接彻底释放；

![图片描述](attimg://article/content/picture/201804/07/134541ocqrw9w9zqc6gw4o.jpg)
[color=#b1b1b1]（还没太懂也懒，直接百度图片找张清晰的拿来用的。。）[/color]
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]


##HTTP请求（requests）
HTTP请求是由客户端发出的消息，用来使服务器执行动作，主要包含三部分:
### 请求行
一， HTTP 方法
	1） 描述要执行的动作；

二， 请求目标 （request target）
	通常是一个 URL，或者是协议、端口和域名的绝对路径，通常以请求的环境为特征。请求的格式因不同的 HTTP 方法而异。
	1） 一个绝对路径，末尾跟上一个 ' ? ' 和查询字符串；
    2） 一个完整的URL，被称为 绝对形式 （absolute form），主要在 GET 连接到代理时使用；
    3） 由域名和可选端口（以':'为前缀）组成的 URL 的 authority component，称为 authority form。 仅在使用 CONNECT 建立 HTTP 隧道时才使用；
    4） 星号形式 （asterisk form），一个简单的星号（'*'），配合 OPTIONS 方法使用，代表整个服务器；

三， HTTP 版本 （HTTP version）
	1） 定义了剩余报文的结构，作为对期望的响应版本的指示符；


### 请求头
不区分大小写的字符串，紧跟著的冒号 （':'） 和一个结构取决于 header 的值。 整个 header（包括值）由一行组成，这一行可以相当长。
1， General headers，例如 Via，适用于整个报文；
2， Request headers，例如 User-Agent，Accept-Type，通过进一步的定义（例如 Accept-Language），或者给定上下文（例如 Referer），或者进行有条件的限制 （例如 If-None） 来修改请求；
3， Entity headers，例如 Content-Length，适用于请求的 body。显然，如果请求中没有任何 body，则不会发送这样的头文件；


### 请求体
不是所有的请求都有。
1， Single-resource bodies，由一个单文件组成。该类型 body 由两个 header 定义： Content-Type 和 Content-Length；
2， Multiple-resource bodies，由多部分 body 组成，每一部分包含不同的信息位。通常是和  HTML Forms 连系在一起；
![图片描述](attimg://article/content/picture/201804/07/150714eze0io0u1szdr626.jpg)
[color=#b1b1b1]（这些简单的东西我就懒得特意画图了，直接百度图片找张清晰的拿来用的。。）[/color]
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]

## HTTP响应（responses）
HTTP响应是服务器返回的消息，主要包含三部分:
### 响应行
一， 协议版本

二， 状态码 （status code）
	表明请求是成功或失败

三， 状态文本 （status text）
	一个简短的，纯粹的信息，通过状态码的文本描述，帮助人们理解该 HTTP 消息


### 响应头（同请求头）


### 响应体（同请求体）
![图片描述](attimg://article/content/picture/201804/10/195138kyfxcgx1esgnqns1.jpg)
[color=#b1b1b1]（这些简单的东西我就懒得特意画图了，直接百度图片找张清晰的拿来用的。。）[/color]
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]

## 请求方法
HTTP1.0定义了三种请求方法：**[color=#2b91e3]GET， POST[/color]** 和 **[color=#2b91e3]HEAD[/color]**方法。
HTTP1.1新增了五种请求方法：**[color=#2b91e3]OPTIONS， PUT， DELETE， TRACE[/color]** 和 **[color=#2b91e3]CONNECT[/color]** 方法。
|方法|描述|
|-|-|
| GET| 请求指定的页面信息，并返回实体主体。|
| POST| 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。|
| HEAD| 类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头|
| OPTIONS| 允许客户端查看服务器的性能。|
|PUT| 从客户端向服务器传送的数据取代指定的文档的内容。|
| DELETE| 请求服务器删除指定的页面。|
| TRACE| 回显服务器收到的请求，主要用于测试或诊断。|
| CONNECT| HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器|


### 著名经典问题，POST和GET的区别是什么?
|比较方面|GET|POST|
|-|-|-|
| 用法|从服务器上获取数据，不影响资源 |向服务器传送数据，可能会导致新的资源的建立和/或已有资源的修改 |
|传输方式 |将查询字符串参数追加到url的末尾，只能ASCII 字符 | 把数据作为请求的主体提交，格式不限|
| 大小| 根据URL而定，最大长度是 2048 个字符| 根据浏览器而定，但比get大|
|安全性 | 低| 高|
| 服务器获取方式| Request。QueryString| Request。Form|
| 后退/刷新| 无害| 重新提交|
| 历史参数是否保留在浏览器历史中|是 |否 |
| 书签是否可收藏|是 |否 |
| 是否能被缓存|是 |否 |



## HTTP消息头
一个消息头由不区分大小写的名称后跟一个冒号“[color=#2b91e3]：[/color]”，冒号后跟具体的值（不带换行符）组成。该值前面的引导空白会被忽略。

* 一般头: 同时适用于请求和响应消息，但与最终消息主体中传输的数据无关的消息头。
* 请求头: 包含有关要获取的资源或客户端本身更多信息的消息头。
* 响应头: 包含有关服务器响应的补充信息，如其位置或服务器本身（名称和版本等）的消息头。
* 实体头: 包含有关实体主体的更多信息，比如主体长（Content-Length）度或其MIME类型。



## 状态消息

分类 | 分类描述
---|:--:
1** | 信息，服务器收到请求，需要请求者继续执行操作
2** | 成功，操作被成功接收并处理
3** | 重定向，需要进一步的操作以完成请求
4** | 客户端错误，请求包含语法错误或无法完成请求
5** | 服务器错误，服务器在处理请求的过程中发生了错误


### 常见类型

状态码|消息|描述|
---|:--:|:--:
200 |OK | 成功。请求的所有数据都在响应主体中。
 301| Moved Permanently| 所请求的页面已经转移至新的url。
302 | Found| 所请求的页面已经临时转移至新的url。
 304|Not Modified | 未按预期修改文档。客户端有缓冲的文档并发出了一个条件性的请求（一般是提供If-Modified-Since头表示客户只想比指定日期更新的文档）。服务器告诉客户，原来缓冲的文档还可以继续使用。
403 |Forbidden |对被请求页面的访问被禁止。
 404|Not Found |服务器无法找到被请求的页面。
 500| Internal Server Error| 请求未完成。服务器遇到不可预知的情况。
502| Bad Gateway| 请求未完成。服务器从上游服务器收到一个无效的响应。
504| Gateway Timeout| 网关超时。

[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]


## Http连接管理
### 短连接
HTTP 最早期的模型，也是  [color=#2b91e3]HTTP/1.0 的默认模型[/color][color=#b1b1b1]（如果没有指定 Connection 协议头，或者是值被设置为 close）[/color]。每一个 HTTP 请求都由它自己独立的连接完成；这意味著发起每一个 HTTP 请求之前都会有一次 TCP 握手，而且是连续不断的。
TCP 协议握手本身就是耗费时间的，所以 TCP 可以保持更多的热连接来适应负载。短连接破坏了 TCP 具备的能力，新的冷连接降低了其性能。
而在 [color=#2b91e3]HTTP/1.1[/color] 中，只有当 [color=#2b91e3]Connection[/color] 被设置为 [color=#2b91e3]close[/color] 时才会用到这个模型。

这个简单的模型对性能有先天的限制：打开每一个 TCP 连接都是相当耗费资源的操作。客户端和服务器端之间需要交换好些个消息。当请求发起时，网络延迟和带宽都会对性能造成影响。现代浏览器往往要发起很多次请求（十几个或者更多）才能拿到所需的完整信息，证明了这个早期模型的效率低下。

**缺点**:
1， 创建新连接耗费的时间；
2， TCP 连接的性能只有在该连接被使用一段时间后（热连接）才能得到改善；


### 长连接

而HTTP/1.1[color=#b1b1b1]（以及 HTTP/1.0 的各种增强版本）[/color]允许HTTP在请求结束之后将TCP连接保持打开状态，以便为未来的HTTP请求重用现存的连接。[color=#ff5722]一个长连接会保持一段时间，重复用于发送一系列请求，节省了新建 TCP 连接握手的时间，还可以利用 TCP 的性能增强能力[/color]。当然这个连接也不会一直保留著：连接在空闲一段时间后会被关闭[color=#b1b1b1]（服务器可以使用 Keep-Alive 协议头来指定一个最小的连接保持时间）[/color]。
* HTTP/1.0+ keep-alive
	客户端可以通过包含 [color=#ff5722]Connection: Keep-Alive[/color]首部请求将一条连接保持在打开状态，如果服务器愿意为下一条请求将连接保持在打开状态，就在响应中包含相同的首部。如果响应中没有 Connection: Keep-Alive 首部， 客户端就认为服务器不支持 keep-alive， 会在发回响应报文之后关闭连接。

	|首部|作用|
	|-|-|
	|timeout | 响应首部发送的。 它代表服务器希望将连接保持在活跃状态的时间。 但这并不是绝对|
	| max| 响应首部发送的。 它代表服务器还希望为多少个事务保持此连接的活跃状态。 但这并不是绝对|
	|Keep-Alive | 首部还可支持任意未经处理的属性， 这些属性主要用于诊断和调试。语法为 name=value|

	例如[color=#f4511e]Keep-Alive: max=5， timeout=3000， abc=123；[/color]

  HTTP/1.0 里默认并不适用长连接。把 Connection 设置成 close 以外的其它参数都可以让其保持长连接，通常会设置为 [color=#2b91e3]retry-after[/color]。
  在 HTTP/1.1 里，默认就是长连接的，协议头都不用再去声明它[color=#b1b1b1]（但我们还是会把它加上，万一某个时候因为某种原因要退回到 HTTP/1.0 呢）[/color]。

* HTTP/1.1 persistent
    现在HTTP/1.1 逐渐停止了对 keep-alive 连接的支持， 用一种名为[color=#2b91e3]持久连接（persistent connection） [/color]的改进型设计取代了它。
    与 HTTP/1.0+ 的 keep-alive 连接不同，HTTP/1.1 持久连接在默认情况下是激活的。 除非特别指明，否则 HTTP/1.1 假定所有连接都是持久的。[color=#ff5722]要在事务处理结束之后将连接关闭，HTTP/1.1 应用程序必须向报文中显式地添加一个Connection:close首部[/color]。这是与以前的 HTTP 协议版本很重要的区别，在以前的版本中，keep-alive 连接要么是可选的，要么根本就不支持。这种连接相当于是在HTTP/1.1之上默认开启keep-alive


**缺点**:
1， 就算是在空闲状态，它还是会消耗服务器资源；
2， 在重负载时，还有可能遭受 DoS attacks 攻击；

### 流水线
默认情况下，HTTP 请求是按顺序发出的。下一个请求只有在当前请求收到应答过后才会被发出。由于会受到网络延迟和带宽的限制，在下一个请求被发送到服务器之前，可能需要等待很长时间。

流水线是在同一条长连接上发出连续的请求，而不用等待应答返回。这样可以避免连接延迟。理论上讲，性能还会因为两个 HTTP 请求有可能被打包到一个 TCP 消息包中而得到提升。就算 HTTP 请求不断的继续，尺寸会增加，但设置 TCP 的 [color=#2b91e3]MSS（Maximum Segment Size）[/color] 选项，任然足够包含一系列简单的请求。

并不是所有类型的 HTTP 请求都能用到流水线：只有 [color=#2b91e3]idempotent[/color] 方式，比如 [color=#2b91e3]GET、HEAD、PUT[/color] 和 [color=#2b91e3]DELETE[/color] 能够被安全的重试：如果有故障发生时，流水线的内容要能被轻易的重试。

今天，所有遵循 HTTP/1.1 的代理和服务器都应该支持流水线，虽然实际情况中还是有很多限制：一个很重要的原因是，仍然没有现代浏览器去默认支持这个功能。

### 连接执行
一般项目需要进行大量请求场景，如果每个请求都进行串行执行会消耗大量的内存资源，引发自身的性能问题，但是如果每个请求都进行并行执行的话，会导致服务器在同一时间内处理大量请求，造成自身的效率问题。所以浏览器一般都会把并行请求限制在一定数量内，一般大概五个左右吧[color=#b1b1b1]（我大概估算，没进行过验证的）[/color]。

**连接分别示意图**
![图片描述](attimg://article/content/picture/201804/15/114628mp1zpyeda6rrp186.png)
[color=#b1b1b1]（还没太懂也懒，直接MDN的拿来用的。。）[/color]
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]



## 课外延展
### 常用标准头
|应答头|描述|
|-|-|
| Accept | 告诉服务端客户端接受什么类型的响应，可以为一个或多个MIME类型的值。详情[Media type](https://en。wikipedia。org/wiki/Media_type） |
| Accept-Charset | 可以接受的字符集 |
| Accept-Encoding | 可接受的编码压缩方法列表，详情[HTTP compression](https://en。wikipedia。org/wiki/HTTP_compression）|
| Accept-Language | 允许客户端声明它可以理解的自然语言，以及优先选择的区域方言。[Content negotiation](https://developer。mozilla。org/en-US/docs/Web/HTTP/Content_negotiation）|
| Accept-Datetime | 设置接受的版本时间|
| Access-Control-Request-Method，Access-Control-Request-Headers | 发起一个与起源（下）的跨源资源共享的请求。详情[Cross-origin resource sharing](https://en。wikipedia。org/wiki/Cross-origin_resource_sharing） |
| Allow|服务器支持哪些请求方法 |
| Authorization |HTTP身份验证的凭证 |
| Content-Encoding|文档的编码（Encode）方法。只有在解码之后才可以得到Content-Type头指定的内容类型。利用gzip压缩文档能够显著地减少HTML文档的下载时间。Java的GZIPOutputStream可以很方便地进行gzip压缩，但只有Unix上的Netscape和Windows上的IE 4、IE 5才支持它。因此，Servlet应该通过查看Accept-Encoding头（即request。getHeader（"Accept-Encoding"））检查浏览器是否支持gzip，为支持gzip的浏览器返回经gzip压缩的HTML页面，为其他浏览器返回普通页面。 |
| Cache-Control | 这个字段用于指定所有缓存机制在整个请求/响应链中必须服从的指令。这些指令指定用于阻止缓存对请求或响应造成不利干扰的行为。这些指令通常覆盖默认缓存算法。缓存指令是单向的，即请求中存在一个指令并不意味著响应中将存在同一个指令。详情[Cache-Control](https://developer。mozilla。org/zh-CN/docs/Web/HTTP/Headers/Cache-Control） |
| Connection | 决定当前的事务完成后，是否会关闭网络连接。如果该值是“keep-alive”，网络连接就是持久的，不会关闭，使得对同一个服务器的请求可以继续在该连接上完成。 |
| Cookie | 一个请求首部，其中含有先前由服务器通过 Set-Cookie  首部投放并存储到客户端的 HTTP cookies。 |
| Content-MD5 | 设置基于MD5算法对请求体内容进行Base64二进制编码 |
| Content-Length| 表示内容长度。只有当浏览器使用持久HTTP连接时才需要这个数据。如果你想要利用持久连接的优势，可以把输出文档写入 ByteArrayOutputStream，完成后查看其大小，然后把该值放入Content-Length头，最后通过byteArrayStream。writeTo（response。getOutputStream（）发送内容。|
| Content-Type| 表示后面的文档属于什么MIME类型。Servlet默认为text/plain，但通常需要显式地指定为text/html。由于经常要设置Content-Type，因此HttpServletResponse提供了一个专用的方法setContentType。|
| Date| 当前的GMT时间。你可以用setDateHeader来设置这个头以避免转换时间格式的麻烦。|
| Etag（Entity Tag） | ETag一般不以明文形式相应给客户端。在资源的各个生命周期中，它都具有不同的值，用于标识出资源的状态。当资源发生变更时，如果其头信息中一个或者多个发生变化，或者消息实体发生变化，那么ETag也随之发生变化。Etag由服务器端生成，客户端通过If-Match或者说If-None-Match这个条件判断请求来验证资源是否修改。 |
| Expect | 包含一个期望条件，表示服务器只有在满足此期望条件的情况下才能妥善地处理请求。 |
| Expires| 指定了一个日期/时间， 在这个日期/时间之后，HTTP响应被认为是过时的；无效的日期，比如 0， 代表著一个过去的事件，即该资源已经过期了。如果还有一个 设置了 "max-age" 或者 "s-max-age" 指令的Cache-Control响应头，那么  Expires 头就会被忽略。|
| Forwarded	 | 通过HTTP代理将客户端连接到web服务器的原始信息公开。|
| Host | 服务器的域名（用于虚拟主机）和服务器监听的TCP端口号。如果端口是请求服务的标准端口，则可以省略端口号。HTTP / 1.1以来的强制性。如果请求是直接在HTTP/2中生成的，则不应该使用它。 |
| If-Modified-Since | 条件式请求首部，服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200  。如果请求的资源从那时起未经修改，那么返回一个不带有消息主体的  304  响应，而在 Last-Modified 首部中会带有上次修改时间。 不同于If-Unmodified-Since， If-Modified-Since 只可以用在 GET 或 HEAD 请求中。当与 If-None-Match 一同出现时，它会被忽略掉，除非服务器不支持 If-None-Match。 |
| If-Match | 这是一个条件请求。在请求方法为 GET 和 HEAD 的情况下，服务器仅在请求的资源满足此首部列出的 ETag 之一时才会返回资源。而对于 PUT 或其他非安全方法来说，只有在满足条件的情况下才可以将资源上传。 |
| If-None-Match | 条件式请求首部。对于 GETGET 和 HEAD 请求方法来说，当且仅当服务器上没有任何资源的 ETag 属性值与这个首部中列出的相匹配的时候，服务器端会才返回所请求的资源，响应码为  200  。对于其他方法来说，当且仅当最终确认没有已存在的资源的  ETag 属性值与这个首部中所列出的相匹配的时候，才会对请求进行相应的处理。详情[HTTP ETag](https://en。wikipedia。org/wiki/HTTP_ETag） |
| If-Range | 当字段值中的条件得到满足时，Range 头字段才会起作用，同时服务器回复206 部分内容状态码，以及Range 头字段请求的相应部分；如果字段值中的条件没有得到满足，服务器将会返回 200 OK 状态码，并返回完整的请求资源。|
| If-Unmodified-Since | 使得当前请求成为条件式请求：只有当资源在指定的时间之后没有进行过修改的情况下，服务器才会返回请求的资源，或是接受 POST 或其他 non-safe 方法的请求。如果所请求的资源在指定的时间之后发生了修改，那么会返回 412 （Precondition Failed） 错误。 |
| Last-Modified| 文档的最后改动时间。客户可以通过If-Modified-Since请求头提供一个日期，该请求将被视为一个条件GET，只有改动时间迟于指定时间的文档才会返回，否则返回一个304（Not Modified）状态。Last-Modified也可用setDateHeader方法来设置。|
| Location| 表示客户应当到哪里去提取文档。Location通常不是直接设置的，而是通过HttpServletResponse的sendRedirect方法，该方法同时设置状态代码为302.|
| Max-Forwards | 限制消息可以通过代理或网关转发的次数。 |
| Origin | 发起对跨源资源共享的请求（请求服务器用于访问控制-*响应字段）。 |
| Proxy-Authorization | 用于连接到代理的授权凭据。 |
| Refresh| 	表示浏览器应该在多少时间之后刷新文档，以秒计。除了刷新当前文档之外，你还可以通过setHeader（"Refresh"， "5； URL=http://host/path"）让浏览器读取指定的页面。 注意这种功能通常是通过设置HTML页面HEAD区的＜META HTTP-EQUIV="Refresh" CONTENT="5；URL=http://host/path"＞实现，这是因为，自动刷新或重定向对于那些不能使用CGI或Servlet的HTML编写者十分重要。但是，对于Servlet来说，直接设置Refresh头更加方便。 注意Refresh的意义是"N秒之后刷新本页面或访问指定页面"，而不是"每隔N秒刷新本页面或访问指定页面"。因此，连续刷新要求每次都发送一个Refresh头，而发送204状态代码则可以阻止浏览器继续刷新，不管是使用Refresh头还是＜META HTTP-EQUIV="Refresh" 。。。＞。 注意Refresh头不属于HTTP 1.1正式规范的一部分，而是一个扩展，但Netscape和IE都支持它。|
| User-Agent | 用户代理的用户代理字符串。 |
| upgrade  | 请求服务器升级到另一个协议。不能在HTTP/2中使用。 |
| Via | 请通知服务器发送请求的代理服务器。 |
| Warning  | 实体可能会发生的问题的通用警告。 |
| WWW-Authenticate| 客户应该在Authorization头中提供什么类型的授权信息？在包含401（Unauthorized）状态行的应答中这个头是必需的。例如，response。setHeader（"WWW-Authenticate"， "BASIC realm=＼"executives＼""）。 注意Servlet一般不进行这方面的处理，而是让Web服务器的专门机制来控制受密码保护页面的访问（例如。htaccess）。|
| Server| 包含了处理请求的源头服务器所用到的软件相关信息。|
| Set-Cookie| 设置和页面关联的Cookie。Servlet不应使用response。setHeader（"Set-Cookie"， 。。。），而是应使用HttpServletResponse提供的专用方法addCookie。|
| Server| 服务器名字。Servlet一般不设置这个值，而是由Web服务器自己设置。|


### 常用非标准头
|应答头|描述|
|-|-|
| Content-Security-Policy， X-Content-Security-Policy，X-WebKit-CSP  | 定义内容安全策略|
| DNT （Do Not Track） | 0表示用户愿意目标站点追踪用户个人信息。1表示用户不愿意目标站点追踪用户个人信息。|
| X-ATT-DeviceId  | 允许更简单的解析用户代理在AT&T设备上的MakeModel/Firmware|
| X-Csrf-Token，X-CSRFToken，X-XSRF-TOKEN  | 防止跨站请求伪造|
| X-Content-Type-Options  | 唯一的取值是""，阻止IE在响应中嗅探定义的内容格式以外的其他MIME格式|
| X-Forwarded-For | 一个事实标准，用来标识客户端通过HTTP代理或者负载均衡器连接的web服务器的原始IP地址|
| X-Forwarded-Host | 一个事实标准，用来标识客户端在HTTP请求头中请求的原始host，因为主机名或者反向代理的端口可能与处理请求的原始服务器不同|
| X-Forwarded-Proto | 一个事实标准，用来标识HTTP原始协议，因为反向代理或者负载均衡器和web服务器可能使用http，但是请求到反向代理使用的是https|
| X-Http-Method-Override | 请求web应用时，使用header字段中给定的方法（通常是put或者delete）覆盖请求中指定的方法（通常是post），如果用户代理或者防火墙不支持直接使用put或者delete方法发送请求时，可以使用这个字段|
| X-Request-ID，X-Correlation-ID  | 标识客户端和服务端的HTTP请求|
| X-Requested-With | 标识Ajax请求，大部分js框架发送请求时都会设置它为XMLHttpRequest|
| X-XSS-Protection  | 过滤跨站脚本|
| X-UA-Compatible  | 推荐首选的渲染引擎来展示内容，通常向后兼容，也用于激活IE中内嵌chrome框架插件|
| Upgrade-Insecure-Requests  | 标识服务器是否可以处理HTTPS协议|
