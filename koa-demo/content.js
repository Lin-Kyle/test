const Koa = require('koa'),
    app = new Koa();

app.use(async ctx => {
    console.log(ctx);
});

app.use(async ctx => {
    ctx.body = '暗号：Hello World';
}).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');

switch (ctx.accepts('json', 'html', 'text')) {
    case 'json':
        ctx.response.type = 'json';
        ctx.response.body = '<data>json</data>';
        break;
    case 'html':
        ctx.response.type = 'html';
        ctx.response.body = '<data>html</data>';
        break;
    case 'text':
        ctx.response.type = 'text';
        ctx.response.body = '<data>text</data>';
        break;
    default:
        ctx.throw(406, 'json, html, or text only');
}
