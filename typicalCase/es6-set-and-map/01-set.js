/**
 * @File： Set
 * @实例属性：
 *   @Set.prototype.constructor：构造函数，默认就是 Set 函数
 *   @Set.prototype.size：返回 Set 实例的成员总数
 * @实例方法（操作方法）：
 *   @Set.prototype.add(value)：添加某个值，返回 Set 结构本身
 *   @Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功
 *   @Set.prototype.has(value)：返回一个布尔值，表示该值是否为 Set 的成员
 *   @Set.prototype.clear()：清除所有成员，没有返回值
 * @实例方法（遍历方法）：
 *   @Set.prototype.keys()：返回键名的遍历器
 *   @Set.prototype.values()：返回键值的遍历器
 *   @Set.prototype.entries()：返回键值对的遍历器
 *   @Set.prototype.forEach()：使用回调函数遍历每个成员
 */

// ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。Set 本身是一个构造函数，用来生成 Set 数据结构
const s = new Set()

[2, 3, 5, 4, 5, 2, 2].forEach((x) => { s.add(x) })

for (let i of s) {
  console.log(i)
}
// 2 3 5 4

// 去除数组重复成员的方法:
[...new Set(array)]

// 去除字符串中的重复字符
[...new Set('ababbc')].join('')
// abc

/**
 * 向 Set 加入值的时候，不会发生类型转换，所以 5 和 "5" 是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做
 * “Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为 NaN 等于自身，而精确相等运算符认为
 * NaN 不等于自身。
 */
let set = new Set()
let a = NaN
let b = NaN
set.add(a)
set.add(b)
set // Set {NaN}

/**
 * Array.from 方法可以将 Set 结构转为数组。
 */
const items = new Set([1, 2, 3, 4, 5])
const array = Array.from(items)

// 这就提供了去除数组重复成员的另一种方法。
function dedupe(array) {
  return Array.from(new Set(array))
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]

// 需要特别指出的是，Set 的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

/**
 * keys 方法、values 方法、entries 方法返回的都是遍历器对象（详见《Iterator 对象》一章）。由于 Set 结构没有键名，
 * 只有键值（或者说键名和键值是同一个值），所以 keys 方法和 values 方法的行为完全一致。
 */
let set = new Set(['red', 'green', 'blue'])

for (let item of set.keys()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item)
}
// ['red', 'red']
// ['green', 'green']
// ['blue', 'blue']

/**
 * Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 values 方法。
 */
Set.prototype[Symbol.iterator] === Set.prototype.values // true
// 这意味着，可以省略 values 方法，直接用 for...of 循环遍历 Set。
let set = new Set(['red', 'green', 'blue'])

for (let x of set) {
  console.log(x)
}
// red
// green
// blue

/**
 * 使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
 */
let a = new Set([1, 2, 3])
let b = new Set([4, 3, 2])

// 并集
let union = new Set([...a, ...b]) // Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter((x) => { return b.has(x) })) // Set {2, 3}

// 差集
let difference = new Set([...a].filter((x) => { return !b.has(x) })) // Set {1}
