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
