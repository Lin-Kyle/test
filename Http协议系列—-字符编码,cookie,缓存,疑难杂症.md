# 前言
这篇文章实话说我有点虚，因为平时都不怎么研究这一块的，然后涉及到的知识点超多，我只能到处看看资料总结一下相关信息，所以在此我只想说句：
**本文章内容只代表个人立场，有错必改！**
原本打算一次性总结，后来越扯越多超过字数限制了，就干脆做成http系列文章了，不定时更新原有内容（发现哪里出错的话），不定时新增系列文章，请见谅!

因为之前写得太臃肿又不够详细，最近刚好复习到这一块的内容，所以决定把这些文章都拆分成更加细致一点，补充详细内容，优化排版布局，目前来看还是应该的。后续没勾选的只是还没改到那里去，可以先不看。
+ [x] [Http协议系列 — 协议原理构成与连接管理](https://www.qdfuns.com/article/40831/577fa2647a7eb3123c6b138c6299c640.html)
- [x] [Http协议系列 — cookie，Session，缓存机制](https://www.qdfuns.com/article/40831/8fbe235d81b5ada00b53ddde9fd848a4.html)
- [ ] [Http协议系列—-进阶Https基础](https://www.qdfuns.com/article/40831/3ffb59e3d1dfc7ed44e521c2a57aeec7.html)
- [ ] [WebSocket协议入门基础](https://www.qdfuns.com/article/40831/6db7957dad157aa4239ec144c0aa9c55.html)
- [ ] [简单使用Nodejs+Socket.io2.0+boostrap4.0实现聊天室功能](https://www.qdfuns.com/article/40831/18843630b0a73d009fe9ed56e70156a8.html)

### 修改
忘记日期 [color=#ec7379]好多人反映看不懂繁体字，鉴于这些理论性东西不仅枯燥而且复杂，我就都转简体吧。[/color]
2018/08/02 [color=#ec7379]抽离走其他内容，本章纯讲cookie，Session，缓存机制[/color]



## Cookie
服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，主要应用方面:
* 会话状态管理[color=#b1b1b1]（如用户登录状态、购物车、游戏分数或其它需要记录的信息）[/color]
* 个性化设置[color=#b1b1b1]（如用户自定义设置、主题等）[/color]
* 浏览器行为跟踪[color=#b1b1b1]（如跟踪分析用户行为等）[/color]
[color=#f3423d]注意: 服务器指定Cookie后，浏览器的每次请求都会携带Cookie数据，会带来额外的性能开销。[/color]

### 设置Set-Cookie属性
需要传输的自定义键值对数据**[color=#2b91e3]cookie-name=cookie-value[/color]**:
1, cookie-name 可以是[color=#f4511e]除了控制字符 (CTLs)、空格 (spaces) 或制表符 (tab)之外的任何 US-ASCII 字符[/color]。同时不能包含以下分隔字符：[color=#f4511e]\( ) < > @ , ; : \ " / [ ] ? = { }[/color].

2，cookie-value 是可选的，如果存在的话，那么需要包含在双引号里面。支持[color=#f4511e]除了控制字符（CTLs）、空格（whitespace）、双引号（double quotes）、逗号（comma）、分号（semicolon）以及反斜线（backslash）之外的任意 US-ASCII 字符[/color]。关于编码：许多应用会对 cookie 值按照URL编码（URL encoding）规则进行编码，但是按照 RFC 规范，这不是必须的。不过满足规范中对于 <cookie-value> 所允许使用的字符的要求是有用的。

3，__Secure- 前缀：以 __Secure- 为前缀的 cookie（其中连接符是前缀的一部分），必须与 secure 属性一同设置，同时必须应用于安全页面[color=#b1b1b1]（即使用 HTTPS 访问的页面）[/color]。

4，__Host- 前缀：以 __Host- 为前缀的 cookie，必须与 secure 属性一同设置，必须应用于安全页面（即使用 HTTPS 访问的页面），必须不能设置 domain 属性 [color=#b1b1b1]（也就不会发送给子域）[/color]，同时 path 属性的值必须为“/”。


配置属性如下:
|属性|描述|
|-|-|
| Domain| 指定 cookie 可以送达的主机名。假如没有指定，那么**默认值为当前文档访问地址中的主机部分（但是不包含子域名）**。与之前的规范不同的是，域名之前的点号会被忽略。假如指定了域名，那么相当于各个子域名也包含在内了|
| Path|指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。字符  %x2F （"/"）可以解释为文件目录分隔符，此目录的下级目录也满足匹配的条件（例如，如果 path=/docs，那么 "/docs"，"/docs/Web/" 或者 "/docs/Web/HTTP" 都满足匹配的条件）|
| Expire time| cookie 的最长有效时间，形式为符合 HTTP-date 规范的时间戳。参考 Date 可以获取详细信息。如果没有设置这个属性，那么表示这是一个会话期 cookie 。一个会话结束于客户端被关闭时，这意味著会话期 cookie 在彼时会被移除。然而，**很多Web浏览器支持会话恢复功能，这个功能可以使浏览器保留所有的tab标签，然后在重新打开浏览器的时候将其还原。与此同时，cookie 也会恢复，就跟从来没有关闭浏览器一样。**|
| Max-age| 在 cookie 失效之前需要经过的秒数。一位或多位非零（1-9）数字。一些老的浏览器（ie6、ie7 和 ie8）不支持这个属性。对于其他浏览器来说，假如二者 （指 Expires 和Max-Age）均存在，那么 **Max-Age 优先级更高**|
| secure|一个带有安全属性的 cookie 只有在请求使用SSL和HTTPS协议的时候才会被发送到服务器。然而，保密或敏感信息永远不要在 HTTP cookie 中存储或传输，因为整个机制从本质上来说都是不安全的，比如前述协议并不意味著所有的信息都是经过加密的。|
|httponly |设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  Document。cookie 属性、XMLHttpRequest 和  Request APIs 进行访问，以防范跨站脚本攻击（XSS）。|


### 注意
1，Cookie默认的maxAge值为–1;
2，如果为正数，则表示该Cookie会在maxAge秒之后自动失效。浏览器会将maxAge为正数的Cookie持久化，即写到对应的Cookie文件中。无论客户关闭了浏览器还是电脑，只要还在maxAge秒之前，登录网站时该Cookie仍然有效;
3，如果为负数，则表示该Cookie仅在本浏览器窗口以及本窗口打开的子窗口内有效，关闭窗口后该Cookie即失效。maxAge为负数的Cookie，为临时性Cookie，不会被持久化，不会被写到Cookie文件中。Cookie信息保存在浏览器内存中，因此关闭浏览器该Cookie就消失了;
4，如果maxAge为0，则表示删除该Cookie。Cookie机制没有提供删除Cookie的方法，因此通过设置该Cookie即时失效实现删除Cookie的效果。失效的Cookie会被浏览器从Cookie文件或者内存中删除：



### 例子
> Set-Cookie: sessionid=38afes7a8; HttpOnly; Path=/
> Set-Cookie: id=a3fWa; Expires=Wed，21 Oct 2015 07:28:00 GMT; Secure; HttpOnly



### 类别
* 会话期Cookie
	1）浏览器关闭之后它会被自动删除，不需要指定过期时间（**[color=#2b91e3]Expires[/color]）或者有效期（[color=#2b91e3]Max-Age[/color]**）;
    2）有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期Cookie也会被保留下来;

* 持久性Cookie
	指定一个特定的过期时间（**[color=#2b91e3]Expires[/color]）或有效期（[color=#2b91e3]Max-Age[/color]**）;

* Secure 和HttpOnly 标记
	1）安全的Cookie只应通过**[color=#2b91e3]HTTPS协议[/color]**加密过的请求发送给服务端;
	2）为避免跨域脚本 （XSS）攻击，通过JavaScript的 Document。cookie API无法访问带有 HttpOnly 标记的Cookie;

* 僵尸Cookie
	这类Cookie较难以删除，甚至删除之后会自动重建。它们一般是使用Web storage API、Flash本地共享对象或者其他技术手段来达到的


### 安全问题

* 会话劫持和XSS
* 跨站请求伪造（CSRF）


### Cookie的实现

* Javascript调用document。cookie

* 服务器发送
	1）服务器端在响应中利用**[color=#2b91e3]Set-Cookie header[/color]**来创建一个Cookie，发送给客户端;
	2）客户端将Cookie保存到某个目录下的文本文件内;
    3）如果客户端支持Cookie，下次请求同一网站时就可以Cookie直接发送给服务器;


### 优点:
1，能跟踪用户的整个会话，确定用户身份;
2，具有不可跨域名性[color=#b1b1b1]\（即使同一个父域也不行，但有办法实现）[/color];

### 缺点:
1，需要浏览器支持或者启用;
2，部分情况需要将数据编码[color=#b1b1b1]（Unicode字符在内存中占4个字符，而英文属于ASCII字符在内存中只占2个字节，前者如中文就需要编码，否则乱码）[/color];
3，每次请求都会发送该域名下的所有cookie，即使不需要用到;
4，修改、删除Cookie时，新建的Cookie除value、maxAge之外的所有属性，都要与原Cookie完全一样。否则，浏览器将视为两个不同的Cookie不予覆盖，导致修改、删除失败;
5，明文传递，不适合保存重要数据;
6，长度限制，不适合保存复杂数据;


## Web Storage
Html5提供了本地缓存功能**[color=#2b91e3]local storage[/color]和[color=#2b91e3]session storage[/color]**，这个不算http东西我就不说了，看看文档就懂。
优点:
1，良好的API，即拿即用，使用简单;
2，无需请求，节省宽带资源;
3，读取速度快;
4，session storage浏览器关闭就移除，适合临时数据;

缺点:
1，不适合储存改动频繁数据;
2，local storage或者用户手动移除，否则永远存在;
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]


## Session
如果说**[color=#2b91e3]Cookie[/color]技术是通过客户端来保持状态的解决方案，[color=#2b91e3]Session[/color]**技术则是通过服务器来保持状态的解决方案。
浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上。这就是Session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了，相当于做了一层个人档案。[color=#f4511e]而Session ID是唯一标识[/color]。
服务器会为每一个访问服务器的用户创建一个session对象，并且把session对象的id保存在本地cookie上，只要用户再次访问服务器时，带著session的id，服务器就会匹配用户在服务器上的session，根据session中的数据，还原用户上次的浏览状态或提供其他人性化服务。Session生成后，只要用户继续访问，服务器就会更新Session的最后访问时间，并维护该Session。用户每访问服务器一次，无论是否读写Session，服务器都认为该用户的Session**[color=#2b91e3]“活跃（active）”[/color]**了一次。为了解决大量session占用服务器资源的问题，可以设置一个超时设置，当用户活跃时间间隔超过超时设置，该session会被移除。
如果客户端浏览器将Cookie功能禁用，可以使用**[color=#2b91e3]URL地址重写[/color]，原理是将[color=#f4511e]该用户Session的id信息重写到URL地址中。服务器能够解析重写后的URL获取Session的id[/color]**。这样即使客户端不支持Cookie，也可以使用Session来记录用户状态

### 优点
1，使用比cookie方便;
2，能还原用户上次的浏览状态或提供其他人性化服务;

### 缺点
1，Session会占用服务器内存中，请求高压情况下有内存溢出的隐患;
2，需要cookie保存session的关联id[color=#b1b1b1]（能通过URL地址重写技术解决方案）[/color];

因为这个是服务器的东西，我接触不多，就说一些原理差不多了。
[color=#b1b1b1]（更多内容请自行查阅，本节到此为止了。）[/color]



# 缓存机制
读到这里大家应该也知道每次http请求要经过多少步骤涉及多少知识点了，在实际项目中请求往往是有相当数量的，但是其中有些请求是重复多余的，而这一节要讲的缓存就是为了这些请求而存在，http缓存机制在性能优化这一块尤为重要:
* 避免不必要的数据传输甚至不需要发送请求;
* 降低网络状况和距离时延影响，因为上一条;
* 减少服务器的压力，因为上两条;

## 总体流程如下
* 当浏览器在加载资源时，先根据这个资源的一些http header判断它是否命中**[color=#2b91e3]强制缓存[/color]**:
1）如果命中，浏览器直接从自己的缓存中读取资源，[color=#f4511e]流程结束[/color]；
2）如果没有命中，浏览器一定会发送一个请求到服务器;

* 服务器端收到请求之后依据资源的另外一些http header验证这个资源是否命中**[color=#2b91e3]协商缓存[/color]**:
1）如果命中，服务器会返回对应状态码，但是不会返回这个资源的数据，而是让客户端直接从缓存中加载这个资源，[color=#f4511e]流程结束[/color]；
2）如果没有命中，浏览器直接从服务器加载最新资源数据，[color=#f4511e]流程结束[/color];


## Pragma（~~可抛弃不说~~）
客户端不对该资源读取缓存，即每次都得向服务器发一次请求才行。Pragma属于通用首部字段，在客户端上使用时，常规要求我们往html上加上这段meta元标签（仅对该页面有效，对页面上的资源无效），优先级高于**[color=#2b91e3]Cache-Control[/color]**：
```html:
<meta http-equiv="Pragma" content="no-cache">
```


**缺点:**
1）仅有IE才能识别这段meta标签含义，但并不一定会在请求字段加上Pragma，不过的确会让当前页面每次都发新请求;


## 强制缓存
### Expires

指定了一个日期/时间，必须是**[color=#2b91e3]格林威治时间（GMT）[/color]**，在这个日期/时间之后，HTTP响应被认为是过时的；无效的日期，比如 0，代表著一个过去的事件，即该资源已经过期了。

**缺点**:
    1）时间是由服务器发送的，和客户端时间不一定一致，无法用于精确度高的需求;
    2）如果同时设置了 **[color=#2b91e3]"max-age"[/color] 或者 [color=#2b91e3]"s-max-age"[/color]** 指令的Cache-Control响应头，那么Expires头就会被忽略;
    3）过期之前即使资源修改了也依旧使用旧资源，非即时性缓存，强制缓存通病;


### Cache-Control
在http请求和响应中通过指定指令来实现缓存机制。缓存指令是单向的，这意味著在请求设置的指令，在响应中不一定包含相同的指令。

**优点**:
    1）以时间间隔标识失效时间，避免服务器和客户端相对时间的问题;
    2）灵活的自定义配置选项;

**缺点**:
    1）HTTP 1.1 才有的内容，不适用于HTTP 1.0;
    2）过期之前即使资源修改了也依旧使用旧资源，非即时性缓存，强制缓存通病;

### 缓存
|字段名|描述|
|-|-|
|public | 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存。|
| private| 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。|
|no-cache | 告诉浏览器、缓存服务器，不管本地副本是否过期，使用资源副本前，一定要到源服务器进行副本有效性校验|
|only-if-cached| 表明客户端只接受已缓存的响应，并且不要向原始服务器检查是否有更新的拷贝|

### 到期
|字段名|描述|
|-|-|
|max-age=秒 | 设置缓存存储的最大周期，超过这个时间缓存被认为过期（单位秒）。与Expires相反，时间是相对于请求的时间。如果和Last-Modified一起使用时，优先级较高|
| s-maxage=秒| 覆盖max-age 或者 Expires 头，但是仅适用于共享缓存（比如各个代理），并且私有缓存中它被忽略。|
|max-stale（=<秒>）| 表明客户端愿意接收一个已经过期的资源。可选的设置一个时间（单位秒），表示响应不能超过的过时时间。|
|min-fresh=秒| 表示客户端希望在指定的时间内获取最新的响应。|

### 重新验证加载
|字段名|描述|
|-|-|
|must-revalidate | 告诉浏览器、缓存服务器，本地副本过期前，可以使用本地副本；本地副本一旦过期，必须去源服务器进行有效性校验|
|proxy-revalidate| 与must-revalidate作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。|
|immutable | 表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如If-None-Match或If-Modified-Since）来检查更新，即使用户显式地刷新页面。在Firefox中，immutable只能被用在 https:// transactions。|

### 其他
|字段名|描述|
|-|-|
|no-store | 缓存不应存储有关客户端请求或服务器响应的任何内容。|
|no-transform| 不得对资源进行转换或转变。Content-Encoding，Content-Range，Content-Type等HTTP头不能由代理修改。例如，非透明代理可以对图像格式进行转换，以便节省缓存空间或者减少缓慢链路上的流量。no-transform指令不允许这样做。|
例如缓存静态资源可以这么设置
> Cache-Control:public，max-age=30*24*60*60*1000

### 交互
|动作|结论|
|-|-|
|打开新窗口 |如果指定cache-control的值为private、no-cache、must-revalidate，那么打开新窗口访问时都会重新访问服务器。而如果指定了max-age值，那么在此值内的时间里就不会重新访问服务器，例如：Cache-control: max-age=5 表示当访问此网页后的5秒内不会去再次访问服务器。|
| 在地址栏回车| 如果值为private或must-revalidate，则只有第一次访问时会访问服务器，以后就不再访问。如果值为no-cache，那么每次都会访问。如果值为max-age，则在过期之前不会重复访问。|
|按后退按扭 | 如果值为private、must-revalidate、max-age，则不会重访问，而如果为no-cache，则每次都重复访问。|
| 按刷新按扭| 无论为何值，都会重复访问。|



## 协商缓存
### Last-Modified && If-Modified-Since
服务器在响应请求时，告诉浏览器资源的最后修改时间**[color=#2b91e3]Last-Modified[/color]。之后客户再次请求时可以通过[color=#2b91e3]If-Modified-Since[/color]请求头提供一个日期，该请求将被视为一个条件GET，只有改动时间迟于指定时间的文档才会返回，否则返回一个[color=#2b91e3]304（Not Modified）状态[/color]**。Last-Modified也可用setDateHeader方法来设置。

**优点**:
    1）如果资源修改了服务器就会返回最新资源;
    2）如果资源没修改服务器就只返回304（Not Modified）状态码，节省不必要的数据传输;

**缺点**:
    1）文档的最后改动不意味著实际内容有改动，这时候的缓存是不起作用了;
    2）**[color=#2b91e3]If-Modified-Since[/color]能检查到的粒度是[color=#2b91e3]s[/color]**级的，无法识别一秒内进行多次修改的情况;
    3）某些服务器不能精确的得到文件的最后修改时间;
    4）一定会发送请求，协商缓存通病;

### ETag && If-None-Match
ETag一般不以明文形式相应给客户端。在资源的各个生命周期中，它都具有不同的值，用于标识出资源的状态。当资源发生变更时，如果其头信息中一个或者多个发生变化，或者消息实体发生变化，那么ETag也随之发生变化。Etag由服务器端生成，客户端通过**[color=#2b91e3]If-Match[/color]或者说[color=#2b91e3]If-None-Match[/color]**这个条件判断请求来验证资源是否修改。

**优点**:
    1）Etag是根据资源内容计算出来的，比单纯比较资源最后修改时间的做法精确度高得多;
    2）能识别一秒内进行多次修改的情况;
    3）Etag可以综合Inode，MTime和Size避免某些服务器不能精确的得到文件的最后修改时间这个问题;

**缺点**:
    1）分布式服务器存储的情况下，计算ETag的算法如果不一样，会导致浏览器从一台服务器上获得页面内容后到另外一台服务器上进行验证时发现ETag不匹配的情况;
    2）ETag不管怎么样的算法，在服务器端都要进行计算，计算就有开销，会带来性能损失;
    3）一定会发送请求，协商缓存通病;


### 总结流程图
因为Cache-Control自定义配置效果太多，就一笔带过了，大家知道就好。
![图片描述](attimg://article/content/picture/201804/15/213503d6277b6f2fjjsfcj.png)
![图片描述](attimg://article/content/picture/201804/09/220231bkqk94n82n6n804s.png)



## 浏览器缓存文件
浏览器为了提高性能，一般会在脚本，图片等文件解析执行之后直接存进内存缓存中，刷新页面的时候直接读取出来[color=#b1b1b1]（from memory cache）[/color]，css文件会存进硬盘文件中，所以每次渲染页面都需要从硬盘读取[color=#b1b1b1]（from disk cache）[/color]。

* 内存缓存: 快速读取，进程关闭清空
* 硬盘缓存: 需要对硬盘文件进行I/O操作，然后重新解析内容，读取相对复杂缓慢
