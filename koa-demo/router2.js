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
