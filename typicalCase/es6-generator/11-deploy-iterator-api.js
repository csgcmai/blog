/**
 * @File: 部署 Iterator 接口
 */

// 利用 Generator 函数，可以在任意对象上部署 Iterator 接口。
function* iterEntries(obj) {
  let keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    yield [key, obj[key]]
  }
}

let myObj = { foo: 3, bar: 7 }

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value)
}
// foo 3
// bar 7

/**
 * 上述代码中，myObj 是一个普通对象，通过 iterEntries 函数，就有了 Iterator 接口。也就是说，可以在任意对象上部署 next 方法。
 */
