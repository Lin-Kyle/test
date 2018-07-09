##完整Demo地址
裏面demo都是自己寫的，保證能跑，至於環境問題我就不敢保證了。懶得寫就去上面搬走看，懶得搬就直接看文章，大部分代碼連輸出信息都給你們了。
[koa-demo](https://github.com/Lin-Kyle/koa-demo)


## 官网介绍
[color=#ec7379]koa[/color] 是由 [color=#ec7379]Express[/color] 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。 使用 koa 编写 web 应用，通过组合不同的 [color=#ec7379]generator[/color]，可以免除重复繁琐的回调函数嵌套， 并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。


## 前期准备
我们首先安装一些必要库先，根据个人选择可以使用yarn，cnpm，或者npm都行。
> KOA框架
yarn add koa

这还不够，因为 Koa 依赖 [color=#ff4753]node v7.6.0[/color] 或 [color=#ff4753]ES2015及更高版本[/color]和 [color=#ff4753]async[/color] 方法支持.你们可以根据自身需要安装
> [Babel register](https://babel.bootcss.com/docs/usage/babel-register/)
transform-async-to-generator 或 transform-async-to-module-method

因为我用到 Nodejs10.0，所以不需要安装这些东西，就不说了。



##简单入门
惯例拿创建应用程序作为一个框架的入门例子。
```javascript
const Koa = require('koa'),
    app = new Koa();
//爲了這裏格式換行
app.use(async ctx => {
    ctx.body = '暗号：Hello World';
}).listen(3000);
//爲了這裏格式換行
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
```
代码一目了然，不廢話了。
LS1



## Favicon.ico
所谓 [color=#ec7379]favicon[/color]，即 [color=#ec7379]Favorites Icon[/color] 的缩写，顾名思义，便是其可以让浏览器的收藏夹中除显示相应的标题外，还以图标的方式区别不同的网站。当然，这不是Favicon的全部，根据浏览器的不同，Favicon显示也有所区别：在大多数主流浏览器如FireFox和Internet Explorer (5.5及以上版本)中，favicon不仅在收藏夹中显示，还会同时出现在地址栏上，这时用户可以拖曳favicon到桌面以建立到网站的快捷方式；除此之外，标签式浏览器甚至还有不少扩展的功能，如FireFox甚至支持动画格式的favicon等。
問題在於這裡代碼浏览器会自動發起请求网站根目录的这个图标，干擾測試，所以接下來的打印結果大家無視Favicon.ico請求就好。



## 级联
Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。
当一个中间件调用 [color=#ec7379]next()[/color] 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。（用一种比较相似的比喻就是中間件相當於一次DOM事件，從事件捕捉到事件冒泡的过程）。

```javascript
const Koa = require('koa'),
    app = new Koa();

// 一层中间件
app.use((ctx, next) => {
    console.log('请求资源：' + ctx.url);
    console.log('一层中间件控制传递下去');
    next();
    console.log('一层中间件控制传递回来');
    ctx.body = '暗号：Day Day Up';
});

// 二层中间件
app.use((ctx, next) => {
    console.log('二层中间件控制传递下去');
    next();
    console.log('二层中间件控制传递回来');
});

// response
app.use(ctx => {
    console.log('输出body');
    ctx.body = '暗号：Good Good Study';
});

app.listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

// 一层中间件控制传递下去
// 二层中间件控制传递下去
// 输出body
// 二层中间件控制传递回来
// 一层中间件控制传递回来

```
LS2


从上面结果可以看出每请求一次资源都会经过所有中间件，並且在執行到最尾部中間件時候會將控制權反向傳遞，輸出結果是頭部的body覆蓋尾部的body。
說實話沒試過這種方式，有點不習慣。




##上下文(Context)
[color=#ec7379]Koa Context[/color] 将 [color=#ec7379]Nodejs[/color] 的 [color=#ec7379]request[/color] 和 [color=#ec7379]response[/color] 对象封装到单个对象中，每个请求都将创建一个 [color=#ec7379]Context[/color]，并在中间件中作为接收器引用，或者 [color=#ec7379]ctx[/color] 标识符，许多上下文的访问器和方法直接委托给它们的 [color=#ec7379]ctx.request[/color] 或 [color=#ec7379]ctx.response[/color]。
我们可以直接打印出来ctx对象看看有什么。
```javascript
const Koa = require('koa'),
    app = new Koa();

// response
app.use(async ctx => {
    console.log('ctx：', ctx);
);

app.listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

// ctx： { request:
//    { method: 'GET',
//      url: '/',
//      header:
//       { host: 'localhost:3000',
//         connection: 'keep-alive',
//         'cache-control': 'max-age=0',
//         'upgrade-insecure-requests': '1',
//         'user-agent':
//          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
//         accept:
//          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//         'accept-encoding': 'gzip, deflate, sdch',
//         'accept-language': 'zh-CN,zh;q=0.8',
//         cookie:
//          'loginInfo={"username":"abc","password":"MjIyMjIy","rememberMe":1}' } },
//   response: { status: 404, message: 'Not Found', header: {} },
//   app: { subdomainOffset: 2, proxy: false, env: 'development' },
//   originalUrl: '/',
//   req: '<original node req>',
//   res: '<original node res>',
//   socket: '<original node socket>' }

```
LS3

## 请求(Request)
Koa Request 对象是在 node 的 vanilla 请求对象之上的抽象，提供了诸多对 HTTP 服务器开发有用的功能。Koa的 Request 对象包括由 accepts 和 negotiator 提供的有用的内容协商实体。
* request.accepts(types)
* request.acceptsEncodings(types)
* request.acceptsCharsets(charsets)
* request.acceptsLanguages(langs)

1，如果没有提供类型，则返回所有可接受的类型；
2，如果提供多种类型，将返回最佳匹配；
3，如果没有找到匹配项，则返回一个false；
因为用法都一个样，挑选一个来讲解。

### request.accepts(types)
检查给定的类型是否可以接受，type 值可能是一个或多个 mime 类型的字符串或数组，如果可以就返回最佳匹配类型字符串，否则返回false。
```javascript
const Koa = require('koa'),
    app = new Koa();

app.use(async ctx => {
    switch (ctx.accepts('json', 'html', 'text')) {
        case 'json':
            ctx.type = 'json';
            ctx.body = '<p>匹配类型json</p>';
            break;
        case 'html':
            ctx.type = 'html';
            ctx.body = '<p>匹配类型html</p>';
            break;
        case 'text':
            ctx.type = 'text';
            ctx.body = '<p>匹配类型text</p>';
            break;
        default:
            ctx.throw(406, 'json, html, or text only');
    }
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
```
LS4


实际开发中需要更多不同的处理细节，所以我们可以把内容设置成模板template1.html引用。
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>
    <p>匹配类型html</p>
</body>

</html>

```
TP1
```javascript
const Koa = require('koa'),
    fs = require('fs'),
    app = new Koa();

app.use(async ctx => {
    switch (ctx.accepts('json', 'html', 'text')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = fs.createReadStream('./template1.html');
            break;
        default:
            ctx.throw(406, 'json, html, or text only');
    }
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

```
LS5


## 路由
其实我们上面的代码已经是原始路由的用法了，我们增加请求资源的判断就可以了，另外新增一个template2.html模板切换看效果
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>
    <p>template2</p>
</body>

</html>

```
TP2
然后我们去掉类型判断等代码看效果，直接写死html即可，不然type默认为空，打开页面会触发下载的，不信你們去掉設置類型那行代碼看看。
```javascript
const Koa = require('koa'),
    fs = require('fs'),
    app = new Koa();

app.use(async ctx => {
    console.log('type: ' + ctx.type);
    switch (ctx.url) {
        case '/':
            ctx.type = 'html';
            ctx.body = fs.createReadStream('./template1.html');
            break;
        case '/template2':
            ctx.type = 'html';
            ctx.body = fs.createReadStream('./template2.html');
            break;
        default:
            ctx.throw(406, 'json, html, or text only');
    }
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

```
LS6
执行脚本之后会默认看到template2.html模板内容，手动换成http://127.0.0.1:3000/template2在Chrome会看到下载弹窗，其他浏览器没试过。


实际开发我们不会这么繁琐的去区分路由，上面说过 koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库，所以我们需要安装一个路由中间件。
 [koa-route3.2.0](https://www.npmjs.com/package/koa-route) ，上次推送已经是两年前了，如果不是放弃维护就是已经很稳定了。
yarn add koa-route
如果你需要使用完整特性的路由库可以看 [koa-router](https://github.com/alexmingoia/koa-router)
这里简单展示 koa-route 用法。
```javascript
const Koa = require('koa'),
    _ = require('koa-route'),
    fs = require('fs'),
    app = new Koa();

const route = {
    index: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./template1.html');
    },
    template2: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./template2.html');
    }
};

app.use(_.get('/', route.index)).use(_.get('/template2', route.template2)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
```
LS7


## 响应状态
如果代码运行过程中发生错误，我们需要把错误信息返回给用户。
```
ctx.throw([status], [msg], [properties])
 ```
 等價于
 ```
const err = new Error(msg);
err.status = status;
err.expose = true;
throw err;
 ```
 注意：这些是用户级错误，并用 err.expose 标记，这意味着消息适用于客户端响应，这通常不是错误消息的内容，因为您不想泄漏故障详细信息。
> 100 "continue"
101 "switching protocols"
102 "processing"
200 "ok"
201 "created"
202 "accepted"
203 "non-authoritative information"
204 "no content"
205 "reset content"
206 "partial content"
207 "multi-status"
208 "already reported"
226 "im used"
300 "multiple choices"
301 "moved permanently"
302 "found"
303 "see other"
304 "not modified"
305 "use proxy"
307 "temporary redirect"
308 "permanent redirect"
400 "bad request"
401 "unauthorized"
402 "payment required"
403 "forbidden"
404 "not found"
405 "method not allowed"
406 "not acceptable"
407 "proxy authentication required"
408 "request timeout"
409 "conflict"
410 "gone"
411 "length required"
412 "precondition failed"
413 "payload too large"
414 "uri too long"
415 "unsupported media type"
416 "range not satisfiable"
417 "expectation failed"
418 "I'm a teapot"
422 "unprocessable entity"
423 "locked"
424 "failed dependency"
426 "upgrade required"
428 "precondition required"
429 "too many requests"
431 "request header fields too large"
500 "internal server error"
501 "not implemented"
502 "bad gateway"
503 "service unavailable"
504 "gateway timeout"
505 "http version not supported"
506 "variant also negotiates"
507 "insufficient storage"
508 "loop detected"
510 "not extended"
511 "network authentication required"

### 状态码错误
有两种写法，ctx.throw(状态码) 或者 ctx.status = 状态码 ，它们都会自动返回默认文字信息，区别在于兩者设置返回信息的方式。
注意：默认情况下，response.status 设置为 404 而不是像 node 的 res.statusCode 那样默认为 200。
```javascript
const Koa = require('koa'),
    _ = require('koa-route'),
    app = new Koa();

const router = {
    '403': (ctx) => {
        //doSomethings
        ctx.throw(403, '403啦！');
    },
    '404': (ctx) => {
        //doSomethings
        ctx.status = 404;
        ctx.body = `<p>404啦！</p>`;
    }
};

app.use(_.get('/403', pets[403])).use(_.get('/404', pets[404])).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

```
LS8
你們可以分別打開 http://localhost:3000/403 和 http://localhost:3000/404 看輸出結果。


## 错误监听
```javascript
const Koa = require('koa'),
    _ = require('koa-route'),
    app = new Koa();

const router = {
    index: (ctx) => {
        //doSomethings
        ctx.throw(500, '我是故意的！');
    }
};

app.use(_.get('/', router.index)).on('error', (err, ctx) => {
    console.error('error', err);
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');


/*error { InternalServerError: 我是故意的！
    at Object.throw (C:\project\test\koa-demo\node_modules\koa\lib\context.js:93:11)
    at Object.index (C:\project\test\koa-demo\lesson9.js:8:18)
    at C:\project\test\koa-demo\node_modules\koa-route\index.js:39:44
    at dispatch (C:\project\test\koa-demo\node_modules\koa-compose\index.js:42:32)
    at C:\project\test\koa-demo\node_modules\koa-compose\index.js:34:12
    at Application.handleRequest (C:\project\test\koa-demo\node_modules\koa\lib\application.js:150:12)
    at Server.handleRequest (C:\project\test\koa-demo\node_modules\koa\lib\application.js:132:19)
    at Server.emit (events.js:182:13)
    at parserOnIncoming (_http_server.js:654:12)
    at HTTPParser.parserOnHeadersComplete (_http_common.js:109:17) message: '我是故意的！' }*/
```
LS9

### 错误捕捉
你也能直接使用try...catch()直接处理，但是错误监听就不会再接收該错误信息。
```javascript
const Koa = require('koa'),
    app = new Koa();

const err = async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = 404;
            ctx.body = `<p>你看看終端有沒打印錯誤！</p>`;
        }
    },
    index = ctx => {
        ctx.throw(500);
    };

app.use(err).use(index).on('error', function(err) {
    console.error('error', err)
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

```
LS10
注意，這裡的錯誤處理如果使用ctx.throw()方法的話能被“error”事件監聽到，不是因為該方法會再拋出新的錯誤。
```
const Koa = require('koa'),
    app = new Koa();

const err = async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.throw(404, '你看看終端有沒打印錯誤！');
        }
    },
    index = ctx => {
        ctx.throw(500);
    };

app.use(err).use(index).on('error', function(err) {
    console.error('error', err)
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
```
LS11
如果想同时触发错误监听，KOA也提供了emit方法可以實現。
```javascript
const Koa = require('koa'),
    app = new Koa();

const err = async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = 404;
            ctx.body = `<p>你看看終端有沒打印錯誤！</p>`;
            ctx.app.emit('error', err, ctx);
        }
    },
    index = ctx => {
        ctx.throw(500);
    };

app.use(err).use(index).on('error', function(err) {
    console.error('error', err)
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

// error { InternalServerError: Internal Server Error
//     at Object.throw (C:\project\test\koa-demo\node_modules\koa\lib\context.js:93:11)
//     at index (C:\project\test\koa-demo\lesson12.js:14:18)
//     at dispatch (C:\project\test\koa-demo\node_modules\koa-compose\index.js:42:32)
//     at err (C:\project\test\koa-demo\lesson12.js:6:19)
//     at dispatch (C:\project\test\koa-demo\node_modules\koa-compose\index.js:42:32)
//     at C:\project\test\koa-demo\node_modules\koa-compose\index.js:34:12
//     at Application.handleRequest (C:\project\test\koa-demo\node_modules\koa\lib\application.js:150:12)
//     at Server.handleRequest (C:\project\test\koa-demo\node_modules\koa\lib\application.js:132:19)
//     at Server.emit (events.js:182:13)
//     at parserOnIncoming (_http_server.js:654:12) message: 'Internal Server Error' }

```
LS11



## 静态资源
聪明的人在上面代码就能看出一些问题，還記得我們說過忽略Favicon.ico的請求麼。我們不僅僅有頁面的請求，還有其他資源的請求。
我们现在还是通过url判断返回页面，如果是其他静态资源如图片那些又怎么办？這裡介紹一下依赖库[koa-static5.0.0](https://www.npmjs.com/package/koa-static)，
yarn add koa-static
require('koa-static')(root, opts)
通过设置根目录和可选项会配置静态资源查找路径，我们先创建一个img目录存放一张图片，然后在template3.html引用，再設置路径require('koa-static')(__dirname + '/img/')，它会自动到指定目录下查找资源。
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>
    <p>没错，我就是首页</p>
    <img src="./1.gif" />
</body>

</html>

```
TP3
```javascript
const Koa = require('koa'),
    _ = require('koa-route'),
    serve = require('koa-static')(__dirname + '/img/'),
    fs = require('fs'),
    app = new Koa();

const router = {
    index: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./template3.html');
    }
};
app.use(serve).use(_.get('/', router.index)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

```
LS13
如果你还是有些不懂的话修改下路径，require('koa-static')(__dirname)，然后图片地址换成<img src="./img/1.gif" />。你就看到还是能找到对应资源。


## 中间件管理
随着项目开发你可能会越要安装越来越多的中间件，所有可以使用[koa-compose](https://www.npmjs.com/package/koa-compose)做中间件管理。這個很多庫都有類似的中間件，用於簡化中間件的使用。
上面我們用來講解 koa 級聯的那個例子可以直接拿來修改使用。
```javascript
const Koa = require('koa'),
    compose = require('koa-compose'),
    app = new Koa();

// 一层中间
const mid1 = (ctx, next) => {
    console.log('请求资源：' + ctx.url);
    console.log('一层中间件控制传递下去');
    next();
    console.log('一层中间件控制传递回来');
};

// 二层中间
const mid2 = (ctx, next) => {
    console.log('二层中间件控制传递下去');
    next();
    console.log('二层中间件控制传递回来');
};

// response
const mid3 = ctx => {
    console.log('输出body');
    ctx.body = '暗号：Hello World';
};

app.use(compose([mid1, mid2, mid3])).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
// 请求资源：/
// 一层中间件控制传递下去
// 二层中间件控制传递下去
// 输出body
// 二层中间件控制传递回来
// 一层中间件控制传递回来
```
LS14
可以看出大概原理就是把引用多個中間件的使用方式改成將多個中間件組裝成一個使用。


## 请求处理
我们处理请求的时候可以用 [koa-body](https://www.npmjs.com/package/koa-body) 解析请求体。
> A full-featured koa body parser middleware. Support multipart, urlencoded and json request bodies. Provides same functionality as Express's bodyParser - multer. And all that is wrapped only around co-body and formidable.

> 一个功能丰富的body解析中间件，支持多部分，urlencoded，json请求体，提供Express里bodyParse一样的函数方法

直接安装依赖
yarn add koa-body

新建一个提交页面
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>
    <form class="" action="/upload" method="post">
        <input type="text" name="name" value="">
        <button type="submit" name="button">提交</button>
    </form>
</body>

</html>

```
TP4

可以输出格式看看效果
```javascript
const Koa = require('koa'),
    koaBody = require('koa-body'),
    _ = require('koa-route'),
    fs = require('fs'),
    app = new Koa();

const router = {
        index: (ctx) => {
            //doSomethings
            ctx.type = 'html';
            ctx.body = fs.createReadStream('./template4.html');
        }
    },
    upload = ctx => {
        console.log(ctx.request.body);
        ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
    };

app.use(koaBody()).use(_.get('/', router.index)).use(_.post('/upload', upload)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

```
LS15
提交內容之後在頁面和終端都能看到body內容。
