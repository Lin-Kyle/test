var waterfall = require('async/waterfall'),
    auto = require('async/auto'),
    fs = require('fs');

/*waterfall([
    function(callback) {
        fs.readFile('data1.txt', 'utf8', function(err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("第一次异步读取: " + data.toString());
            callback(null, data.toString().trim());
        });
    },
    function(file, callback) {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("第二次异步读取: " + data.toString());
            callback(null, data.toString().trim());
        });
    },
    function(file) {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("第三次异步读取: " + data.toString());
        });
    }
], function(err, result) {
    // result now equals 'done'
});*/

//OR

auto({
    data1: function(callback) {
        fs.readFile('data1.txt', 'utf8', function(err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("第一次异步读取: " + data.toString());
            callback(null, data.toString().trim());
        });
    },
    data2: [
        'data1',
        function(file, callback) {
            fs.readFile(file.data1, 'utf8', function(err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log("第二次异步读取: " + data.toString());
                callback(null, data.toString().trim());
            });
        }
    ],
    data3: [
        'data2',
        function(file) {
            fs.readFile(file.data2, 'utf8', function(err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log("第三次异步读取: " + data.toString());
            });
        }
    ]
}, function(err, result) {
    // result now equals 'done'
});
