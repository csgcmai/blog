/**
 * @File: Map
 * @APIS:
 *   @Map.prototype.size：返回 Map 结构的成员总数
 *   @Map.prototype.set(key, value)：set 方法设置键名 key 对应的键值为 value，然后返回整个 Map 结构。如果 key 已经有值，
 * 则键值会被更新，否则就新生成该键。
 *   @Map.prototype.get(key)：get 方法读取 key 对应的键值，如果找不到 key，返回 undefined
 *   @Map.prototype.has(key)：has 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
 *   @Map.prototype.delete(key)：delete 方法删除某个键，返回 true。如果删除失败，返回 false。
 *   @Map.prototype.clear(): clear 方法清除所有成员，没有返回值。
 *   @Map.prototype.keys()：返回键名的遍历器
 *   @Map.prototype.values()：返回键值的遍历器
 *   @Map.prototype.entries()：返回所有成员的遍历器
 *   @Map.prototype.forEach()：遍历 Map 的所有成员
 */

// Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，
// Map 比 Object 更合适。

// 作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
])

map.size // 2
map.has('name') // true
map.get('name') // '张三'
map.has('title') // true
map.get('title') // 'Author'

/**
 * 不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作 Map 构造函数的参数。
 * 这就是说，Set 和 Map 都可以用来生成新的 Map
 */
const set = new Set([
  ['foo', 1],
  ['bar', 2]
])
const m1 = new Map(set)
m1.get('foo') // 1

const m2 = new Map([['baz', 3]])
const m3 = new Map(m2)
m3.get('baz') // 3

/**
 * 注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心
 */
const map = new Map()
map.set(['a'], 555)
map.get(['a']) // undefined
// 上面代码的 set 和 get 方法，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的，因此 get 方法无法读取该键，返回 undefined。

// Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，
// 如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。
// 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键
// 虽然 NaN 不严格相等于自身，但 Map 将其视为同一个键。
// set 方法返回的是当前的 Map 对象，因此可以采用链式写法
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c')

// Map 结构的默认遍历器接口（Symbol.iterator 属性），就是 entries 方法
map[Symbol.iterator] === map.entries // true

/**
 * Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）
 */
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'Three']
])

[...map.keys()] // [1, 2, 3]
[...map.values()] // ['one', 'two', 'Three']
[...map.entries()] // [[1, 'one'], [2, 'two'], [3, 'Three']]
[...map] // [[1, 'one'], [2, 'two'], [3, 'Three']]

/**
 * 结合数组的 map 方法、filter 方法，可以实现 Map 的遍历和过滤（Map 本身没有 map 和 filter 方法）。
 */
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c')

const map1 = new Map(
  [...map0].filter(([k, v]) => { return k < 3 }) // 产生 Map 结构 { 1 => 'a', 2 => 'b' }
)
const map2 = new Map(
  [...map0].map((k, v) => { return [k * 2, '_' + v] }) // 产生 Map 结构 { 2 => '_a', 4 => '_b', 6 => '_c' }
)
