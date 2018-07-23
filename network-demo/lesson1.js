const net = require('net');

const server = net.createServer(socket => {
    socket.on('data', data => socket.write("你好吗？"));
    socket.on('end', () => socket.write("对方失联！"));
    socket.write("对方已接受你的好友申请。");
}).listen(9000, () => {
    console.log('已发起请求好友！');
});
