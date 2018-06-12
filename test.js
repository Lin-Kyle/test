console.log('log start!');
setTimeout(function() {
    console.log('setTimeout300');
}, 300)

Promise.resolve().then(function() {
    console.log('promise resolve');
}).then(function() {
    console.log('promise resolve then');
})

new Promise(function(resolve, reject) {
    console.log('promise pending');
    resolve();
}).then(function() {
    console.log('promise pending then');
})

setTimeout(function() {
    console.log('setTimeout0');
    Promise.resolve().then(function() {
        console.log('promise3 in setTimeout');
    })
}, 0)
console.log('log end!');
