async function Async() {
  await Promise.reject('err');
  console.log('不执行了');
  await Promise.resolve();
};
Async().catch(err => console.log(err));

// 輸出
// err

