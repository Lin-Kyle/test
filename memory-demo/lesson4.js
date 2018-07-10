var cache = {},
    get = function(key, val) {
        return cache[key]
            ? cache[key]
            : cache[key] = val;
    };

console.log(get('ac', 12));
console.log(get('ac', 12));
console.log('cache: ', cache);
//12
//12
//cache:  { ac: 12 }
