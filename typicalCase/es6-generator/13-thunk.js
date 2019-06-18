/**
 * @File: Thunk 函数
 */

// Thunk 函数是自动执行 Generator 函数的一种方法。
// JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，
// 将其替换成一个只接受回调函数作为参数的单参数函数。

// 正常版本的 readFile（多参数版本）
fs.readFile(fileName, callback)

// Thunk 版的 readFile（单参数版本）
var Thunk = function(fileName) {
  return function(callback) {
    return fs.readFile(fileName, callback)
  }
}

var readFileThunk = Thunk(fileName)
readFileThunk(callback)

/**
 * 任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。下面是一个简单的 Thunk 函数转换器。
 */
// ES5 版本
var Thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    return function(callback) {
      args.push(callback)
      return fn.apply(this, args)
    }
  }
}

// ES6 版本
const Thunk = function(fn) {
  return function(...args) {
    return function(callback) {
      return fn.call(this, ...args, callback)
    }
  }
}

// 使用上面的转换器，生成 fs.readFile 的 Thunk 函数
var readFileThunk = Thunk(fs.readFile)
readFileThunk(fileA)(callback)

// 下面是另一个完整的例子
function f(a, cb) {
  cb(a)
}
const ft = Thunk(f)
ft(1)(console.log)

/**
 * 
 * Thunkify 源码
 */
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length)
    var ctx = this

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i]
    }

    return function(done) {
      var called

      args.push(function() {
        if (called) return
        called = true
        done.apply(null, arguments)
      })

      try {
        fn.apply(ctx, args)
      } catch (err) {
        done(err)
      }
    }
  }
}

// 它的源码主要多了一个检查机制，变量 called 确保回调函数只运行一次。这样的设计与下文的 Generator 函数相关。请看下面的例子。
function f(a, b, callback) {
  var sum = a + b
  callback(sum)
  callback(sum)
}

var ft = thunkify(f)
var print = console.log.bind(console)
ft(1, 2)(print)

// 上面代码中，由于 thunkify 只允许回调函数执行一次，所以只输出一行结果。

/**
 * Generator 函数的流程管理
 */

// Thunk 函数有什么用？Thunk 函数可以用于 Generator 函数的自动流程管理
function* gen() {
  // ...
}

var g = gen()
var res = g.next()

while(!res.done) {
  console.log(res.value)
  res = g.next()
}

// 上面代码中，Generator 函数 gen 会自动执行完所有步骤。但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，
// 上面的自动执行就不可行。这时，Thunk 函数就能派上用处。以读取文件为例。下面的 Generator 函数封装了两个异步操作。
var fs = require('fs')
var thunkify = require('thunkify')
var readFileThunk = thunkify(fs.readFile)

var gen = function* () {
  var r1 = yield readFileThunk('/etc/fstab')
  console.log(r1.toString())
  var r2 = yield readFileThunk('/etc/shells')
  console.log(r2.toString())
}

// 上面代码中，yield 命令用于将程序的执行权移出 Generator 函数，那么就需要一种方法，将执行权再交还给 Generator 函数。
// 这种方法就是 Thunk 函数，因为它可以在回调函数里，将执行权交还给 Generator 函数。为了便于理解，我们先看如何手动执行上面这个 Generator 函数。
var g = gen()
var r1 = g.next()
r1.value(function(err, data) {
  if (err) throw err
  var r2 = g.next(data)
  r2.value(function(err, data) {
    if (err) throw err
    g.next(data)
  })
})

// 上面代码中，变量 g 是 Generator 函数的内部指针，表示目前执行到哪一步。next 方法负责将指针移动到下一步，并返回该步的信息（value 属性和 done 属性）。
// 仔细查看上面的代码，可以发现 Generator 函数的执行过程，其实是将同一个回调函数，反复传入 next 方法的 value 属性。这使得我们可以用递归来自动完成这个过程。

/**
 * Thunk 函数的自动流程管理
 */

// Thunk 函数真正的威力，在于可以自动执行 Generator 函数。下面就是一个基于 Thunk 函数的 Generator 执行器。
function run(fn) {
  var gen = fn()

  function next(err, data) {
    var result = gen.next(data)
    if (result.done) return
    result.value(next)
  }

  next()
}

var g = function* () {
  var f1 = yield readFileThunk('fileA')
  var f2 = yield readFileThunk('fileB')
  var f3 = yield readFileThunk('fileC')
}

run(g)

// Thunk 函数并不是 Generator 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 Generator 函数的流程，
// 接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到这一点
