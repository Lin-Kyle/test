const dgram = require('dgram')

const client = dgram.createSocket('udp4')
client.on('message', (msg, rinfo) => {
  console.log(`客户端接收来自${rinfo.address}:${rinfo.port}`)
  if (msg == 'exit') client.close()
}).on('error', (err) => {
  console.log(`客户端异常：\n${err.stack}`)
  client.close()
}).on('close', () => {
  console.log('客户端关闭')
}).bind(8001)

const messages = 'Hello World'
client.send(messages, 0, messages.length, 8000, 'localhost')