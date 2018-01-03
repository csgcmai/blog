[AntV](https://antv.alipay.com/zh-cn/index.html)、[G2](https://antv.alipay.com/zh-cn/g2/3.x/index.html) 和 [Bizcharts](https://alibaba.github.io/BizCharts/index.html)
===

## AntV、G2、BizCharts 是什么？

#### AntV 与 G2

* AntV 是蚂蚁金服体验技术部团队提供的一套[数据可视化](https://baike.baidu.com/item/%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96/1252367?fr=aladdin)方案。[AntV team](https://github.com/antvis)
* AntV 中主要包含 [G2](https://antv.alipay.com/zh-cn/g2/3.x/index.html)、G6(https://antv.alipay.com/zh-cn/g6/1.x/index.html)、[F2](https://antv.alipay.com/zh-cn/f2/3.x/index.html)
  * G2：可视化图形语法。
  * G6：关系图类库，用以解决流程和关系分析场景
  * F2：移动端图表库（a canvas library which providing 2d draw for mobile）

#### 可视化图形语法

**数据可视化的目的** 在于用图形化的手段，清晰有效地传达和沟通信息，一图胜千言。

Leland Wilkinson 在上世纪90年代开发可视化软件时编写了[《The Grammar of Graphics》](https://book.douban.com/subject/10123863/)，用语法描述图形的产生，以自底向上的方式 **组织最基本的元素形成更高级的元素**。此后，开源社区逐渐诞生了对图形语法的各种语言版本实现： R 语言社区的 ggplot2；Python 技术栈实现的 Bokeh；基于 D3 的 Vega。G2 是目前 JavaScript 社区对《The Grammar of Graphics》还原度最高的实现，刚一开源就得到 Leland Wilkinson 本人的肯定。

图形语法的组成：https://antv.alipay.com/zh-cn/g2/3.x/tutorial/the-grammar-of-graphics.html#_图形语法的组成

和传统枚举图表类型的可视化工具相比，基于图形语法的可视化工具的特征是：生成每一个图形的过程就是组合不同的基础图形语法的过程。图形语法的灵活和强大之处就在于，我们只需要改动其中某一步的处理过程，就能得到完全不同的、全新的图表。

> 参考 [可视化图形语法概述](https://zhuanlan.zhihu.com/p/32178892?group_id=926791155145109504)

#### BizCharts

Anv 官推的基于 G2 的 React 图表库

## G2 中的几个重要基础概念

#### 几何标记 Geom

G2 中并没有特定的图表类型（柱状图、散点图、折线图等）的概念，G2 生成的图表类型，主要由几何标记决定。几何标记用来描述 点、线、面这些几何图形。

![什么是 Geom](../../media/04/what-is-geom.png)

业务中最常用的几何标记类型：

Geom 类型 | 图表类型 | 描述
-------- | --------| ----------
`point` | **点图、折线图中的点** | 点，用于绘制各种点图。
`line` | **折线图、曲线图**、阶梯线图 | 线，点按照 x 轴连接成一条线，构成线图。
`area` | **区域图（面积图）、层叠区域图**、区间区域图 | 填充线图跟坐标系之间构成区域图，也可以指定上下范围。
`interval` | **柱状图、饼图**、直方图、南丁格尔玫瑰图、条形环图（玉缺图）、漏斗图等 | 使用矩形或者弧形，用面积来表示大小关系的图形，一般构成柱状图、饼图等图表。

> 几何标记（Geom）和视觉通道构成了可视化编码，[G2 图表类型使用教程](https://antv.alipay.com/zh-cn/g2/3.x/tutorial/chart-type.html) 从 **Geom 数据维度、Geom 自由度、视觉通道、图形形状** 4个角度描述了 **“图表类型”** 在可视化框架中的实现思路。

#### 图形属性（视觉通道）

图形属性对应视觉编码中的 **视觉通道**，不同的几何标记拥有自己的图形属性。

G2 支持以下图形属性：

* position：位置，二维坐标系内映射至 x 轴、y 轴；
* color：颜色，包含了色调、饱和度和亮度；
* size：大小，不同的几何标记对大小的定义有差异；
* shape：形状，几何标记的形状决定了某个具体图表类型的表现形式，例如点图，可以使用圆点、三角形、图片表示；线图可以有折线、曲线、点线等表现形式；
* opacity：透明度，图形的透明度，这个属性从某种意义上来说可以使用颜色代替，需要使用 'rgba' 的形式，所以在 G2 中我们独立出来。

图形属性是属于每一个几何标记 geom（Geometry) 的，所以我们先要声明几何标记，然后再在该几何标记对象上进行图形属性的映射，Eg.

```js
chart.point().position('a*b').color('c');
```

> [G2 图形属性使用教程](https://antv.alipay.com/zh-cn/g2/3.x/tutorial/attr.html)

## 一些业务功能亮点

#### 多Y轴图表的支持

![多Y轴图表](../../media/04/multi-y.png)

[如何绘制多 y 轴图表](https://antv.alipay.com/zh-cn/g2/3.x/tutorial/fqas.html#_如何绘制多-y-轴图表)
