/**
 * @File: 类部署 Iterator 接口的写法
 */

class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  // Symbol.iterator 属性对应一个函数，执行后返回当前对象的遍历器对象
  [Symbol.iterator]() { return this }

  next() {
    var value = this.value
    if (value < this.stop) { // 未遍历到尽头
      this.value++
      return { done: false, value }
    }
    // 遍历到尽头
    return { done: true, value: undefined }
  }
}

function range(start, stop) { // 调用后得到遍历器对象，供 for...of 消费
  return new RangeIterator(start, stop)
}

for (var value of range(0, 3)) {
  console.log(value) // 0, 1, 2
}
