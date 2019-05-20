/**
 * @File: yield* 表达式
 */

/**
 * 如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。
 */
function* foo() {
  yield 'a'
  yield 'b'
}

function* bar() {
  yield 'x'
  // 手动遍历 foo()
  for (let i of foo()) {
    console.log(i)
  }
  yield 'y'
}

for (let v of bar()) {
  console.log(v)
}
// x
// a
// b
// y

/**
 * ES6 提供了 yield* 表达式，作为解决办法，用来在一个 Generator 函数里面执行另一个 Generator 函数。
 */
function* bar() {
  yield 'x'
  yield* foo()
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  yield 'a'
  yield 'b'
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  for (let v of foo()) {
    yield v
  }
  yield 'y'
}

for (let v of bar()) {
  console.log(v)
}
// x
// a
// b
// y

/**
 * 再来看一个对比例子
 */
function* inner() {
  yield 'hello!'
}

function* outer1() {
  yield 'open'
  yield inner()
  yield 'close'
}

var gen = outer1()
gen.next().value // 'open'
gen.next().value // 返回遍历器对象
gen.next().value // 'close'

function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}

var gen = outer2()
gen.next().value // 'open'
gen.next().value // 'hello!' // 返回遍历器对象的内部值
gen.next().value // 'close'

/**
 * 从语法角度看，如果 yield 表达式后面跟的是一个遍历器对象，需要在 yield 表达式后面加上星号，表明它返回的是一个遍历器对象。
 * 这被称为 yield* 表达式。
 */
let delegatedIterator = (function* () {
  yield 'Hello!'
  yield 'Bye!'
}())

let delegatingIterator = (function* () {
  yield 'Greetings!'
  yield* delegatedIterator
  yield 'OK, bye.'
}())

for (let value of delegatingIterator) {
  console.log(value)
}
// "Greetings!
// "Hello!"
// "Bye!"
// "Ok, bye."

/**
 * 如果被代理的 Generator 函数有 return 语句，那么就可以向代理它的 Generator 函数返回数据。
 */
function* foo() {
  yield 2
  yield 3
  return 'foo'
}

function* bar() {
  yield 1
  var v = yield* foo()
  console.log('v: ' + v)
  yield 4
}

var it = bar()

it.next() // { value: 1, done: false }
it.next() // { value: 2, done: false }
it.next() // { value: 3, done: false }
it.next() // v: foo // { value: 4, done: false }
it.next() // { value: undefined, done: true }
