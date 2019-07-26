# DOM 重点知识汇总（笔记）

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
