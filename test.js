let str = '00A40000021001805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204805C000204';

function splitStr (str,len=10) {
  let ary = [],i=0;

  while (i*len < str.length){
    ary[i] = str.substr(i*len, len)
    i++
  }
  console.log(ary)
}

splitStr(str,16)