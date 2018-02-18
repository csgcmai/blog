CSS BEM 规范
===
> 2018.02.18 发布，最后更新于 2018.02.18

## 概要

> BEM (Block, Element, Modifier) is a component-based approach to web development. The idea behind it is to divide the user interface into independent blocks. This makes interface development easy and fast even with a complex UI, and it allows reuse of existing code without copying and pasting.

BEM（块、元素、修饰符）基于Web开发中的组件化实现方式。背后思想是将用户界面拆分成独立的块。这使得即便在复杂UI场景下，界面开发也十分的简单和迅速，并且这套方案允许我们在不使用复制粘贴的情况下重用现有代码。

## Block（块）

> A functionally independent page component that can be reused. In HTML, blocks are represented by the class attribute.

功能独立的页面元素（或简单或复杂）被视作一个块，它的 CSS 类名具有唯一性

#### 特点：

* 块的命名用来描述这个块的用途（“它是什么？” —— `menu` or `button`），而不是它的状态（“它是什么样？” —— `red` or `big`）
* The block shouldn't influence its environment, meaning you shouldn't set the external geometry (margin) or positioning for the block
* 不要使用 CSS 标签选择器 和 ID 选择器

这确保了块的独立性，以便于重用块或允许块在不同场景下被使用。

Example：

```html
<!-- 正确 -->
<div class="error"></div>

<!-- 错误，它描述了元素的表现 -->
<div class="red-text"></div>
```

#### 块的使用指南

###### 嵌套

* 块之前可以相互嵌套
* 可以使用任意多的嵌套层级

Example：

```html
<header class="header">
  <div class="logo"</div>
  <form class="search-form"></form>
</header>
```

## Element（元素）

块的组成部分，无法脱离块去使用。

#### 特点

* 元素的命名用来描述这个元素的用途（“它是什么？” —— `item`, `text`, 等等），而不是它的状态（“什么类型，或它是什么样？” —— `red`, `big`, 等等）
* 元素的整个命名结构是 `block-name__element-name`，元素名和块名通过双下划线 __ 分隔。

Example：

```html
<form class="search-form">
  <input class="search-form__input">
  <button class="search-form__button">Search</button>
</form>
```

#### 元素的使用指南

###### 嵌套规则

* 元素之间可以相互嵌套
* 可以使用任意多的嵌套层级
* 一个元素应始终是其块的组成部分，而不是其他元素的。这意味着元素命名不应被定义成类似层级如 `block__elm1__elm2`

Example：

```html
<!-- 正确，所有元素的命名结构都遵循模式 block-name__element-name -->
<form class="search-form">
  <div class="search-form__content">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
  </div>
</form>

<!-- 错误 -->
<form class="search-form">
  <div class="search-form__content">
    <!-- 建议: `search-form__input` 或 `search-form__content-input` -->
    <input class="search-form__content__input">
    <!-- 建议: `search-form__button` 或 `search-form__content-button` -->
    <button class="search-form__content__button">Search</button>
  </div>
</form>
```

块的命名实际上定义了命名空间，以确保其中的元素是基于这个块的。

块在其DOM树中允许存在嵌套结构的元素：

Example：

```html
<div class="block">
    <div class="block__elem1">
        <div class="block__elem2">
            <div class="block__elem3"></div>
        </div>
    </div>
</div>
```

然而，在BEM方法学中，这样的嵌套结构通常对应着扁平的 CSS 选择器定义：

Example：

```css
.block {}
.block__elem1 {}
.block__elem2 {}
.block__elem3 {}
```

这样的好处是，当我们改变块的内部 DOM 结构时，不需要改变每个独立元素的 CSS 代码：

Example：

```html
<div class="block">
    <div class="block__elem1">
        <div class="block__elem2"></div>
    </div>
    <div class="block__elem3"></div>
</div>
```

块的结构虽然变了，但元素的 CSS 规则和命名并未改变。

###### 成员性（Membership）

元素永远都是块的一部分，而不应脱离块去单独使用它们。

Example：

``` html
<!-- 正确， 元素均处于 `search-form` 块内 -->
<form class="search-form">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
</form>

<!-- 错误， 元素位于了 `search-form` 块的外部 -->
<form class="search-form"></form>
<input class="search-form__input">
<button class="search-form__button">Search</button>
```

###### 可选择性（Optionality）

元素相对于块组件是可选的。并非所有的块一定要具备元素。

Example：

```html
<div class="search-form">
    <input class="input">
    <button class="button">Search</button>
</div>
```
