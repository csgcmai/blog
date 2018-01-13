React 实践关键话题（二）
===
> 2018.01.12 发布，最后更新于 2018.01.12

## 理解 `pureComponent`

#### 官方介绍

> React.PureComponent is similar to React.Component. The difference between them is that React.Component doesn’t implement shouldComponentUpdate(), but React.PureComponent implements it with a shallow prop and state comparison.
>
> If your React component’s render() function renders the same result given the same props and state, you can use React.PureComponent for a performance boost in some cases.
>
> React.PureComponent’s shouldComponentUpdate() only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only extend PureComponent when you expect to have simple props and state, or use forceUpdate() when you know deep data structures have changed. Or, consider using immutable objects to facilitate fast comparisons of nested data.
>
> Furthermore, React.PureComponent’s shouldComponentUpdate() skips prop updates for the whole component subtree. Make sure all the children components are also “pure”.

> `React.PureComponent` 类似于 `React.Component`。两者的区别是 `React.Component` 不会执行 `shouldComponentUpdate()`，而 `React.PureComponen` 会执行它并且进行 `prop` 和 `state` 的浅比较。
>
> 对于传递相同的 `prop` 和 `state` 会有一致的渲染结果的组件，我们可以使用 `React.PureComponent` 来提高性能。
>
> `React.PureComponent` 的 `shouldComponentUpdate()` 只进行对象浅比较。在进行包含复杂数据结构的对象比较时，可能会产生深层差异的漏报。因此，仅对使用简单类型的 `props` 和 `state` 的组件 `extend PureComponent`，或者当确定深层数据结构改变时使用 [`forceUpdate()`](https://reactjs.org/docs/react-component.html#forceupdate)。另外，可以考虑使用不可变数据（immutable objects）来帮助进行快速的嵌套数据比较。
>
> 此外，`React.PureComponent` 的 `shouldComponentUpdate()` 会跳过整个组件子树的 `prop` 更新。使用时请确保所有子组件同样是“纯”的。

[React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent)