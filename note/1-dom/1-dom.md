# DOM 重点知识汇总

> 2019.07.29 发布，最后更新于 2019.07.29
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

### Element 类型

除了 `Document` 类型之外，`Element` 类型就要算是 Web 编程中最常用的类型了。`Element` 类型用于表现 XML 或 HTML 元素，提供了对元素标签名、子节点及特性的访问。`Element` 节点具有以下特征：

* `nodeType` 的值为 `1`；
* `nodeName` 的值为元素的标签名，也可以使用 `tagName` 属性，两者返回值相同；
* `nodeValue` 的值为 `null`；
* `parentNode` 可能是 `Document` 或 `Element`；
* 其子节点可能是 `Element`、`Text`、`Comment`、`ProcessingInstruction`、`CDATASection` 或 `EntityReference`。

**HTML 元素**：

所有 HTML 元素都由 `HTMLElement` 类型表示，`HTMLElement` 类型直接继承自 `Element` 并添加了一些属性。添加的这些属性分别对应于每个 `HTML` 元素中都存在的下列标准特性（可以取得或设置它们）：

* `id`，元素在文档中的唯一标识符；
* `title`，有关元素的附加说明信息，一般通过工具提示条显示出来；
* `lang`，元素内容的语言代码，很少使用；
* `dir`，语言的方向，值为 `"ltr"`（left-to-right，从左至右）或 `"rtl"`（right-to-left，从右至左），也很少使用；
* `className`，与元素的 `class` 特性对应，即为元素指定的 CSS 类。没有将这个属性命名为 class，是因为 class 是 ECMAScript 的保留字；

以上特性对应如下例子中的 HTML 元素：

`<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>`

**取得与设置特性（属性）**：

每个元素都有一或多个特性，这些特性的用途是给出相应元素或其内容的附加信息。操作特性的 DOM 方法主要有三个：

* `getAttribute()`：通过 `getAttribute()` 方法也可以取得自定义特性（即标准 HTML 语言中没有的特性）的值。根据 HTML5 规范，自定义特性应该加上 `data-` 前缀以便验证。
* `setAttribute()`
* `removeAttribute()`

**`attributes` 属性**：

`Element` 类型是使用 `attributes` 属性的唯一一个 DOM 节点类型。`attributes` 属性中包含一个 `NamedNodeMap`，与 `NodeList` 类似，也是一个“动态”的集合。元素的每一个特性都由一个 `Attr` 节点表示，每个节点都保存在 `NamedNodeMap` 对象中。`NamedNodeMap` 对象拥有下列方法：

* `getNamedItem_(name)_`：返回 `nodeName` 属性等于 `name` 的节点；
* `removeNamedItem_(name)_`：从列表中移除 `nodeName` 属性等于 `name` 的节点；
* `setNamedItem_(node)_`：向列表中添加节点，以节点的 `nodeName` 属性为索引；
* `item_(pos)_`：返回位于数字 `pos` 位置处的节点。

**创建元素**：

使用 `document.createElement()` 方法可以创建新元素。这个方法只接受一个参数，即要创建元素的标签名。

1. 在使用 `createElement()` 方法创建新元素的同时，也为新元素设置了 `ownerDocument` 属性。此时，还可以操作元素的特性，为它添加更多子节点，以及执行其他操作；
2. 在新元素上设置这些特性只是给它们赋予了相应的信息。由于新元素尚未被添加到文档树中，因此设置这些特性不会影响浏览器的显示。要把新元素添加到文档树，可以使用 `appendChild()`、`insertBefore()` 或 `replaceChild()` 方法；
3. 一旦将元素添加到文档树中，浏览器就会立即呈现该元素。此后，对这个元素所作的任何修改都会实时反映在浏览器中。

### Text 类型

文本节点由 `Text` 类型表示，包含的是可以照字面解释的纯文本内容。纯文本中可以包含转义后的 HTML 字符，但不能包含 HTML 代码。`Text` 节点具有以下特征：

* `nodeType` 的值为 `3`；
* `nodeName` 的值为 `"#text"`；
* `nodeValue` 的值为节点所包含的文本；
* `parentNode` 是一个 `Element`；
* 不支持（没有）子节点。

可以通过 `nodeValue` 属性或 `data` 属性访问 `Text` 节点中包含的文本，这两个属性中包含的值相同。对 `nodeValue` 的修改也会通过 `data` 反映出来，反之亦然。使用下列方法可以操作节点中的文本：

* `appendData(text)`：将 `text` 添加到节点的末尾；
* `deleteData(offset, count)`：从 `offset` 指定的位置开始删除 `count` 个字符；
* `insertData(offset, text)`：在 `offset` 指定的位置插入 `text`；
* `replaceData(offset, count, text)`：用 `text` 替换从 `offset` 指定的位置开始到 `offset + count` 为止处的文本；
* `splitText(offset)`：从 `offset` 指定的位置将当前文本节点分成两个文本节点；
* `substringData(offset, count)`：提取从 `offset` 指定的位置开始到 `offset + count` 为止处的字符串；

除了这些方法之外，文本节点还有一个 `length` 属性，保存着节点中字符的数目。而且，`nodeValue.length` 和 `data.length` 中也保存着同样的值。

创建文本节点：

1. 可以使用 `document.createTextNode()` 创建新文本节点，这个方法接受一个参数——要插入节点中的文本。
2. 在创建新文本节点的同时，也会为其设置 `ownerDocument` 属性。不过，除非把新节点添加到文档树中已经存在的节点中，否则我们不会在浏览器窗口中看到新节点。

### Comment 类型

注释在 DOM 中是通过 `Comment` 类型来表示的。`Comment` 节点具有下列特征：

* `nodeType` 的值为 `8`；
* `nodeName` 的值为 `"#comment"`；
* `nodeValue` 的值是注释的内容；
* `parentNode` 可能是 `Document` 或 `Element`；
* 不支持（没有）子节点。

`Comment` 类型与 `Text` 类型继承自相同的基类，因此它拥有除 `splitText()` 之外的所有字符串操作方法。与 `Text` 类型相似，也可以通过 `nodeValue` 或 `data` 属性来取得注释的内容。另外，使用 `document.createComment()` 并为其传递注释文本也可以创建注释节点。

### CDATASection 类型

`CDATASection` 类型只针对基于 XML 的文档，表示的是 CDATA 区域。与 `Comment` 类似，`CDATASection` 类型继承自 `Text` 类型，因此拥有除 `splitText()` 之外的所有字符串操作方法。`CDATASection` 节点具有下列特征：

* `nodeType` 的值为 `4`；
* `nodeName` 的值为 `"#cdata-section"`；
* `nodeValue` 的值是 CDATA 区域中的内容；
* `parentNode` 可能是 `Document` 或 `Element`；
* 不支持（没有）子节点。

### DocumentType 类型

`DocumentType` 类型在 Web 浏览器中并不常用。`DocumentType` 包含着与文档的 `doctype` 有关的所有信息，它具有下列特征：

* `nodeType` 的值为 `10`；
* `nodeName` 的值为 `doctype` 的名称；
* `nodeValue` 的值为 `null`；
* `parentNode` 是 `Document`；
* 不支持（没有）子节点。

DOM1 级描述了 `DocumentType` 对象的3个属性：

* `name`：文档类型的名称；
* `entities`：由文档类型描述的实体的 `NamedNodeMap` 对象；
* `notations`：由文档类型描述的符号的 `NamedNodeMap` 对象；

通常，浏览器中的文档使用的都是 HTML 或 XHTML 文档类型，因而 `entities` 和 `notations` 都是空列表（列表中的项来自行内文档类型声明）。但不管怎样，只有 `name` 属性是有用的。这个属性中保存的是文档类型的名称，也就是出现在 `<!DOCTYPE` 之后的文本。以下面严格型 HTML 4.01 的文档类型声明为例：

`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`

`DocumentType` 的 `name` 属性中保存的就是 `"HTML"`：

`alert(document.doctype.name); // "HTML"`

### DocumentFragment 类型

在所有节点类型中，只有 `DocumentFragment` 在文档中没有对应的标记。DOM 规定文档片段（document fragment）是一种“轻量级”的文档，可以包含和控制节点，但不会像完整的文档那样占用额外的资源。`DocumentFragment` 节点具有下列特征：

* `nodeType` 的值为 `11`；
* `nodeName` 的值为 `"#document-fragment"`；
* `nodeValue` 的值为 `null`；
* `parentNode` 的值为 `null`；
* 子节点可以是 `Element`、`ProcessingInstruction`、`Comment`、`Text`、`CDATASection` 或 `EntityReference`。

虽然不能把文档片段直接添加到文档中，但可以将它作为一个“仓库”来使用，即可以在里面保存将来可能会添加到文档中的节点。要创建文档片段，可以使用 `document.createDocumentFragment()` 方法。

文档片段继承了 `Node` 的所有方法，通常用于执行那些针对文档的 DOM 操作。如果将文档中的节点添加到文档片段中，就会从文档树中移除该节点，也不会从浏览器中再看到该节点。添加到文档片段中的新节点同样也不属于文档树。可以通过 `appendChild()` 或 `insertBefore()` 将文档片段中内容添加到文档中。在将文档片段作为参数传递给这两个方法时，实际上只会将文档片段的所有子节点添加到相应位置上；文档片段本身永远不会成为文档树的一部分。

**应用示例**：

`<ul id="myList"></ul>`

假设我们想为这个 `<ul>` 元素添加3个列表项。如果逐个地添加列表项，将会导致浏览器反复渲染（呈现）新信息。为避免这个问题，可以像下面这样使用一个文档片段来保存创建的列表项，然后再一次性将它们添加到文档中：

```js
var fragment = document.createDocumentFragment()
var ul = document.getElementById('myList')
var li = null

for (var i = 0; i < 3; i++) {
  li = document.createElement('li')
  li.appendChild(document.createTextNode('Item' + (i + 1)))
  fragment.appendChild(li)
}

ul.appendChild(fragment)
```

### Attr 类型

元素的特性在 DOM 中以 `Attr` 类型来表示。在所有浏览器中（包括 IE8），都可以访问 `Attr` 类型的构造函数和原型。从技术角度讲，特性就是存在于元素的 `attributes` 属性中的节点。特性节点具有下列特征：

* `nodeType` 的值为 `2`；
* `nodeName` 的值是特性的名称；
* `nodeValue` 的值是特性的值；
* `parentNode` 的值为 `null`；
* 在 HTML 中不支持（没有）子节点；
* 在 XML 中子节点可以是 `Text` 或 `EntityReference`。

尽管它们也是节点，但特性却不被认为是 DOM 文档树的一部分。开发人员最常使用的是 `getAttribute()`、`setAttribute()` 和`removeAttribute()` 方法，很少直接引用特性节点。

`Attr` 对象有3个属性：

* `name`：特性名称（与 `nodeName` 的值相同）；
* `value`：特性的值（与 `nodeValue` 的值相同）；
* `specified`：布尔值，用以区别特性是在代码中指定的，还是默认的；

## 10.2 DOM 操作技术

### 动态脚本

通过调用 `loadScript` 这个函数来加载外部 javascript 文件：

```js
function loadScript(url) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  document.body.appendChild(script)
}
```

### 动态样式

与动态脚本类似，所谓动态样式是指在页面刚加载时不存在的样式；动态样式是在页面加载完成后动态添加到页面中的。

以下面这个典型的 `<link>` 元素为例：

`<link rel="stylesheet" type="text/css" href="styles.css">`

```js
function loadStyles(url) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/javascript'
  var head = document.getElementByTagName('head')[0]
  head.appendChild(link)
}
```

### 操作表格

为方便构建表格，HTML DOM 为 `<table>`、`<tbody>` 和 `<tr>` 元素添加了一些属性和方法。

为 `<table>` 元素添加的属性和方法：

* `caption`：保存着对 `<caption>` 元素（如果有）的指针；
* `tBodies`：是一个 `<tbody>` 元素的 `HTMLCollection`；
* `tFoot`：保存着对 `<tfoot>` 元素（如果有）的指针；
* `tHead`：保存着对 `<thead>` 元素（如果有）的指针；
* `rows`：是一个表格中所有行的 `HTMLCollection`；
* `createTHead()`：创建 `<thead>` 元素，将其放到表格中，返回引用；
* `createTFoot()`：创建 `<tfoot>` 元素，将其放到表格中，返回引用；
* `createCaption()`：创建 `<caption>` 元素，将其放到表格中，返回引用；
* `deleteTHead()`：删除 `<thead>` 元素；
* `deleteTFoot()`：删除 `<tfoot>` 元素；
* `deleteCaption()`：删除 `<caption>` 元素；
* `deleteRow(_pos_)`：删除指定位置的行；
* `insertRow(_pos_)`：向 `rows` 集合中的指定位置插入一行；

为 `<tbody>` 元素添加的属性和方法：

* `rows`：保存着 `<tbody>` 元素中行的 `HTMLCollection`；
* `deleteRow(pos)`：删除指定位置的行；
* `insertRow(pos)`：向 `rows` 集合中的指定位置插入一行，返回对新插入行的引用；

为 `<tr>` 元素添加的属性和方法：

* `cells`：保存着 `<tr>` 元素中单元格的 `HTMLCollection`；
* `deleteCell(pos)`：删除指定位置的单元格；
* `insertCell(pos)`：向 `cells` 集合中的指定位置插入一个单元格，返回对新插入单元格的引用；

### 使用 NodeList

`NodeList`、`NamedNodeMap`、`HTMLCollection` 这三个集合都是动态的，每当文档结构发生变化时，它们都会得到更新。

一般来说，应该尽量减少访问 `NodeList` 的次数。因为每次访问 `NodeList`，都会运行一次基于文档的查询。所以，可以考虑将从 `NodeList` 中取得的值缓存起来。

下面例子中初始化了第二个变量 `len`。由于 `len` 中保存着对 `divs.length` 在循环开始时的一个快照，因此就可以避免无限循环问题：

```js
var divs = document.getElementByTagName('div'),
    i,
    len,
    div
for (i = 0, len = divs.length; i < len; i++) {
  div = document.createElement('div')
  document.body.appendChild(div)
}
```

理解 DOM 的关键，就是理解 DOM 对性能的影响。DOM 操作往往是 JavaScript 程序中开销最大的部分，而因访问 `NodeList` 导致的问题最多。`NodeList` 对象都是“动态的”，这就意味着每次访问 `NodeList` 对象，都会运行一次查询。有鉴于此，最好的办法就是尽量减少 `DOM` 操作。

## 11 DOM 扩展

### 11.1 选择符 API

Selectors API（www.w3.org/TR/selectors-api/）是由 W3C 发起制定的一个标准，致力于让浏览器原生支持 CSS 查询。

`querySelector()`：接收一个 CSS 选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 `null`。

通过 `Document` 类型调用 `querySelector()` 方法时，会在文档元素的范围内查找匹配的元素。而通过 `Element` 类型调用 `querySelector()` 方法时，只会在该元素后代元素的范围内查找匹配的元素。

`querySelectorAll()`：接收的参数与 `querySelector()` 方法一样，都是一个 CSS 选择符，但返回的是所有匹配的元素而不仅仅是一个元素。这个方法返回的是一个 `NodeList` 的实例。

与 `querySelector()` 类似，能够调用 `querySelectorAll()` 方法的类型包括 `Document`、`DocumentFragment` 和 `Element`。

`matchesSelector()`：Selectors API Level 2 规范为 `Element` 类型新增了一个方法 `matchesSelector()`。这个方法接收一个参数，即 CSS 选择符，如果调用元素与该选择符匹配，返回 `true`；否则，返回 `false`。（这里补充 [MDN 上的方法描述](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches)）

### 11.2 元素遍历

对于元素间的空格，IE9 及之前版本不会返回文本节点，而其他所有浏览器都会返回文本节点。这样，就导致了在使用 `childNodes` 和 `firstChild` 等属性时的行为不一致。为了弥补这一差异，而同时又保持 DOM 规范不变，Element Traversal 规范（www.w3.org/TR/ElementTraversal/）新定义了一组属性。

Element Traversal API 为 DOM 元素添加了以下 5 个属性：

* `childElementCount`：返回子元素（不包括文本节点和注释）的个数；
* `firstElementChild`：指向第一个子元素；`firstChild` 的元素版；
* `lastElementChild`：指向最后一个子元素；`lastChild` 的元素版；
* `previousElementSibling`：指向前一个同辈元素；`previousSibling` 的元素版；
* `nextElementSibling`：指向后一个同辈元素；`nextSibling` 的元素版；

### 11.3 HTML5

#### 与类相关的扩充

为了让开发人员适应并增加对 `class` 属性的新认识，HTML5 新增了很多 API，致力于简化 CSS 类的用法。

1.`getElementsByClassName()` 方法

可以通过 `document` 对象及所有 HTML 元素调用该方法。`getElementsByClassName()` 方法接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的 `NodeList`。传入多个类名时，类名的先后顺序不重要。Eg：

```js
//取得所有类中包含 "username" 和 "current" 的元素，类名的先后顺序无所谓
var allCurrentUsernames = document.getElementsByClassName("username current");

//取得 ID 为 "myDiv" 的元素中带有类名 "selected" 的所有元素
var selected = document.getElementById("myDiv").getElementsByClassName("selected");
```

2.`classList` 属性

HTML5 新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加 `classList` 属性。这个 `classList` 属性是新集合类型 `DOMTokenList` 的实例。与其他 DOM 集合类似，`DOMTokenList` 有一个表示自己包含多少元素的 `length` 属性，而要取得每个元素可以使用 `item()` 方法，也可以使用方括号语法。此外，这个新类型还定义如下方法:

* `add(value)`：将给定的字符串值添加到列表中。如果值已经存在，就不添加了；
* `contains(value)`：表示列表中是否存在给定的值，如果存在则返回 `true`，否则返回 `false`；
* `remove(value)`：从列表中删除给定的字符串；
* `toggle(value)`：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加它`；

用例：

```js
// 删除 “disabled” 类
div.classList.remove('disabled')

// 添加 “current” 类
div.classList.add('current')

// 切换 “user” 类
div.classList.toggle('user')

// 确定元素中是否包含既定的类名
if (div.classLit.contains('bd') && !div.classList.contains('disabled')) {
  // 执行操作
}

// 迭代类名
for (var i = 0, len = div.classList.length; i < len; i++) {
  doSomething(div.classList[i])
}
```

有了 `classList` 属性，除非你需要全部删除所有类名，或者完全重写元素的 `class` 属性，否则也就用不到 `className` 属性了。

#### 焦点管理

HTML5 也添加了辅助管理 DOM 焦点的功能。首先就是 `document.activeElement` 属性，这个属性始终会引用 DOM 中当前获得了焦点的元素。元素获得焦点的方式有页面加载、用户输入（通常是通过按 Tab 键）和在代码中调用 `focus()` 方法。

默认情况下，文档刚刚加载完成时，`document.activeElement` 中保存的是 `document.body` 元素的引用。文档加载期间，`document.activeElement` 的值为 `null`。

另外就是新增了 `document.hasFocus()` 方法，这个方法用于确定文档是否获得了焦点。通过检测文档是否获得了焦点，可以知道用户是不是正在与页面交互。

查询文档获知哪个元素获得了焦点，以及确定文档是否获得了焦点，这两个功能最重要的用途是提高 Web 应用的无障碍性。无障碍 Web 应用的一个主要标志就是恰当的焦点管理，而确切地知道哪个元素获得了焦点是一个极大的进步，至少我们不用再像过去那样靠猜测了。

#### HTMLDocument 的变化

1.`readyState` 属性

`Document` 的 `readyState` 属性有两个可能的值：

* `loading`：正在加载文档；
* `complete`：已经加载完文档；

```js
if (document.readyState == 'complete') {
    //执行操作
}
```

2.兼容模式：`document.compatMode` 用来告诉开发人员浏览器采用的渲染模式是标准模式还是混杂模式。在标准模式下，`document.compatMode` 的值等于 `"CSS1Compat"`，而在混杂模式下，`document.compatMode` 的值等于 `"BackCompat"`。

3.`head` 属性：HTML5 新增了 `document.head` 属性，引用文档的 `<head>` 元素。要引用文档的 `<head>` 元素，可以结合使用这个属性和另一种后备方法：

`var head = document.head || document.getElementsByTagName("head")[0]`

#### 字符集属性

HTML5 新增了几个与文档字符集有关的属性。其中，`charset` 属性表示文档中实际使用的字符集，也可以用来指定新字符集。默认情况下，这个属性的值为 `"UTF-16"`，但可以通过 `<meta>`元素、响应头部或直接设置 `charset` 属性修改这个值。

另一个属性是 `defaultCharset`，表示根据默认浏览器及操作系统的设置，当前文档默认的字符集应该是什么。如果文档没有使用默认的字符集，那 `charset` 和 `defaultCharset` 属性的值可能会不一样。

#### 自定义数据属性

HTML5 规定可以为元素添加非标准的属性，但要添加前缀 `data-`，目的是为元素提供与渲染无关的信息，或者提供语义信息。

添加了自定义属性之后，可以通过元素的 `dataset` 属性来访问自定义属性的值。`dataset` 属性的值是 `DOMStringMap` 的一个实例，也就是一个名值对儿的映射。在这个映射中，每个 `data-name` 形式的属性都会有一个对应的属性，只不过属性名没有 `data-` 前缀（比如，自定义属性是 `data-myname`，那映射中对应的属性就是 `myname`）。

#### 插入标记

1.`innerHTML` 属性

在读模式下，`innerHTML` 属性返回与调用元素的所有子节点（包括元素、注释和文本节点）对应的 HTML 标记。在写模式下，`innerHTML` 会根据指定的值创建新的 DOM 树，然后用这个 DOM 树完全替换调用元素原先的所有子节点。

2.`outerHTML` 属性

在读模式下，`outerHTML` 返回调用它的元素及所有子节点的 HTML 标签。在写模式下，`outerHTML` 会根据指定的 HTML 字符串创建新的 DOM 子树，然后用这个 DOM 子树完全替换调用元素。

3.`insertAdjacentHTML()` 方法

它接收两个参数：插入位置和要插入的 HTML 文本。第一个参数必须是下列值之一：

* `"beforebegin"`，在当前元素之前插入一个紧邻的同辈元素；
* `"afterbegin"`，在当前元素之下插入一个新的子元素或在第一个子元素之前再插入新的子元素；
* `"beforeend"`，在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素；
* `"afterend"`，在当前元素之后插入一个紧邻的同辈元素。

4.内存与性能问题

在删除带有事件处理程序或引用了其他 JavaScript 对象子树时，就有可能导致内存占用问题。假设某个元素有一个事件处理程序（或者引用了一个 JavaScript 对象作为属性），在使用前述某个属性将该元素从文档树中删除后，元素与事件处理程序（或 JavaScript 对象）之间的绑定关系在内存中并没有一并删除。如果这种情况频繁出现，页面占用的内存数量就会明显增加。

因此，在使用 `innerHTML`、`outerHTML` 属性和 `insertAdjacentHTML()` 方法时，最好先手工删除要被替换的元素的所有事件处理程序和 JavaScript 对象属性。

一般来说，在插入大量新 HTML 标记时，使用 `innerHTML` 属性与通过多次 DOM 操作先创建节点再指定它们之间的关系相比，效率要高得多。这是因为在设置 `innerHTML` 或 `outerHTML` 时，就会创建一个 HTML 解析器。这个解析器是在浏览器级别的代码（通常是 C++ 编写的）基础上运行的，因此比执行 JavaScript 快得多。不可避免地，创建和销毁 HTML 解析器也会带来性能损失，所以最好能够将设置 `innerHTML` 或 `outerHTML` 的次数控制在合理的范围内。

#### scrollIntoView() 方法

`scrollIntoView()` 可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。

如果给这个方法传入 `true` 作为参数，或者不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入 `false` 作为参数，调用元素会尽可能全部出现在视口中，（可能的话，调用元素的底部会与视口顶部平齐。）不过顶部不一定平齐。
