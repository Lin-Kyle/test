const dgram = require('dgram');

var message = Buffer.from("Buffer");
const client = dgram.createSocket('udp4');
client.send(message, 0, message.length, 8000, "localhost", function(err, bytes) {
    client.close();
});
