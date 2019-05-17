/**
 * @File: 遍历器对象除了具有 next 方法，还可以具有 return 方法和 throw 方法。示例部署 return 方法
 */

/**
 * return 方法的使用场合是，如果 for...of 循环提前退出（通常是因为出错，或者有 break 语句），就会调用 return 方法。如果一个对象在完成
 * 遍历前，需要清理或释放资源，就可以部署 return 方法。
 */
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false }
        },
        return() {
          file.close()
          return { done: true }
        }
      }
    }
  }
}

/**
 * 上面代码中，函数 readLineSync 接受一个文件对象作为参数，返回一个遍历器对象，其中除了 next 方法，还部署了 return 方法。下面两种情况，
 * 都会触发执行 return 方法
 */

// 情况一：输出文件的第一行以后，就会执行return方法，关闭这个文件；
for (let line of readLinesSync(fileName)) {
  console.log(line)
  break;
}

// 情况二：执行 return 方法关闭文件之后，再抛出错误
for (let line of readLinesSync(fileName)) {
  console.log(line)
  throw new Error()
}
