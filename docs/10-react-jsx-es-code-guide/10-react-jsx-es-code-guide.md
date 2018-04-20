React/JSX/ES 编码规范及最佳实践
===
> 2018.03.13 发布，最后更新于 2018.04.20

## ES

#### ES 编码规范

* js 中普通字符串声明使用单引号（需转义的情况除外），仅在需要变量注入时使用模板字符串，JSX 标签的属性值声明应使用双引号；
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
* 由于 ES6 修饰器 decorator 尚未纳入 ES 规范，且 CRA 不推荐使用 decorator，我们暂不使用修饰器；
* 请统一将编辑器设置为“保存时在文件末尾添加一个空行”，这样便于 Review Git Commit 的文件修改一致性
* 一行中代码超过 120 字符时，应进行适当的换行处理，Eg:

```js
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

#### ES 最佳实践

* 区分 `for`、`forEach()`、`map()` 方法的使用：`for` 可以中途 `break` 掉，而 `forEach()` 不可以，`forEach()` 没有返回值，`map()` 会返回一个新数组；
* 常使用 `Array.prototype.every()` 或 `Array.prototype.some()` 进行数组元素的真值测试，并可以使用 `Array.prototype.find()` 或 `Array.prototype.findIndex()` 提前终止真值测试；
* 不要过度使用逻辑运算符 `||`、`&&` 来简化逻辑处理编码，保证可读性是第一位的，该使用 if else 就要用。
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

## React

#### React 编码规范

* 表示组件的目录、js 文件应使用大驼峰命名；
* React Component 内的 state 声明要写注释；
* 进行公有组件封装时，要使用 `prop-types` 进行组件 props 的类型声明与检测；
* 优先使用以下方式进行 Class 的实例属性声明，这种方式来 设置 `state` 和处理函数可以避免不必要的 `constructor`声明和 `bind()`：

```js
class Demo extends Component {
  state = {
    startDate: '2018-03-02',
    endDate: '2018-03-03'
  }
  handleIptChange = () => {
    ...
  }
}
```

* 函数内先使用 `const` 将该函数体内用到的 `state` 和 `props` 索引出来，再进行具体逻辑的编码，Eg:

```js
handlePlanExport = () => {
  const { startDate, endDate } = this.state
  const { account } = this.props
  ...
}
```

#### React 最佳实践

* 合理进行 render() 逻辑的拆分
* 区分智能组件与木偶组件的使用
* 强调无状态组件的使用
* 合理拆分 PureComponent
* 区分 React State、Redux Store、Redux Persist 的使用
* 区分 索引 API 请求 与 dispatch action 的区别，并且仅在必要时使用 redux-thunk dispatch 异步 action
* 仅在该文件模块确实需要作为出口导出时使用 `export * from`，避免它的滥用，actions、apis、data、helpers 应该具体模块去引入
* 避免直接修改 state 或 props，必要时使用 `_.cloneDeep`、对象数组结构 或 `immutableData` 来拷贝后操作
* 尽量避免使用匿名函数作为处理函数
* package.json 中的依赖包请锁定版本号，去掉前面的 `^`
* 设置 Git 对大小写敏感 `git config --global core.ignorecase false`

#### 项目目录结构

一个常见的项目架构往往包含以下目录：

```
-src
  |--actions // Redux Action Creators
  |--apis // 索引 HTTP 请求
  |--assets // 静态资源
      |--css
          |--basic.css // 公有布局
          |--property.css // 面向属性的 CSS
          |--resetNormalize.css // 覆盖 normalize.css 的全局样式
          |--resetAntd.css // 效果上无法接受 AntD 默认样式，又无法通过 config-overrides 去设置 less 变量实现的覆盖样式（慎用）
      |--img
  |--components // 公有组件
  |--constants // Redux 相关的常量配置
      |--actionTypes.js // 索引 actionType，避免在 action creator 和 reducer 中硬编码
      |--initialStore.js // 初始化 Store 结构及初始值
  |--data // 公有数据
      |--colors.js // 色彩常量
      |--dimensions.js // 布局尺寸相关
      ...
  |--helpers // 公有的业务辅助函数
  |--reducers // Redux Reducers
  |--routes // 涉及路由匹配的业务组件（页面）
```

#### Component 文件结构

注意 import 及 React 组件生命周期编码顺序。一个常见的编码 React Component 的目录结构：

```js
/**
 * @File: 统计分析
 * @TODO: 将近12月的moment处理提为公有
 * @Docs: https://某某issue的URL
 */

// 导入第三方库，一般先列出 React 核心库，再列出社区第三方库
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Layout, Icon, message, Tabs, DatePicker } from 'antd'
import moment from 'moment'
import _ from 'lodash'
// 导入项目公有组件
import SliderMenu from '../../components/SliderMenu'
import GlobalHeader from '../../components/GlobalHeader'
// 导入项目业务组件
import OrderCompany from './OrderCompany'
import Salesman from './Salesman'
// 导入项目常量配置
import * as colors from '../../data/colors'
import * as dimensions from '../../data/dimensions'
// 导入 Apis 及 Action Creators
import { fetchOrderCompany, fetchSalesman } from '../../apis/statistic'
import { saveOrderCompany } from '../../actions/statistic'
// CSS 模块化
import styles from './index.module.css'

// AntD 常量声明
const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker
// 其他组件常量相关的常量声明
const DATE_FORMAT = 'YYYY-MM'
const TABS = [
  'resourceCollect', // 趋势汇总
  'orderCompany', // 订货单位
  'areaDistribution', // 地域分布
  'salesman' // 销售员
]

// 不需要绑定实例的业务处理函数
function formatTablePagination(requestCfg) {
  return {
    ...requestCfg,
    current: requestCfg.page || 1,
    pageSize: requestCfg.size || 10,
    field: requestCfg.sortWay || '',
    order: requestCfg.order === 'desc' ? 'descend' : 'ascend'
  }
}

class Statistic extends Component {
  // state 设置
  state = {
    // 用于接口请求
    startDate: moment().subtract(11, 'months').format(DATE_FORMAT), // 默认展示近12月
    endDate: moment().format(DATE_FORMAT), // 本月
    // UI 交互
    isRangePickerOpen: false,
    // feched 数据
    orderCompanyData: null,
    salesmanData: []
  }
  // 定时器设置
  fetchTimer = null
  // 除 render() 外的组件生命周期编码
  componentWillMount() { ... } // 模块渲染前
  componentDidMount() { ... } // 模块渲染后
  componentWillReceiveProps() { ... } // 模块接收 props
  shouldComponentUpdate() { ... } // 判断模块需不需要重新渲染
  componentWillUpdate() { ... } // 上面的方法返回 true， 模块将重新渲染
  componentDidUpdate() { ... } // 模块渲染结束
  componentWillUnMount() { // 模块将从 DOM 中清除, 做一些清理任务
    this.fetchTimer && window.clearInterval(this.fetchTimer) // 清空定时器
  }
  // 对请求及请求到数据后处理的重复逻辑封装
  requestOrderCompany = (params) => {
    const fetchParams = { // 默认请求参数的配置
      isDelete: false,
      ...params
    }
    fetchOrderCompany(fetchParams).then((res) => {
      this.setState({ orderCompanyData: res.data })
    })
  }
  // Handlers
  handleIptChange = (e) => { ... }
  handleTabChange = (key) => { ... }
  // 从 render 拆分出来的渲染逻辑
  renderOrderCompanyTab = () => { ... }
  renderTabsExtra = () => { ... }
  // render() 主逻辑放在最底部
  render() { ... }
}

// 结合 Router 或者 ReduxStore，非必须
export default connect((state) => {
  const { common, account } = state
  return { common, account }
})(Statistic)
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

* props 属性如果为 true，可以直接省略。Eg. `<Foo hidden />`
* 避免使用数组的 index 来作为属性 key 的值，应使用唯一 ID，无唯一 ID 情况下可以组合字段值
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

* 总是在 Refs 里使用回调函数。Eg. `<Foo ref={(ref) => { this.myRef = ref }} />`

## 参考资源

* [standardjs](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)
* [Airbnb JavaScript Style Guide](https://github.com/sivan/javascript-style-guide/blob/master/es5/README.md)
* [Airbnb ES6 规范](https://github.com/yuche/javascript)
* [Airbnb React/JSX 编码规范](https://github.com/JasonBoy/javascript/tree/master/react)
