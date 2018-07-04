const Koa = require('koa'),
    app = new Koa();

// 一层中间
app.use(async (ctx, next) => {
    console.log( '请求资源：' + ctx.url);
    console.log('一层中间件控制传递下去');
    await next();
    console.log('一层中间件控制传递回来');
});

// 二层中间
app.use(async (ctx, next) => {
    console.log('二层中间件控制传递下去');
    await next();
    console.log('一层中间件控制传递回来');
});

// response
app.use(async ctx => {
    ctx.body = '暗号：Hello World';
});

app.listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
// 请求资源：/
// 一层中间件控制传递下去
// 二层中间件控制传递下去
// 一层中间件控制传递回来
// 一层中间件控制传递回来
// 请求资源：/favicon.ico
// 一层中间件控制传递下去
// 二层中间件控制传递下去
// 一层中间件控制传递回来
// 一层中间件控制传递回来
