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
