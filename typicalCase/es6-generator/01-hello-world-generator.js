/**
 * @File: 定义 Generator 函数
 */

// 它内部有两个 yield 表达式，即该函数有三个状态：hello, world, 和 return 语句（结束执行）
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

// 与普通函数调用不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，
// 也就是遍历器对象（Iterator Object）
var hw = helloWorldGenerator()

/**
 * 下一步，必须调用遍历器对象的 next 方法，使得指针移向下一个状态。也就是说，每次调用 next 方法，内部指针就从函数头部或上一次停下来的地方
 * 开始执行，直到遇到下一个 yield 表达式（或 return 语句）为止。
 * Generator 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行。
 */

// 第一次调用，Generator 函数开始执行，直到遇到第一个 yield 表达式为止。next 方法返回一个对象，它的 value 属性就是当前 yield 表达式的值
// hello，done 属性的值 false，表示遍历还没有结束。
hw.next() // { value: 'hello , done: false }

// Generator 函数从上次 yield 表达式停下的地方，一直执行到下一个 yield 表达式。next 方法返回的对象的 value 属性就是当前 yield 表达式
// 的值 world，done 属性的值 false，表示遍历还没有结束。
hw.next() // { value: 'world , done: false }

// 第三次调用，Generator 函数从上次 yield 表达式停下的地方，一直执行到 return 语句（如果没有 return 语句，就执行到函数结束）。next 方法
// 返回的对象的 value 属性，就是紧跟在 return 语句后面的表达式的值（如果没有 return 语句，则 value 属性的值为 undefined），done 属性的
// 值 true，表示遍历已经结束。
hw.next() // { value: 'ending', done: true }

// 第四次调用，此时 Generator 函数已经运行完毕，next 方法返回对象的 value 属性为 undefined，done 属性为 true。以后再调用 next 方法，
// 返回的都是这个值。
hw.next() // { value: undefined, done: true }
