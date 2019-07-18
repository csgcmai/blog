# ES 编码风格指南

> 2018.04.20 发布，最后更新于 2019.07.18

## （一）箭头函数

* 如果一个函数适合用一行写出并且只有一个参数，那就把花括号、圆括号和 `return` 都省略掉。如果不是，那就不要省略。（为什么？语法糖。在链式调用中可读性很高。）

```js
// good
[1, 2, 3].map(x => x * x);

// good
[1, 2, 3].reduce((total, n) => {
  return total + n;
}, 0);
```

## （二）变量

* 将所有的 `const` 和 `let` 分组。当需要把已赋值变量赋值给未赋值变量时非常有用

```js
// bad
let i, len, dragonball,
    items = getItems(),
    goSportsTeam = true

// bad
let i
const items = getItems()
let dragonball
const goSportsTeam = true
let len

// good
const goSportsTeam = true
const items = getItems()
let dragonball
let i
let length
```

## （三）比较运算符和等号

* 使用简写

```js
// bad
if (name !== '') {
  // ...stuff...
}

// good
if (name) {
  // ...stuff...
}

// bad
if (collection.length > 0) {
  // ...stuff...
}

// good
if (collection.length) {
  // ...stuff...
}
```

## （四）块

如果通过 `if` 和 `else` 使用多行代码块，把 `else` 放在 `if` 代码块关闭括号的同一行。

```js
// bad
if (test) {
  thing1();
  thing2();
}
else {
  thing3();
}

// good
if (test) {
  thing1();
  thing2();
} else {
  thing3();
}
```

## （五）注释

* 给注释增加 `FIXME` 或 `TODO` 的前缀可以帮助其他开发者快速了解这是一个需要复查的问题，或是给需要实现的功能提供一个解决方式。这将有别于常见的注释，因为它们是可操作的。使用 `FIXME -- need to figure this out` 或者 `TODO -- need to implement`。

```js
// 使用 FIXME 标注问题
function Calculator() {

  // FIXME: shouldn't use a global here
  total = 0

  return this
}

// 使用 TODO 标注问题的解决方式
function Calculator() {

  // TODO: total should be configurable by an options param
  this.total = 0

  return this
}
```

## （六）空白

* 使用2个空格作为缩进
* 在大括号前添加一个空格

```js
// bad
function test(){
  console.log('test')
}

// good
function test() {
  console.log('test')
}

// bad
dog.set('attr',{
  age: '1 year',
  breed: 'Bernese Mountain Dog'
})

// good
dog.set('attr', {
  age: '1 year',
  breed: 'Bernese Mountain Dog'
})
```

* 在控制语句（`if`、`while` 等）的小括号前放一个空格。在函数调用及声明中，不在函数的参数列表前加空格。

```js
// bad
if(isJedi) {
  fight ()
}

// good
if (isJedi) {
  fight()
}

// bad
function fight () {
  console.log ('Swooosh!')
}

// good
function fight() { // 函数声明
  console.log('Swooosh!') // 函数调用
}
```

* 使用空格把运算符隔开

```js
// bad
var x=y+5

// good
var x = y + 5
```

* 在文件末尾插入一个空行
* 在使用长方法链时进行缩进。使用前面的点 . 强调这是方法调用而不是新语句

```js
// bad
$('#items').find('.selected').highlight().end().find('.open').updateCount()

// bad
$('#items').
  find('.selected').
    highlight().
    end().
  find('.open').
    updateCount()

// good
$('#items')
  .find('.selected')
    .highlight()
    .end()
  .find('.open')
    .updateCount()
```

## （七）逗号

* 增加结尾的逗号: 需要。为什么? 这会让 `git diffs` 更干净。另外，像 `babel` 这样的转译器会移除结尾多余的逗号，也就是说不必担心老旧浏览器的尾逗号问题。

```js
// bad - git diff without trailing comma
const hero = {
     firstName: 'Florence',
-    lastName: 'Nightingale'
+    lastName: 'Nightingale',
+    inventorOf: ['coxcomb graph', 'modern nursing']
}

// good - git diff with trailing comma
const hero = {
     firstName: 'Florence',
     lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing'],
}

// bad
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
}

const heroes = [
  'Batman',
  'Superman'
]

// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
}

const heroes = [
  'Batman',
  'Superman',
]
```
