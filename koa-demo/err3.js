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
