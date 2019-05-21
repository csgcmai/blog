/**
 * @File: 使用 yield* 遍历完全二叉树
 */

/**
 * yield* 命令可以很方便地取出嵌套数组的所有成员。
 */
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* iterTree(tree[i])
    }
  } else {
    yield tree
  }
}

const tree = ['a', ['b', 'c'], ['d', 'e']]

for (let x of iterTree(tree)) {
  console.log(x)
}
// a
// b
// c
// d
// e

/**
 * 由于扩展运算符 ... 默认调用 Iterator 接口，所以上面这个函数也可以用于嵌套数组的平铺。
 */
[...iterTree(tree)] // ["a", "b", "c", "d", "e"]

/**
 * 使用 yield* 语句遍历完全二叉树。
 */
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left
  this.label = label
  this.right = right
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用 generator 函数。
// 函数体内采用递归算法，所以左树和右树要用 yield* 遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left)
    yield t.label
    yield* inorder(t.right)
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length === 1) return new Tree(null, array[0], null)
  return new Tree(make(array[0]), array[1], make(array[2]))
}

let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]])

// 遍历二叉树
var result = []
for (let node of inorder(tree)) {
  result.push(node)
}

// result // ['a', 'b', 'c', 'd', 'e', 'f', 'g']
