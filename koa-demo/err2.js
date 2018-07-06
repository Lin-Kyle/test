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
