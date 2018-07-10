//打印内存使用
function show() {
    var info = process.memoryUsage(),
        format = function(bytes) {
            return (bytes / 1024 / 1024).toFixed(2) + ' MB'
        };

    console.log('Process: heapTotal ' + format(info.heapTotal) + ' heapUsed ' + format(info.heapUsed) + ' rss ' + format(info.rss));
    console.log('-----------------------------------------------------------');
}

//创建内存操作
function create() {
    var use = function() {
            var size = 20 * 1024 * 1024,
                arr = new Array(size),
                i = 0;
            for (; i < size; i++) {
                arr[i] = 0;
            }
            return arr;
        },
        total = [],
        j = 0;

    for (; j < 15; j++) {
        show();
        total.push(use());
    }
}

create()
