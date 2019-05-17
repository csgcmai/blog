/**
 * @File: Generator.prototype.return()
 */

/**
 * Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。
 */
function* gen() {
  yield 1
  yield 2
  yield 3
}

var g = gen()

g.next() // { value: 1, done: false }
g.return('foo') // { value: 'foo', done: true }
g.next() // { value: undefined, done: true }

/**
 * 上面代码中，遍历器对象 g 调用 return 方法后，返回值的 value 属性就是 return 方法的参数 foo。并且，Generator 函数的遍历就终止了，
 * 返回值的 done 属性为 true，以后再调用 next 方法，done 属性总是返回 true。
 * 如果 return 方法调用时，不提供参数，则返回值的 value 属性为 undefined。
 */
