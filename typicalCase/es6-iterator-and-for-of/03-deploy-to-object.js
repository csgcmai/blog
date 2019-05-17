/**
 * @File1: 为对象部署 Iterator 接口
 * @File2: 为类数组对象部署 Iteratior 接口
 * @File3: 另一个类似数组的对象调用数组的 Symbol.iterator 方法的例子
 */

/**
 * A.为对象部署 Iterator 接口
 */
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this
    let index = 0
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}

/**
 * B.为类数组对象（存在数值键名和 length 属性）部署 Iteratior 接口，有个简便方法，就是 Symbol.iterator 方法直接
 * 引用数组的 Iterator 接口
 * NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。下面代码中，我们将它的遍历接口改成数组的 Symbol.iterator 属性，
 * 可以看到没有任何影响。
 */
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]

// [...document.querySelectorAll('div')] 可以执行了

/**
 * C.另一个类似数组的对象调用数组的 Symbol.iterator 方法的例子
 */
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
}
for (let item of iterable) {
  console.log(item) // 'a', 'b', 'c'
}
