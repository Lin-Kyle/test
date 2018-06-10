http.cerateServer((req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk)
    req.on('end', () => { res.end(data) })
}).listen(8080)
