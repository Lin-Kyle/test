const net = require('net');
const server = net.createServer(socket => {
    // 'connection' listener
    socket.on('end', () => {
        console.log('对方失联！');
    });
    socket.write("我们分手吧!");
    socket.pipe(socket);
});
server.on('error', (err) => {
    throw err;
});
server.listen(9000, () => {
    console.log('你已向对方发起好友请求！');
});
