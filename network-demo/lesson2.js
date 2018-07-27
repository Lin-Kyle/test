const net = require('net');

const client = net.createConnection({
    port: 9000
}, () => {
    //'connect' listener
    console.log('你已接受对方好友请求！');
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('已删除你的好友！');
});
