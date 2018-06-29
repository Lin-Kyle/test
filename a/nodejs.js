var fs = require("fs");

// 异步读取
fs.readFile('data1.txt', 'utf8', function(err, data1) {
    if (err) {
        return console.error(err);
    }
    console.log("第一次异步读取: " + data1.toString());
    fs.readFile(data1.toString().trim(), 'utf8', function(err, data2) {
        if (err) {
            return console.error(err);
        }
        console.log("第二次异步读取: " + data2.toString());

        fs.readFile(data2.toString().trim(), 'utf8', function(err, data3) {
            if (err) {
                return console.error(err);
            }
            console.log("第三次异步读取: " + data3.toString());
        });
    });
});
