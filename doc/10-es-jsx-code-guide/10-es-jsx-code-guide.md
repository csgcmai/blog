# ES/JSX 编码规范及最佳实践点记录（持续更新）

> 2018.03.13 发布，最后更新于 2019.07.17

## ES

### ES 编码规范

* js 中普通字符串声明使用单引号（需转义的情况除外），仅在需要变量注入时使用模板字符串，JSX 标签的属性值声明应使用双引号；
* 文件一般都要写头部注释，业务页面组件一定要写头部注释，注释中不要涉及该文件的 创建时间、维护者，这些都可以通过 git 命令查看，且维护 作者、时间也是一项成本

```js
/**
 * @File: 统计分析
 * @TODO: 将近12月的moment处理提为公有
 * @Docs: https://某某issue的URL
 */
```

* js 语句结尾不使用分号，CSS 中属性值需要写分号；
* 注意变量、函数、组件命名语义化
* 注意类型转换的正确方式：

```js
// 转 String
const totalScore = this.reviewScore + '' // bad
const totalScore = String(this.reviewScore) // good - 统一用这种方式

// 转 Number
const val = new Number(inputValue) // bad
const val = +inputValue // bad
const val = inputValue >> 0 // bad
const val = parseInt(inputValue) // bad
const val = Number(inputValue) // good - 统一用这种方式
const val = parseInt(inputValue, 10) // good

// 转 Boolean
const hasAge = new Boolean(age) // bad
const hasAge = Boolean(age) // good - 统一用这种方式
const hasAge = !!age // good
```

* 在需要的地方进行变量声明，而不是将他们置顶函数，因为 `let` 和 `const` 是块级作用域而不是函数作用域。Eg：

```js
function() { // good
  test()
  console.log('doing stuff..')

  const name = getName()
  if (name === 'test') {
    return false;
  }
  return name
}

function(hasName) { // bad - unnecessary function call
  const name = getName()

  if (!hasName) {
    return false
  }
  this.setFirstName(name)
  return true
}
```

* 使用 `===`，避免使用 `==`，例外是当需要判断 `null || undefined` 时可以使用 `obg == null`；
* 使用浏览器全局变量时加上 `window` 前缀，`document` 和 `navigator` 除外；
* 不要使用下划线 _ 结尾或开头来命名属性和方法，实际上仅通过改变命名，它依然不是私有的，文件模块的私有方法一般在 Class 外通过 function 定义
* 使用默认值语法设置函数参数的默认值
* 由于 ES6 修饰器 decorator 尚未纳入 ES 规范，且 CRA 不推荐使用 decorator，我们暂不使用修饰器；
* 请统一将编辑器设置为“保存时在文件末尾添加一个空行”，这样便于 Review Git Commit 的文件修改一致性
* 一行中代码超过 120 字符时，应进行适当的换行处理，Eg:

```jsx
render() {
  const { reactState01, reactState02, reactState03, reactState04, reactState05, reactState06, reactState07,
          reactState08, reactState09, reactState10 } = this.state
  return (
    <ComponentA
      componentProp1="prop1"
      componentProp2="prop2"
      componentProp3="prop3"
      componentProp4="prop4"
      componentProp5="prop5"
      componentProp6="prop6"
    >
      ...
    </ComponentA>
  )
}
```

* 函数的参数如果是对象的成员，优先使用解构赋值，Eg：

```js
// bad
function getFullName(user) {
  const firstName = user.firstName
  const lastName = user.lastName
}

// good
function getFullName(obj) {
  const { firstName, lastName } = obj
}

// best
function getFullName({ firstName, lastName }) {}
```

* 对象尽量静态化，一旦定义，就不得随意添加新的属性。如果添加属性不可避免，要使用 `Object.assign` 方法，Eg：

```js
// bad
const a = {}
a.x = 3

// if reshape unavoidable
const a = {}
Object.assign(a, { x: 3 })

// good
const a = { x: null }
a.x = 3
```

* 使用扩展运算符（...）拷贝数组，Eg：

```js
// bad
const len = items.length
const itemsCopy = []
let i

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i]
}

// good
const itemsCopy = [...items]
```

* 使用 `Array.from` 方法，将类似数组的对象转为数组，Eg：

```js
const foo = document.querySelectorAll('.foo')
const nodes = Array.from(foo)
```

* 箭头函数取代 `Function.prototype.bind`，不应再用 self/_this/that 绑定 this，Eg：

```js
// bad
const self = this
const boundMethod = function(...params) {
  return method.apply(self, params)
}

// acceptable
const boundMethod = method.bind(this)

// best
const boundMethod = (...params) => method.apply(this, params)
```

* 声明函数时，所有配置项都应该集中在一个对象，放在最后一个参数，布尔值不可以直接作为参数，Eg：

```js
// bad
function divide(a, b, option = false) {}

// good
function divide(a, b, { option = false } = {}) {}
```

* 不要在函数体内使用 arguments 变量，使用 rest 运算符（...）代替。因为 rest 运算符显式表明你想要获取参数，而且 arguments 是一个类似数组的对象，而 rest 运算符可以提供一个真正的数组，Eg：

```js
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments)
  return args.join('')
}

// good
function concatenateAll(...args) {
  return args.join('')
}
```

* 注意区分 Object 和 Map，只有模拟现实世界的实体对象时，才使用 Object。如果只是需要 key: value 的数据结构，使用 Map 结构。因为 Map 有内建的遍历机制，Eg：

```js
let map = new Map(arr)

for (let key of map.keys()) { console.log(key) }

for (let value of map.values()) { console.log(value) }

for (let item of map.entries()) { console.log(item) }
```

### ES 最佳实践

* 区分 `for`、`forEach()`、`map()` 方法的使用：`for` 可以中途 `break` 掉，而 `forEach()` 不可以，`forEach()` 没有返回值，`map()` 会返回一个新数组；
* 常使用 `Array.prototype.every()` 或 `Array.prototype.some()` 进行数组元素的真值测试，并可以使用 `Array.prototype.find()` 或 `Array.prototype.findIndex()` 提前终止真值测试；
* 不要过度使用逻辑运算符 `||`、`&&` 来简化逻辑处理编码，保证可读性是第一位的，该使用 `if else` 就要用；
* 使用解构存取和使用多属性对象。Eg：

```js
function getFullName(user) { // bad
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

function getFullName(obj) { // good
  const { firstName, lastName } = obj;
  return `${firstName} ${lastName}`;
}

function getFullName({ firstName, lastName }) { // best
  return `${firstName} ${lastName}`;
}
```

## JSX 编码规范

* 对于 JSX 属性值总是使用双引号("), 其他均使用单引号(')

```jsx
// bad
<Foo bar='bar' />

// good
<Foo bar="bar" />

// bad
<Foo style={{ left: "20px" }} />

// good
<Foo style={{ left: '20px' }} />
```

* props 属性如果为 true，可以直接省略。Eg. `<Foo hidden />`；
* 避免使用数组的 index 来作为属性 key 的值，应使用唯一 ID，无唯一 ID 情况下可以组合字段值；
* 对于所有非必须的属性，总是手动去定义 defaultProps 属性。propTypes 可以作为模块的文档说明, 并且声明 defaultProps 的话意味着阅读代码的人不需要去假设一些默认值。更重要的是, 显式地声明默认属性可以让你的模块跳过属性类型的检查。

```jsx
function SFC({ foo, bar, children }) {
  return <div>{foo}{bar}{children}</div>;
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};
SFC.defaultProps = {
  bar: '',
  children: null,
};
```

* 总是在 `Refs` 里使用回调函数。Eg. `<Foo ref={(ref) => { this.myRef = ref }} />`；

## 参考资源

* [standardjs](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)
* [Airbnb JavaScript Style Guide](https://github.com/sivan/javascript-style-guide/blob/master/es5/README.md)
* [Airbnb ES6 规范](https://github.com/yuche/javascript)
* [Airbnb React/JSX 编码规范](https://github.com/JasonBoy/javascript/tree/master/react)
* [es6tutorial](https://github.com/ruanyf/es6tutorial/blob/gh-pages/docs/style.md)
