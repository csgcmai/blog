/**
 * @File: 创建对象
 *   1.工厂模式
 *   2.构造函数模式
 *   3.原型模式
 *   4.组合使用构造函数模式和原型模式
 *   5.动态原型模式
 *   6.寄生构造函数模式
 *   7.稳妥构造函数模式
 */

/**
 * 关于对象的知识 Tips：
 *   1.使用 delete 操作符则可以完全删除实例属性，从而让我们能够重新访问原型中的属性；
 *   2.使用 hasOwnProperty() 方法可以检测一个属性是存在于实例中，还是存在于原型中；
 *   3.ECMAScript 5 的 Object.getOwnPropertyDescriptor() 方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用
 * Object.getOwnPropertyDescriptor() 方法；
 *   4.在使用 for-in 循环时，返回的是所有能够通过对象访问的、可枚举的（enumerated）属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性；
 *   5.要取得对象上所有可枚举的实例属性，可以使用 ECMAScript 5 的 Object.keys() 方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的字符串数组；
 *   6.如果你想要得到所有实例属性，无论它是否可枚举，都可以使用 Object.getOwnPropertyNames() 方法；
 *   7.原型的动态性：由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来；
 */

/**
 * 1.工厂模式：
 * 工厂模式是软件工程领域一种广为人知的设计模式，这种模式抽象了创建具体对象的过程。
 * 缺点：工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）
 */
function createPerson(name, age, job) {
  var o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function() {
    alert(this.name)
  }
  return o
}
var person1 = createPerson('Nicholas', 29, 'Software Engineer')
var person2 = createPerson('Greg', 27, 'Docter')

/**
 * 2.构造函数模式：
 * 构造函数可用来创建特定类型的对象。
 * 创建自定义的构造函数意味着将来可以将它的实例标识为一种特定的类型；而这正是构造函数模式胜过工厂模式的地方；
 * 使用 new 操作符调用构造函数会经历4个步骤：
 * （1）创建一个新对象；
 * （2）将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
 * （3）执行构造函数中的代码（为这个新对象添加属性）
 * （4）返回新对象
 * 缺点：每个方法都要在每个实例上重新创建一遍。
 */
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    alert(this.name)
  }
}
var person1 = new Person('Nicholas', 29, 'Software Engineer')
var person2 = new Person('Greg', 27, 'Docter')
alert(person1.constructor == Person) // true

// 对象的 constructor 属性最初是用来标识对象类型的。但是，提到检测对象类型，还是 instanceof 操作符要更可靠一些。
// 我们在这个例子中创建的所有对象既是 Object 的实例，同时也是 Person 的实例，这一点通过 instanceof 操作符可以得到验证。
alert(person1 instanceof Object) // true
alert(person1 instanceof Person) // true
// 注意：person1 和 person2 都有一个名为 sayName() 的方法，但那两个方法不是同一个 Function 的实例。
// 因此，不同实例上的同名函数是不相等的：
alert(person1.sayName == person2.sayName) // false

/**
 * 3.原型模式
 * 我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。
 * 使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法；
 * 重点概念：
 * （1）无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象；
 * （2）在默认情况下，所有原型对象都会自动获得一个 constructor（构造函数）属性，这个属性是一个指向 prototype 属性所在函数的指针；
 * （3）当调用构造函数创建一个新实例后，该实例的内部将包含一个指针 [[Prototype]]（内部属性 __proto__），指向构造函数的原型对象。注意，
 * 这个连接存在于实例与构造函数的原型对象之间，而不是存在于实例与构造函数之间；
 * （4）通过原型对象的 isPrototypeOf() 方法判断实例对象内部是否有指向该原型对象的指针，若存在则返回 ture；
 * （5）通过 Object.getPrototypeOf() 方法返回实例对象所对应的构造函数的原型对象；
 * 缺点：
 * （1）它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将取得相同的属性值；
 * （2）由于原型对象共享的本性，当原型对象的属性（对于引用类型值的属性尤为突出）被修改后，会影响众多已创建实例；
 */
// 换句话说，不必在构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中：
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  alert(this.name)
}

var person1 = new Person()
person1.sayName() // 'Nicholas'

var person2 = new Person()
person2.sayName() // 'Nicholas'

alert(person1.sayName == person2.sayName) // true
alert(Person.prototype.isPrototypeOf(person1));  //true
alert(Object.getPrototypeOf(person1) == Person.prototype); //true

// Tips: 同时使用 hasOwnProperty() 方法和 in 操作符，就可以确定该属性到底是存在于对象中，还是存在于原型中：
function hasPrototypeProperty(object, name) {
  return !object.hasOwnProperty(name) && (name in object)
}

// 更简单的原型语法：用一个包含所有属性和方法的对象字面量来重写整个原型对象
// 注意：要确保原型对象的 constructor 指向正确，且不可枚举
function Person() {}
Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Enginner',
  sayName: function() {
    alert(this.name)
  }
}
// 重设构造函数，只适用于 ECMAScript 5 兼容的浏览器
Object.defineProperty(Person.prototype, 'constructor', {
  enumerable: false,
  value: Person
})

// 尽管可以随时为原型添加属性和方法，并且修改能够立即在所有对象实例中反映出来，但如果是重写整个原型对象，那么情况就不一样了。
// 我们知道，调用构造函数时会为实例添加一个指向最初原型的 [[Prototype]] 指针，而把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系。
// 请记住：实例中的指针仅指向原型，而不指向构造函数，Eg：
function Person() {}
var friend = new Person()
// 重写原型对象切断了现有原型与任何之前已经存在的对象实例之间的联系；它们引用的仍然是最初的原型
Person.prototype = {
  constructor: Person,
  name : "Nicholas",
  age : 29,
  job : "Software Engineer",
  sayName : function () {
      alert(this.name);
  }
}
friend.sayName();   //error

/**
 * 4.组合使用构造函数模式和原型模式
 * （1）构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性
 * （2）结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参数；可谓是集两种模式之长；
 * （3）这种构造函数与原型混成的模式，是目前在ECMAScript中使用最广泛、认同度最高的一种创建自定义类型的方法。可以说，这是用来定义引用类型的一种默认模式
 */
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.friends = ['Shelby', 'Court']
}

Person.prototype = {
  constructor: Person,
  sayName: function() {
    alert(this.name)
  }
}
var person1 = new Person("Nicholas", 29, "Software Engineer")
var person2 = new Person("Greg", 27, "Doctor")
person1.friends.push("Van")
alert(person1.friends)    //"Shelby,Count,Van"
alert(person2.friends)    //"Shelby,Count"
alert(person1.friends === person2.friends)    //false
alert(person1.sayName === person2.sayName)    //true

/**
 * 5.动态原型模式：把所有信息都封装在了构造函数中，而通过在构造函数中初始化原型（仅在必要的情况下），又保持了同时使用构造函数和原型的优点
 * 注意：使用动态原型模式时，不能使用对象字面量重写原型。前面已经解释过了，如果在已经创建了实例的情况下重写原型，那么就会切断现有实例与新原型之间的联系。
 */
function Person(name, age, job) {
    //属性
    this.name = name
    this.age = age
    this.job = job

    // 方法
    // if 语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆if语句检查每个属性和每个方法；只要检查其中一个即可
    if (typeof this.sayName != 'function') {
      Person.prototype.sayName = function() {
        alert(this.name)
      }
    }
}
var friend = new Person("Nicholas", 29, "Software Engineer")
friend.sayName()

/**
 * 6.寄生构造函数模式：创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；但从表面上看，这个函数又很像是典型的构造函数
 * 注意：首先，返回的对象与构造函数或者与构造函数的原型属性之间没有关系；也就是说，构造函数返回的对象与在构造函数外部创建的对象没有什么不同。
 * 为此，不能依赖 instanceof 操作符来确定对象类型。由于存在上述问题，我们建议在可以使用其他模式的情况下，不要使用这种模式。
 */
function SpecialArray() {
  // 创建数组
  var values = new Array()

  // 添加值
  values.push.apply(values, arguments)

  // 添加方法
  values.toPipedString = function() {
    return this.join("|")
  }

  // 返回数组
  return values
}
var colors = new SpecialArray("red", "blue", "green")
alert(colors.toPipedString()) // "red|blue|green"

/**
 * 7.稳妥构造函数模式：所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。
 * 注意：与寄生构造函数模式类似，使用稳妥构造函数模式创建的对象与构造函数之间也没有什么关系，因此 instanceof 操作符对这种对象也没有意义
 * 稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：
 * （1）新创建对象的实例方法不引用 this；
 * （2）不使用 new 操作符调用构造函数；
 */
function Person(name, age, job) {
  // 创建要返回的对象
  var o = new Object()

  // 可以在这里定义私有变量和函数

  //添加方法
  o.sayName = function() {
    // 在以这种模式创建的对象中，除了使用 sayName() 方法之外，没有其他办法访问 name 的值
    alert(name)
  }

  // 返回对象
  return o
}
