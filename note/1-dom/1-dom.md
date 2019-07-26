# DOM 重点知识汇总

> 2019.07.26 发布，最后更新于 2019.07.26
>
> 《JavaScript高级程序设计（第3版）》第 10 ~ 13 章笔记：DOM、DOM 扩展、DOM2 和 DOM 3

DOM（文档对象模型）是针对HTML和XML文档的一个API（应用程序编程接口）。DOM描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。

## 10.1 节点层次

### Node 类型

JavaScript 中的所有节点类型都继承自 `Node` 类型，因此所有节点类型都共享着相同的基本属性和方法。

每个节点都有一个 `nodeType` 属性，用于表明节点的类型。节点类型由在 `Node` 类型中定义的下列 12 个数值常量来表示，任何节点类型必居其一：

* `Node.ELEMENT_NODE`(1)
* `Node.ATTRIBUTE_NODE`(2)
* `Node.TEXT_NODE`(3)
* `Node.CDATA_SECTION_NODE`(4)
* `Node.ENTITY_REFERENCE_NODE`(5)
* `Node.ENTITY_NODE`(6)
* `Node.PROCESSING_INSTRUCTION_NODE`(7)
* `Node.COMMENT_NODE`(8)
* `Node.DOCUMENT_NODE`(9)
* `Node.DOCUMENT_TYPE_NODE`(10)
* `Node.DOCUMENT_FRAGMENT_NODE`(11)
* `Node.NOTATION_NODE`(12)

为了确保跨浏览器兼容，最好还是将 `nodeType` 属性与数字值进行比较，如下所示：

```js
if (someNode.nodeType == 1) { // 适用于所有浏览器
  alert('Node is an element.')
}
```

要了解节点的具体信息，可以使用 `nodeName` 和 `nodeValue` 这两个属性。这两个属性的值完全取决于节点的类型。对于元素节点，`nodeName` 中保存的始终都是元素的标签名，而 `nodeValue` 的值则始终为 `null`。

每个节点都有一个 `childNodes` 属性，其中保存着一个 `NodeList` 对象。`NodeList` 是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。

`NodeList` 对象的独特之处在于，它实际上是基于 DOM 结构动态执行查询的结果，因此 DOM 结构的变化能够自动反映在 `NodeList` 对象中。我们常说，`NodeList` 是有生命、有呼吸的对象，而不是在我们第一次访问它们的某个瞬间拍摄下来的一张快照。

每个节点都有一个 `parentNode` 属性，该属性指向文档树中的父节点。包含在 `childNodes` 列表中的所有节点都具有相同的父节点，因此它们的 `parentNode` 属性都指向同一个节点。此外，包含在 `childNodes` 列表中的每个节点相互之间都是同胞节点。通过使用列表中每个节点的 `previousSibling` 和 `nextSibling` 属性，可以访问同一列表中的其他节点。列表中第一个节点的 `previousSibling` 属性值为 `null`，而列表中最后一个节点的 `nextSibling` 属性的值同样也为 `null`。

父节点与其第一个和最后一个子节点之间也存在特殊关系。父节点的 `firstChild` 和 `lastChild` 属性分别指向其 `childNodes` 列表中的第一个和最后一个节点。

![chart-event](./assets/1-dom-relation.png)

另外，`hasChildNodes()` 也是一个非常有用的方法，这个方法在节点包含一或多个子节点的情况下返回 `true`；应该说，这是比查询 `childNodes` 列表的 `length` 属性更简单的方法。所有节点都有的最后一个属性是 `ownerDocument`，该属性指向表示整个文档的文档节点。

因为关系指针都是只读的，所以 DOM 提供了一些操作节点的方法。其中，最常用的方法是 `appendChild()`，用于向 `childNodes` 列表的末尾添加一个节点。添加节点后，`childNodes` 的新增节点、父节点及以前的最后一个子节点的关系指针都会相应地得到更新。更新完成后，`appendChild()` 返回新增的节点。如果传入到 `appendChild()` 中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置转移到新位置。

如果需要把节点放在 `childNodes` 列表中某个特定的位置上，而不是放在末尾，那么可以使用 `insertBefore()` 方法。这个方法接受两个参数：要插入的节点和作为参照的节点。插入节点后，被插入的节点会变成参照节点的前一个同胞节点（`previousSibling`），同时被方法返回。如果参照节点是 `null`，则 `insertBefore()` 与 `appendChild()` 执行相同的操作。

`replaceChild()` 方法接受两个参数：要插入的节点和要替换的节点。要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置。

如果只想移除而非替换节点，可以使用 `removeChild()` 方法。这个方法接受一个参数，即要移除的节点。被移除的节点将成为方法的返回值。与使用 `replaceChild()` 方法一样，通过 `removeChild()` 移除的节点仍然为文档所有，只不过在文档中已经没有了自己的位置。

有两个方法是所有类型的节点都有的。第一个就是 `cloneNode()`，用于创建调用这个方法的节点的一个完全相同的副本。`cloneNode()` 方法接受一个布尔值参数，表示是否执行深复制。在参数为 `true` 的情况下，执行深复制，也就是复制节点及其整个子节点树；在参数为 `false` 的情况下，执行浅复制，即只复制节点本身。复制后返回的节点副本属于文档所有，但并没有为它指定父节点。因此，这个节点副本就成为了一个“孤儿”，除非通过 `appendChild()`、`insertBefore()` 或 `replaceChild()` 将它添加到文档中。

PS: `cloneNode()` 方法不会复制添加到 DOM 节点中的 JavaScript 属性，例如事件处理程序等。这个方法只复制特性、（在明确指定的情况下也复制）子节点，其他一切都不会复制。

我们要介绍的最后一个方法是 `normalize()`，这个方法唯一的作用就是处理文档树中的文本节点。由于解析器的实现或 DOM 操作等原因，可能会出现文本节点不包含文本，或者接连出现两个文本节点的情况。当在某个节点上调用这个方法时，就会在该节点的后代节点中查找上述两种情况。如果找到了空文本节点，则删除它；如果找到相邻的文本节点，则将它们合并为一个文本节点。

### Document 类型

JavaScript 通过 `Document` 类型表示文档。在浏览器中，`document` 对象是 `HTMLDocument`（继承自 `Document` 类型）的一个实例，表示整个 HTML 页面。`Document` 节点具有下列特征：

* `nodeType` 的值为 `9`；
* `nodeName` 的值为 `#document`；
* `nodeValue` 的值为 `null`；
* `parentNode` 的值为 `null`；
* `ownerDocument` 的值为 `null`；
* 其子节点可能是一个 `DocumentType`（最多一个）、`Element`（最多一个）、`ProcessingInstruction` 或 `Comment`

文档的子节点：

* 通过 `document.documentElement` 取得对 `<html>` 的引用；
* 通过 `document.body` 取得对 `<body>` 的引用；
* 通过 `document.doctype` 取得对 `<!DOCTYPE>` 的引用；

文档信息：

* 通过 `document.title` 取得或设置文档标题；
* 通过 `document.URL` 取得页面完整 URL（即地址栏中显示的 URL）；
* 通过 `document.domain` 取得页面域名（只有 `domain` 是可以设置的，但不能将这个属性设置为 URL 中不包含的域）；
* 通过 `document.referrer` 取得来源页面的 URL（链接到当前页面的那个页面的 URL）；

查找元素：

* `document.getElementById()`：接收一个参数：要取得的元素的 `ID`。如果找到相应的元素则返回该元素，如果不存在带有相应 `ID` 的元素，则返回 `null`；
* `document.getElementsByTagName()`：这个方法接受一个参数，即要取得元素的标签名，而返回的是包含零或多个元素的 `NodeList`。在 HTML 文档中，这个方法会返回一个 `HTMLCollection` 对象，作为一个“动态”集合。`HTMLCollection` 对象有个方法叫做 `namedItem()`，使用这个方法可以通过元素的 `name` 属性取得集合中的项。
* `document.getElementsByName()`：返回带有给定 `name` 属性的所有元素；

特殊集合：

除了属性和方法，`document` 对象还有一些特殊的集合。这些集合都是 `HTMLCollection` 对象，为访问文档常用的部分提供了快捷方式，包括：

* `document.anchors`：包含文档中所有带 `name` 属性的 `<a>` 元素；
* `document.applets`：包含文档中所有的 `<applet>` 元素，因为不再推荐使用 `<applet>` 元素，所以这个集合已经不建议使用了；
* `document.forms`，包含文档中所有的 `<form>` 元素，与 `document.getElementsByTagName("form")` 得到的结果相同；
* `document.images`，包含文档中所有的 `<img>` 元素，与 `document.getElementsByTagName("img")` 得到的结果相同；
* `document.links`，包含文档中所有带 `href` 属性的 `<a>` 元素。
