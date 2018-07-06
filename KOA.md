##官网介绍
koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。 使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套， 并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。


##前期准备
我们首先安装一些必要库先，根据个人选择可以使用yarn，cnpm，或者npm都行。
KOA框架
yarn add koa

这还不够，因为 Koa 依赖 node v7.6.0 或 ES2015 及更高版本和 async 方法支持.根据需要安装
[Babel register](https://babel.bootcss.com/docs/usage/babel-register/)
transform-async-to-generator 或 transform-async-to-module-method

因为我用到Nodejs10，不需要安装这些。



##简单入门
惯例拿创建服务器作为一个框架的入门例子。
const Koa = require('koa'),
    app = new Koa();

app.use(async ctx => {
    ctx.body = '暗号：Hello World';
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');




##级联
Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。
当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。（用一种比较相似的比喻就是事件捕捉到事件冒泡的过程）。

const Koa = require('koa'),
    app = new Koa();

// 一层中间
app.use(async (ctx, next) => {
    console.log('请求资源：' + ctx.url);
    console.log('一层中间件控制传递下去');
    await next();
    console.log('一层中间件控制传递回来');
});

// 二层中间
app.use(async (ctx, next) => {
    console.log('二层中间件控制传递下去');
    await next();
    console.log('二层中间件控制传递回来');
});

// response
app.use(async ctx => {
    console.log('输出body');
    ctx.body = '暗号：Hello World';
});

app.listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

// 一层中间件控制传递下去
// 二层中间件控制传递下去
// 输出body
// 二层中间件控制传递回来
// 一层中间件控制传递回来


从上面结果可以看出每请求一次资源都会经过所有中间件，利用 async 语句操控控制权流向传递。




##上下文(Context)
Koa Context 将 node 的 request 和 response 对象封装到单个对象中，每个请求都将创建一个 Context，并在中间件中作为接收器引用，或者 ctx 标识符，许多上下文的访问器和方法直接委托给它们的 ctx.request 或 ctx.response。
我们可以直接打印出来ctx对象看看有什么。
const Koa = require('koa'),
    app = new Koa();

// response
app.use(async ctx => {
    console.log('ctx：', ctx);
});

app.listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

// {
//     request: {//koa 的 Request 对象
//         method: 'GET',
//         url: '/',
//         header: {
//             host: 'localhost:3000',
//             connection: 'keep-alive',
//             pragma: 'no-cache',
//             'cache-control': 'no-cache',
//             'upgrade-insecure-requests': '1',
//             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
//             accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//             'accept-encoding': 'gzip, deflate, sdch',
//             'accept-language': 'zh-CN,zh;q=0.8',
//             cookie: 'loginInfo={"username":"abc","password":"MjIyMjIy","rememberMe":1}'
//         }
//     },
//     response: {//koa 的 Response 对象.
//         status: 404,
//         message: 'Not Found',
//         header: {}
//     },
//     app: {//应用程序实例引用
//         subdomainOffset: 2,
//         proxy: false,
//         env: 'development'
//     },
//     originalUrl: '/',
//     req: '<original node req>',//Node的request 对象
//     res: '<original node res>',//Node的response 对象.
//     socket: '<original node socket>'
// }


##请求(Request)
Koa Request 对象是在 node 的 vanilla 请求对象之上的抽象，提供了诸多对 HTTP 服务器开发有用的功能。Koa的 Request 对象包括由 accepts 和 negotiator 提供的有用的内容协商实体。
* request.accepts(types)
* request.acceptsEncodings(types)
* request.acceptsCharsets(charsets)
* request.acceptsLanguages(langs)

如果没有提供类型，则返回 所有 可接受的类型。
如果提供多种类型，将返回最佳匹配。
如果没有找到匹配项，则返回一个false，
因为用法都一个样，挑选一个来讲解。

###request.accepts(types)
检查给定的类型是否可以接受，type 值可能是一个或多个 mime 类型的字符串或数组，如果可以就返回最佳匹配类型字符串，否则返回false。

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


实际开发中需要更多不同的处理细节，所以我们可以把内容设置成模板引用。
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>

    </body>
</html>


const Koa = require('koa'),
    fs = require('fs'),
    app = new Koa();

app.use(async ctx => {
    switch (ctx.accepts('json', 'html', 'text')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = fs.createReadStream('./template.html');
            break;
        default:
            ctx.throw(406, 'json, html, or text only');
    }
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');


##路由
其实我们上面的代码已经是原始路由的用法了，我们增加请求资源的判断就可以了，另外新增一个index.html模板切换看效果
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>
    <p>没错，我就是首页</p>
</body>

</html>

然后我们去掉类型判断等代码，直接写死html即可，不然默认为空，打开页面会触发下载的。
const Koa = require('koa'),
    fs = require('fs'),
    app = new Koa();

app.use(async ctx => {
    console.log('type: ' + ctx.type);
    switch (ctx.url) {
        case '/':
            ctx.type = 'html';
            ctx.body = fs.createReadStream('./index.html');
            break;
        case '/template':
            ctx.body = fs.createReadStream('./template.html');
            break;
        default:
            ctx.throw(406, 'json, html, or text only');
    }
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
执行脚本之后会默认看到index.html模板内容，手动换成http://127.0.0.1:3000/template在Chrome会看到下载弹窗，其他浏览器没试过。


实际开发我们不会这么繁琐区别路由，上面说过koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库。所以我们需要安装一个路由中间件 [koa-route3.2.0](https://www.npmjs.com/package/koa-route) ，上次推送已经是两年前了，如果不是放弃维护就是已经很稳定了。
yarn add koa-route
如果你需要使用完整特性的路由库可以看 [koa-router](https://github.com/alexmingoia/koa-router)
这里简单展示 koa-route 用法。

const Koa = require('koa'),
    _ = require('koa-route'),
    fs = require('fs'),
    app = new Koa();

const pets = {
    index: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./index.html');
    },
    template: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./template.html');
    }
};

app.use(_.get('/', pets.index)).use(_.get('/template', pets.template)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');



##错误处理
>100 "continue"
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

###状态码错误
有两种写法，ctx.throw(状态码)或者ctx.status = 状态码，它们都会自动返回默认文字信息区别在于后者能通过ctx.body设置返回信息。

const Koa = require('koa'),
    _ = require('koa-route'),
    app = new Koa();

const pets = {
    '403': (ctx) => {
        //doSomethings
        ctx.throw(403);
        ctx.body = '403';
    },
    '404': (ctx) => {
        //doSomethings
        ctx.status = 404;
        ctx.body = `<p>404啦！</p>`;
    }
};

app.use(_.get('/', pets['403'])).use(_.get('/404', pets[404])).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');


##错误监听
const Koa = require('koa'),
    _ = require('koa-route'),
    app = new Koa();

const pets = {
    index: (ctx) => {
        //doSomethings
        ctx.throw(500);
    }
};

app.on('error', (err, ctx) => console.error('error', err)).use(_.get('/', pets.index)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');


###错误捕捉
你也能直接使用try...catch()直接处理，但是错误监听不会接收到错误信息。
const Koa = require('koa'),
    app = new Koa();

const err = async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = 404;
            ctx.body = `<p>404啦！</p>`;
        }
    },
    index = ctx => {
        ctx.throw(500);
    };

app.use(err).use(index).on('error', function(err) {
    console.error('error', err)
}).listen(3000);
如果想同时触发错误监听，KOA提供了emit方法。
const Koa = require('koa'),
    app = new Koa();

const err = async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = 404;
            ctx.body = `<p>404啦！</p>`;
            ctx.app.emit('error', err, ctx);
        }
    },
    index = ctx => {
        ctx.throw(500);
    };

app.use(err).use(index).on('error', function(err) {
    console.error('error', err)
}).listen(3000);




##静态资源
聪明的人在上面代码就能看出一些问题，我们现在还是通过url判断返回页面，如果是其他静态资源如图片那些又怎么办？
我们可以安装依赖库[koa-static5.0.0](https://www.npmjs.com/package/koa-static)，
yarn add koa-static
require('koa-static')(root, opts)
通过设置根目录和可选项会配置静态资源查找路径，我们先创建一个img目录存放一张图片，然后在inded.html引用，再甚至路径serve(__dirname + '/img/')，它会自动到指定目录下查找资源。

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


const Koa = require('koa'),
    _ = require('koa-route'),
    serve = require('koa-static'),
    fs = require('fs'),
    app = new Koa();

const pets = {
    index: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./index.html');
    },
    template: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./template.html');
    }
};
app.use(serve(__dirname + '/img/')).use(_.get('/', pets.index)).use(_.get('/template', pets.template)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

如果你还是有些不懂的话修改下路径，serve(__dirname)，然后图片地址换成<img src="./img/1.gif" />。你就看到还是能找到对应资源。


##中间件管理
随着项目开发你可能会越要安装越来越多的中间件，所有可以使用[koa-compose](https://www.npmjs.com/package/koa-compose)做中间件管理。
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



##请求处理
我们处理请求的时候可以用[koa-body](https://www.npmjs.com/package/koa-body)解析请求体。
> A full-featured koa body parser middleware. Support multipart, urlencoded and json request bodies. Provides same functionality as Express's bodyParser - multer. And all that is wrapped only around co-body and formidable.

> 一个功能丰富的body解析中间件，支持多部分，urlencoded，json请求体，提供Express里bodyParse一样的函数方法
直接安装依赖
yarn add koa-body

新建一个提交页面
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


可以输出格式看看效果
const Koa = require('koa'),
    koaBody = require('koa-body'),
    _ = require('koa-route'),
    fs = require('fs'),
    app = new Koa();

const pets = {
    index: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./upload.html');
    }
};

app.use(koaBody()).use(_.get('/', pets.index)).use(_.post('/upload', ctx => {
    console.log(ctx.request.body);
    ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
})).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
