/**
 * @File: 通用对象池实现
 */

/**
 * @享元模式
 * @定义：享元（flyweight）模式是一种用于性能优化的模式，“fly”在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。
 * @Tips：
 * （1）剥离了外部状态的对象称为共享对象，外部状态在必要时被传入共享对象来组装成一个完整的对象。虽然组装外部状态成为一个完整对象的过程需要
 * 花费一定的时间，但却可以大大减少系统中的对象数量，相比之下，这点时间或许是微不足道的。因此，享元模式是一种用时间换空间的优化模式；
 * （2）使用享元模式的关键是如何区别内部状态和外部状态。通常来讲，内部状态有多少种组合，系统中便最多存在多少个对象；
 * @适用场景：
 * （1）一个程序中使用了大量的相似对象；
 * （2）由于使用了大量对象，造成很大的内存开销；
 * （3）对象的大多数状态都可以变为外部状态；
 * （4）剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象；
 */

/**
 * @对象池
 * @定义: 对象池维护一个装载空闲对象的池子，如果需要对象的时候，不是直接 new，而是转从对象池里获取。如果对象池里没有空闲对象，
 * 则创建一个新的对象，当获取出的对象完成它的职责之后，再进入池子等待被下次获取；
 */

/**
 * @通用对象池模式
 */
// 对象池工厂
var objectPoolFactory = function(createObjFn) {
  var objectPool = []
  return {
    // 对象池工厂的创建对象方法，首先判断池中是否还有对象，有则将它取出返回，没有则调用 createObjFn 新建
    create: function() {
      var obj = objectPool.length === 0 ?
        createObjFn.apply(this, arguments) : objectPool.shift()
      return obj
    },
    // 对象池工厂的回收方法，将传入的对象回收进对象池
    recover: function(obj) {
      objectPool.push(obj)
    }
  }
}

// 利用 objectPoolFactory 来创建一个装载一些 iframe 的对象池：
var iframeFactory = objectPoolFactory(function() => {
  var iframe = document.createElement('iframe')
  document.body.appendChild(iframe)

  iframe.onload = function() {
    iframe.onload = null;    // Fix：防止 iframe 重复加载的 bug
    iframeFactory.recover(iframe) // iframe 加载完成之后回收节点
  }
  return iframe
})

var iframe1 = iframeFactory.create()
iframe1.src = 'http://baidu.com'

var iframe2 = iframeFactory.create()
iframe2.src = 'http://QQ.com'

window.setTimeout(function() {
  var iframe3 = iframeFactory.create()
  iframe3.src = 'http://163.com'
}, 3000)
