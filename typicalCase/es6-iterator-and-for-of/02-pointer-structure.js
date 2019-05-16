/**
 * @File: 通过遍历器实现指针结构的例子
 */

function Obj(value) {
  this.value = value
  this.next = null // 通过 next 定义指针指向，初始化创建实例对象时置为 null
}

// 在构造函数的原型链上部署 Symbol.iterator 方法，调用该方法会返回遍历器对象 iterator，
// 调用该对象的 next 方法，在返回一个值的同时，自动将内部指针移到下一个实例
Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next }
  var current = this

  // 闭包了 current，遍历到后指针更新指向到下一个实例，若不存在则返回 { done: true } 示意遍历完成
  function next() {
    if (current) {
      var value = current.value
      current = current.next
      return { done: false, value: value }
    } else {
      return { done: true }
    }
  }
  return iterator
}

// 创建对象，并建立指针关系
var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)

one.next = two
two.next = three

for (var i of one) {
  console.log(i) // 1, 2, 3
}
