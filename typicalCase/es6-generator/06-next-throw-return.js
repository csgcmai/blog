/**
 * @File: next(), throw(), return() 的共同点
 * next()、throw()、return() 这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，
 * 并且使用不同的语句替换 yield 表达式。
 */

/**
 * A.next() 是将 yield 表达式替换成一个值
 */
const g = function* (x, y) {
  let result = yield x + y
  return result
}

const gen = g(1, 2)
gen.next() // { value: 3, done: false }
gen.next(1) // { value: 1, done: true }
// 相当于将 let result = yield x + y
// 替换成 let result = 1

/**
 * 上面代码中，第二个 next(1) 方法就相当于将 yield 表达式替换成一个值 1。如果 next 方法没有参数，就相当于替换成 undefined。
 */

/**
 * B.throw() 是将 yield 表达式替换成一个 throw 语句。
 */
gen.throw(new Error('出错了')) // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'))

/**
 * C.return() 是将 yield 表达式替换成一个 return 语句
 */
gen.return(2) // { value: 2, done: true }
// 相当于将 let result = yield x + y
// 地换成 let result = return 2
