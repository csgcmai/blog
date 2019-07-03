/**
 * @File: 函数式编程
 */

/**
 * 柯里化
 * 柯里化（currying）指的是将一个多参数的函数拆分成一系列函数，每个拆分后的函数都只接受一个参数（unary）。
 */
function add(a, b) {
  return a + b
}
add(1, 1) // 2

// 上面代码中，函数 add 接受两个参数 a 和 b。
// 柯里化就是将上面的函数拆分成两个函数，每个函数都只接受一个参数。
function add(a) {
  return function(b) {
    return a + b
  }
}
// 或者采用箭头函数写法
const add = x => y => x + y

const f = add(1)
f(1) // 2
// 上面代码中，函数 add 只接受一个参数 a，返回一个函数 f。函数 f 也只接受一个参数 b。

/**
 * 函数合成
 * 函数合成（function composition）指的是，将多个函数合成一个函数。
 */
const compose = f => g => x => f(g(x))
const f = compose(x => x * 4)(x => x + 3)
f(2) // 20
// 上面代码中，compose 就是一个函数合成器，用于将两个函数合成一个函数。
// 可以发现，柯里化与函数合成有着密切的联系。前者用于将一个函数拆成多个函数，后者用于将多个函数合并成一个函数。

/**
 * 参数倒置
 * 参数倒置（flip）指的是改变函数前两个参数的顺序。
 */
let f = {}
f.flip = fn => (a, b, ...args) => fn(b, a, ...args.reverse())

var divide = (a, b) => a / b
var flip = f.flip(divide)

flip(10, 5) // 0.5
flip(1, 10) // 10

var three = (a, b, c) => [a, b, c]
var flip = f.flip(three)
flip(1, 2, 3) // [2, 1, 3]

/**
 * 执行边界
 * 执行边界（until）指的是函数执行到满足条件为止。
 */
let f = {}
f.until = (condition, f) =>
  (...args) => {
    var r = f.apply(null, args)
    return condition(r) ? r : f.until(condition, f)(r)
  }

let condition = x => x > 100
let inc = x => x + 1
let until = f.until(condition, inc)

until(0) // 101

condition = x => x === 5
until = f.until(condition, inc)
until(3) // 5

/**
 * 队列操作
 * 队列（list）操作包括以下几种：
 * 1.head: 取出队列的第一个非空成员
 * 2.last: 取出有限队列的最后一个非空成员
 * 3.tail: 取出除了“队列头”以外的其他非空成员
 * 4.init: 取出除了“队列尾”以外的其他非空成员
 */
f.head(5, 27, 3, 1) // 5
f.last(5, 27, 3, 1) // 1
f.tail(5, 27, 3, 1) // [27, 3, 1]
f.init(5, 27, 3, 1) // [5, 27, 3]

// 方法实现如下
let f = {}
f.head = (...xs) => xs[0]
f.last = (...xs) => xs.slice(-1)
f.tail = (...xs) => Array.prototype.slice.call(xs, 1)
f.init = (...xs) => Array.prototype.slice.call(0, -1)

/**
 * 合并操作
 * 合并操作分为 concat 和 concatMap 两种。前者就是将多个数组合成一个，后者则是先处理一下参数，然后再将处理结果合成一个数组。
 */
f.concat([5], [27], [3]) // [5, 27, 3]
f.concatMap(x => 'hi' + x, 1, [[2]], 3) // ['hi 1', 'hi 2', 'hi 3']

// 这两种方法的实现代码如下
let f = {}
f.concat = (...xs) => xs.reduce((a, b) => a.concat(b))
f.concatMap = (f, ...xs) => f.concat(xs.map(f))

/**
 * 配对操作
 * 配对操作分为 zip 和 zipWith 两种方法。zip 操作将两个队列的成员，一一配对，合成一个新的队列。如果两个队列不等长，
 * 较长的那个队列多出来的成员，会被忽略。zipWith 操作的第一个参数是一个函数，然后会将后面的队列成员一一配对，输入该函数，
 * 返回值就组成一个新的队列。
 */
let a = [0, 1, 2]
let b = [3, 4, 5]
let c = [6, 7, 8]

f.zip(a, b) // [[0, 3], [1, 4], [2, 5]]
f.zipWith((a, b) => a + b, a, b, c) // [9, 12, 15]
// 上面代码中，zipWith 方法的第一个参数是一个求和函数，它将后面三个队列的成员，一一配对进行相加。
// 两个方法实现如下
let f = {}
f.zip = (...xs) => {
  let r = []
  let nple = []
  let length = Math.min.apply(null, xs.map(x => x.length))

  for (var i = 0; i < length; i++) {
    xs.forEach(
      x => nple.push(x[i])
    )
    r.push(nple)
    nple = []
  }
  
  return r
}

f.zipWith = (op, ...xs) =>
  f.zip.apply(null, xs).map(
    (x) => x.reduce(op)
  )
