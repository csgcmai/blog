/**
 * @File: Generator.prototype.throw()
 */

/**
 * Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。
 */
var g = function* () {
  try {
    yield
  } catch (e) {
    console.log('内部捕获', e)
  }
}

var i = g()
i.next()

try {
  i.throw('a')
  i.throw('b')
} catch (e) {
  console.log('外部捕获', e)
}

// 内部捕获 a
// 外部捕获 b

/**
 * 上面代码中，遍历器对象 i 连续抛出两个错误。第一个错误被 Generator 函数体内的 catch 语句捕获。i 第二次抛出错误，由于 Generator 函数
 * 内部的 catch 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的 catch 语句捕获。
 */

/**
 * throw 方法可以接受一个参数，该参数会被 catch 语句接收，建议抛出 Error 对象的实例
 */
var g = function* () {
  try {
    yield
  } catch (e) {
    console.log(e)
  }
}

var i = g()
i.next()
i.throw(new Error('出错了！'))

// Error: 出错了！(...)

/**
 * 注意，不要混淆遍历器对象的 throw 方法和全局的 throw 命令。上面代码的错误，是用遍历器对象的 throw 方法抛出的，而不是用 throw 命令抛出的。
 * 后者只能被函数体外的 catch 语句捕获。
 */

var g = function* () {
  while (true) {
    try {
      yield
    } catch (e) {
      if (e != 'a') throw e
      console.log('内部捕获',e)
    }
  }
}

var i = g()
i.next()

try {
  throw new Error('a')
  throw new Error('b')
} catch (e) {
  console.log('外部捕获', e)
}

// 外部捕获 [Error: a]

/**
 * 上面代码之所以只捕获了 a，是因为函数体外的 catch 语句块，捕获了抛出的 a 错误以后，就不会再继续 try 代码块里面剩余的语句了。
 */

/**
 * 如果 Generator 函数内部没有部署 try...catch 代码块，那么 throw 方法抛出的错误，将被外部 try...catch 代码块捕获。
 */
var g = function* () {
  while (true) {
    yield
    console.log('内部捕获', e)
  }
}

var i = g()
i.next()

try {
  i.throw('a')
  i.throw('b')
} catch (e) {
  console.log('外部捕获', e)
}

// 外部捕获 a

/**
 * 上面代码中，Generator 函数 g 内部没有部署 try...catch 代码块，所以抛出的错误直接被外部 catch 代码块捕获。
 * 如果 Generator 函数内部和外部，都没有部署 try...catch 代码块，那么程序将报错，直接中断执行。
 */

/**
 * 一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用 next 方法，将返回一个 value 属性
 * 等于 undefined、done 属性等于 true 的对象，即 JavaScript 引擎认为这个 Generator 已经运行结束了。
 */
function* g() {
  yield 1
  console.log('throwing an exception')
  throw new Error('generator broke!')
  yield 2
  yield 3
}

function log(generator) {
  var v
  console.log('starting generator')

  try {
    v = generator.next()
    console.log('第一次运行 next 方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }

  try {
    v = generator.next()
    console.log('第二次运行 next 方法', v)
  } catch (err) {
    console.log('捕获错误', v)
  }

  try {
    v = generator.next()
    console.log('第三次运行 next 方法', v)
  } catch(err) {
    console.log('捕获错误', v)
  }
  console.log('caller done')
}

log(g())

// starting generator
// 第一次运行 next 方法 { value: 1, done: false }
// throwing an exception
// 捕获错误 { value: 1, done: false }
// 第三次运行 next 方法 { value: undefined, done: true }
// caller done

/**
 * 上面代码一共三次运行 next 方法，第二次运行的时候会抛出错误，然后第三次运行的时候，Generator 函数就已经结束了，不再执行下去了。
 */
