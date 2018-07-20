const fs = require('fs'), {finished} = require('stream'),
    rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
    if (err) {
        console.error('流发生错误', err);
    } else {
        console.log('流已读完');
    }
});
