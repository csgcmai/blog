理解、使用 PureComponent
===
> 2018.01.14 发布，最后更新于 2018.01.14

## 官方介绍

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

## 源码解析

#### 源码片段 - `PureComponent` 对新旧 `props` 和 `state` 进行 `shallowEqual` 比较:

```js
/**
 * @File: react-reconciler/src/ReactFiberClassComponent.js
 */
if (typeof instance.shouldComponentUpdate === 'function') {
  startPhaseTimer(workInProgress, 'shouldComponentUpdate');
  const shouldUpdate = instance.shouldComponentUpdate(
    newProps,
    newState,
    newContext,
  );
  stopPhaseTimer();

  // Simulate an async bailout/interruption by invoking lifecycle twice.
  if (debugRenderPhaseSideEffects) {
    instance.shouldComponentUpdate(newProps, newState, newContext);
  }

  if (__DEV__) {
    warning(
      shouldUpdate !== undefined,
      '%s.shouldComponentUpdate(): Returned undefined instead of a ' +
        'boolean value. Make sure to return true or false.',
      getComponentName(workInProgress) || 'Unknown',
    );
  }

  return shouldUpdate;
}

if (type.prototype && type.prototype.isPureReactComponent) {
  return (
    !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
  );
}
```

无论组件是否是 `PureComponent`，如果定义了 `shouldComponentUpdate()`，那么会调用它并以它的执行结果来判断是否 update。在组件未定义 `shouldComponentUpdate()` 的情况下，会判断该组件是否是 `PureComponent`，如果是的话，会对新旧 `props`、`state` 进行 `shallowEqual` 比较，一旦新旧不一致，会触发 `update`。

[react-reconciler/src/ReactFiberClassComponent.js](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberClassComponent.js#L202)

#### 源码片段 - fbjs 的 `shallowEqual()`

```js
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x: mixed, y: mixed): boolean {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```

浅判等 只会比较到两个对象的 ownProperty 是否符合 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 判等，不会递归地去深层比较。

[fbjs/packages/fbjs/src/core/shallowEqual.js](https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js#L39)