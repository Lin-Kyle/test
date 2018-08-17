const dgram = require('dgram')

const server = dgram.createSocket('udp4')
server.on('message', (msg, rinfo) => {
  console.log(`服务器收到：${msg} 来自 ${rinfo.address}:${rinfo.port}`)
  server.send('exit', 0, 4, 8001, 'localhost')
}).on('listening', function () {
  const address = server.address()
  console.log(`服务器监听 ${address.address}:${address.port}`)
}).on('error', (err) => {
  console.log(`服务器异常：\n${err.stack}`)
  server.close()
}).on('close', (err) => {
  console.log(`服务器关闭`)
  server.close()
}).bind(8000)