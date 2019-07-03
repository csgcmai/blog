/**
 * @File: WeakMap
 * WeakMap 与 Map 的区别有两点：
 * 1.首先，WeakMap 只接受对象作为键名（null除外），不接受其他类型的值作为键名。
 * 2.其次，WeakMap 的键名所指向的对象，不计入垃圾回收机制。
 */

// WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap()
const key = { foo: 1 }
wm1.set(key, 2)
wm1.get(key) // 2

// WeakMap 也可以接受一个数组
// 作为构造函数的参数
const k1 = [1, 2, 3]
const k2 = [4, 5, 6]
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']])
wm2.get(k2) // 'bar

/**
 * WeakMap 的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子。
 */
const e1 = document.getElementById('foo')
const e2 = document.getElementById('bar')
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素']
]

// 上面代码中，e1 和 e2 是两个对象，我们通过 arr 数组对这两个对象添加一些文字说明。这就形成了 arr 对 e1 和 e2 的引用。
// 一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放 e1 和 e2 占用的内存。
arr[0] = null
arr[1] = null

// 上面这样的写法显然很不方便。一旦忘了写，就会造成内存泄露
// WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，
// 只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，
// WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

/**
 * 一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用 WeakMap 结构。当该 DOM 元素被清除，其所对应的 WeakMap 记录就会自动被移除。
 */
const wm = new WeakMap()
const element = document.getElementById('example')
wm.set(element, 'some information')
wm.get(element) // 'some information'

/**
 * 注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
 */
const wm = new WeakMap()
let key = {}
let obj = { foo: 1 }

wm.set(key, obj)
obj = null
wm.get(key) // Object {foo: 1}
// 上面代码中，键值 obj 是正常引用。所以，即使在 WeakMap 外部消除了 obj 的引用，WeakMap 内部的引用依然存在。

/**
 * WeakMap 的另一个用处是部署私有属性。
 */
const _counter = new WeakMap()
const _action = new WeakMap()

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter)
    _action.set(this, action)
  }
  dec() {
    let counter = _counter.get(this)
    if (counter < 1) return
    counter--
    _counter.set(this, counter)
    if (counter === 0) {
      _action.get(this)()
    }
  }
}

const c = new Countdown(2, () => { console.log('DONE') })
c.dec()
c.dec() // DONE

// 上面代码中，Countdown 类的两个内部属性 _counter 和 _action，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。
