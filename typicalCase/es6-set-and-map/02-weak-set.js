/**
 * @File: WeakSet
 * @Apis:
 *   @WeakSet.prototype.add(value)：向 WeakSet 实例添加一个成员
 *   @WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员
 *   @WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中
 */

/**
 * WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。
 * 1.首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
 * 2.其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，
 * 如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
 * 3.WeakSet 不可遍历
 */
const a = [[1, 2], [3, 4]]
const ws = new WeakSet(a)
// WeakSet {[1, 2], [3, 4]}

// WeakSet 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。
// WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method() {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在 Foo 的实例上调用！')
    }
  }
}
// 上面代码保证了 Foo 的实例方法，只能在 Foo 的实例上调用。这里使用 WeakSet 的好处是，foos对实例的引用，不会被计入内存回收机制，
// 所以删除实例的时候，不用考虑 foos，也不会出现内存泄漏。
