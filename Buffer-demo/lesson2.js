const fs = require('fs');

let rs = fs.createReadStream('test.txt'),
    data = '';

rs.on("data", function(chunk) {
    data += chunk;
});
rs.on("end", function() {
    console.log(data);
});
