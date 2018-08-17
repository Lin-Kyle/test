const net = require('net')

const server = net.createServer(socket => {
  socket.on('end', () => {
    console.log('你已被列入黑名单！')
  })
  socket.write('请问需要贷款么？!')
  socket.pipe(socket)
}).on('error', (err) => {
  console.log(err)
  throw err
}).listen(8124, () => {
  console.log('你已向对方发起好友请求！')
})

