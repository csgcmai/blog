/**
 * @File: co 模块
 */

// 基本用法

// 下面是一个 Generator 函数，用于依次读取两个文件。
var gen = function* () {
  var f1 = yield readFile('/etc/fstab')
  var f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}

// co 模块可以让你不用编写 Generator 函数的执行器。
var co = require('co')
co(gen)

// 上面代码中，Generator 函数只要传入 co 函数，就会自动执行。
// co 函数返回一个 Promise 对象，因此可以用 then 方法添加回调函数。

co(gen).then(function() {
  console.log('Generator 函数执行完成')
})

/**
 * 前面说过，Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。
 * 两种方法可以做到这一点：
 * （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
 * （2）Promise 对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权。
 */

// co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使用 co 的前提条件是，Generator 函数的 yield 命令后面，
// 只能是 Thunk 函数或 Promise 对象。如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co，详见后文的例子。

/**
 * 基于 Promise 的对象的自动执行
 */

// 首先，把 fs 模块的 readFile 方法包装成一个 Promise 对象
var fs = require('fs')

var readFile = function(fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
}

// 然后，手动执行上面的 Generator 函数
var g = gen()
g.next().value.then(function(data) {
  g.next(data).value.then(function(data) {
    g.next(data)
  })
})

// 手动执行其实就是用 then 方法，层层添加回调函数。理解了这一点，就可以写出一个自动执行器
function run(gen) {
  var g = gen()

  function next(data) {
    var result = g.next(data)
    if (result.done) return result.value
    result.value.then(function(data) {
      next(data)
    })
  }

  next()
}

run(gen)

/**
 * co 模块的源码
 */

// 1.首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。
// 2.在返回的 Promise 对象里面，co 先检查参数 gen 是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；
// 如果不是就返回，并将 Promise 对象的状态改为 resolved。
// 3.接着，co 将 Generator 函数的内部指针对象的 next 方法，包装成 onFulfilled 函数。这主要是为了能够捕捉抛出的错误。
// 4.最后，就是关键的 next 函数，它会反复调用自身。
function co(gen) {
  var ctx = this
  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx)
    if (!gen || typeof gen.next !== 'function') return resolve(gen)

    onFulfilled()
    function onFulfilled(res) {
      var ret
      try {
        ret = gen.next(res)
      } catch(e) {
        return reject(e)
      }

      next(ret)
      function next(ret) {
        // 检查当前是否为 Generator 函数的最后一步，如果是就返回
        if (ret.done) return resolve(ret.value)

        // 确保每一步的返回值，是 Promise 对象。
        var value = toPromise.call(ctx, ret.value)

        // 使用 then 方法，为返回值加上回调函数，然后通过 onFulfilled 函数再次调用 next 函数。
        if (value && isPromise(value)) return value.then(onFulfilled, onRejected)

        // 在参数不符合要求的情况下（参数非 Thunk 函数和 Promise 对象），将 Promise 对象的状态改为 rejected，从而终止执行。
        return onRejected(
          new TypeError(
            'You may only yield a function, promise, generator, array, or object, '
            + 'but the following object was passed: "'
            + String(ret.value)
            + '"'
          )
        )
      }
    }
  })
}

/**
 * 处理并发的异步操作
 */

// co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。
// 这时，要把并发的操作都放在数组或对象里面，跟在 yield 语句后面。

// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ]
  console.log(res)
}).catch(onerror)

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2)
  }
  console.log(res)
}).catch(onerror)

// 另一个例子
co(function* () {
  var values = [n1, n2, n3]
  yield values.map(somethingAsync)
})

function* somethingAsync(x) {
  // do something async
  return y
}

// 上面的代码允许并发三个 somethingAsync 异步操作，等到它们全部完成，才会进行下一步。

/**
 * 实例：处理 Stream
 */

// Node 提供 Stream 模式读写数据，特点是一次只处理数据的一部分，数据分成一块块依次处理，就好像“数据流”一样。这对于处理大规模数据非常有利。
// Stream 模式使用 EventEmitter API，会释放三个事件。
// data 事件：下一块数据块已经准备好了。
// end 事件：整个“数据流”处理完了。
// error 事件：发生错误。

// 使用 Promise.race() 函数，可以判断这三个事件之中哪一个最先发生，只有当 data 事件最先发生时，才进入下一个数据块的处理。从而，
// 我们可以通过一个 while 循环，完成所有数据的读取。
const co = require('co')
const fs = require('fs')

const stream = fs.createReadStream('./les_miserables.txt')
let valjeanCount = 0

co(function* () {
  while(true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => { stream.once('error', reject) })
    ])

    if (!res) {
      break
    }

    stream.removeAllListeners('data')
    stream.removeAllListeners('end')
    stream.removeAllListeners('error')
    valjeanCount += (res.toString().match(/valjean/ig) || []).length
  }
  console.log('count:', valjeanCount)
})
