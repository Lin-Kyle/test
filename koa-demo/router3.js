const Koa = require('koa'),
    _ = require('koa-route'),
    serve = require('koa-static'),
    fs = require('fs'),
    app = new Koa();

const pets = {
    index: (ctx) => {
        //doSomethings
        ctx.redirect('/');
        ctx.body = '<a href="/">Index Page</a>';
    },
    template: (ctx) => {
        //doSomethings
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./template.html');
    }
};
app.use(serve(__dirname + '/img/')).use(_.get('/', pets.index)).use(_.get('/template', pets.template)).listen(3000);
console.log('已建立连接，效果请看http://127.0.0.1:3000/');
