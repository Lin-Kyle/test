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
