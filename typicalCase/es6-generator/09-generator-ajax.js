/**
 * @File: Ajax 是典型的异步操作，通过 Generator 函数部署 Ajax 操作，可以用同步的方式表达
 * @Generator 应用：异步操作的同步化表达
 */
function* main() {
  var result = yield request('http://some.url')
  var resp = JSON.parse(result)
  console.log(resp.value)
}

function request(url) {
  makeAjaxCall(url, function(response) {
    it.next(response)
  })
}

var it = main()
it.next()

/**
 * 上面代码的 main 函数，就是通过 Ajax 操作获取数据。可以看到，除了多了一个 yield，它几乎与同步操作的写法完全一样。注意，makeAjaxCall
 * 函数中的 next 方法，必须加上 response 参数，因为 yield 表达式，本身是没有值的，总是等于 undefined。
 */
