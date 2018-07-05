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
使用 async 功能，我们可以实现 “真实” 的中间件。当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。（用一种比较相似的比喻就是事件捕捉到事件冒泡的过程）。

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
