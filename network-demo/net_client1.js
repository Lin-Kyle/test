const net = require('net')

const client = net.connect({port: 8124}, function () {
  console.log('已同意好友请求\n你是？')
}).on('data', function (data) {
  console.log(data.toString())
  client.end()
}).on('end', function () {
  console.log('你滚！')

})




