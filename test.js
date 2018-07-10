var buf = new Buffer(100);
buf[0] = 100.01;
buf[1] = -100;
buf[2] = 300;
console.log(buf[0], buf[1], buf[2]); //100 156 44
