var iconv = require('iconv-lite');

// Convert from an encoded buffer to js string.
str = iconv.decode(Buffer.from('ça va'), 'win1251');

// Convert from js string to an encoded buffer.
buf = iconv.encode("ça va", 'win1251');

console.log(str, buf);
// Check if encoding is supported
iconv.encodingExists("us-ascii")
