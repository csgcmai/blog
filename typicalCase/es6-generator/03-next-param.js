/**
 * @File: next 方法的参数
 */

/**
 * yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。
 */
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i
    if (reset) { i = -1 }
  }
}

var g = f()
g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { 0, done: false }

/**
 * 上面代码先定义了一个可以无限运行的 Generator 函数f，如果 next 方法没有参数，每次运行到 yield 表达式，变量 reset 的值总是 undefined。
 * 当 next 方法带一个参数 true 时，变量 reset 就被重置为这个参数（即 true），因此 i 会等于 -1，下一轮循环就会从 -1 开始递增。
 */

/**
 * 这个功能有很重要的语法意义。Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过 next 方法的参数，就有办法在
 * Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，
 * 从而调整函数行为。
 */

/**
 * 再看一个例子
 */
function* foo(x) {
  var y = 2 * (yield (x + 1))
  var z = yield (y / 3)
  return (x + y + z)
}

var a = foo(5)
a.next() // { value: 6, done: false }
a.next() // { value: NaN, done: false }
a.next() // { value: NaN, done: true }

var b = foo(5)
b.next() // { value: 6, done: false }
b.next(12) // { value: 8, done: false }
b.next(13) // { value: 42, done: true }

/**
 * 注意，由于 next 方法的参数表示上一个 yield 表达式的返回值，所以在第一次使用 next 方法时，传递参数是无效的。
 * V8 引擎直接忽略第一次使用 next 方法时的参数，只有从第二次使用 next 方法开始，参数才是有效的。
 */

/**
 * 再看一个通过 next 方法的参数，向 Generator 函数内部输入值的例子。
 */
function* dataConsumer() {
  console.log('Started')
  console.log(`1. ${yield}`)
  console.log(`2. ${yield}`)
  return 'result'
}

let genObj = dataConsumer()
genObj.next() // Started
genObj.next('a') // 1. a
genObj.next('b') // 2. b
