/**
 * @File: 继承
 *   1.原型链基本模式
 *   2.借用构造函数（也叫伪造对象或经典继承）
 *   3.组合继承（伪经典继承）
 *   4.原型式继承
 *   5.寄生式继承
 *   6.寄生组合式继承
 */

/**
 * Tips：
 * （1）ECMAScript 中描述了原型链的概念，并将原型链作为实现继承的主要方法。思想：利用原型让一个引用类型继承另一个引用类型的属性和方法；
 * （2）构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针；
 * （3）所有函数的默认原型都是 Object的 实例，因此默认原型都会包含一个内部指针，指向 Object.prototype。
 * 这也正是所有自定义类型都会继承 toString()、valueOf() 等默认方法的根本原因；
 */

/**
 * 1.原型链基本模式：实现的本质是重写原型对象，代之以一个新类型的实例
 * 缺点：
 * （1）包含引用类型值的原型属性会被所有实例共享。在通过原型来实现继承时，原型实际上会变成另一个类型的实例，原先的实例属性也就顺理成章地变成了现在的原型属性了；
 * 所以当原型链中原型对象的属性变化时，会影响众多已创建实例；
 * （2）在创建子类型的实例时，不能向超类型的构造函数中传递参数（没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数）；
 */
function SuperType() {
  this.property = true
}
SuperType.prototype.getSuperValue = function() {
  return this.property
}

function SubType() {
  this.subproperty = false
}

// SubType 继承了 SuperType，而继承是通过创建 SuperType 的实例，并将该实例赋给 SubType.prototype 实现的
SubType.prototype = new SuperType()
SubType.prototype.getSubValue = function() {
  return this.subproperty
}

var instance = new SubType()
alert(instance.getSuperValue()) // true

/**
 * Tips：两种确定原型和实例关系的方法：
 * （1）使用 instanceof 操作符，测试实例与原型链中“出现过”的构造函数；
 * （2）使用 isPrototypeOf()，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型；
 */

/**
 * 2.借用构造函数（也叫伪造对象或经典继承）：在子类型构造函数的内部调用超类型构造函数
 * 优势：可以在子类型构造函数中向超类型构造函数传递参数
 * 缺点：
 * （1）无法避免构造函数模式存在的问题——方法都在构造函数中定义，无法进行函数复用
 * （2）在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式
 */
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}
function SubType() {
  // 继承了 SuperType，借调了超类型的构造函数。结果，SubType 的每个实例就都会具有自己的 colors 属性的副本了
  SuperType.call(this)
}

var instance1 = new SubType()
instance1.colors.push('black')
alert(instance1.colors) // "red,blue,green,black"

var instance2 = new SubType()
alert(instance2.colors) // "red,blue,green"


// 在子类型构造函数中向超类型构造函数传递参数
function SuperType(name) {
  this.name = name
}
function SubType() {
  // 继承了 SuperType，同时还传递了参数
  SuperType.call(this, 'Nicholas')
  // 实例属性：在调用超类型构造函数后，再添加应该在子类型中定义的属性，避免覆盖
  this.age = 29
}

var instance = new SubType()
alert(instance.name)    // "Nicholas";
alert(instance.age)     // 29

/**
 * 3.组合继承（伪经典继承）
 * （1）将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式；
 * （2）思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，
 * 又能够保证每个实例都有它自己的属性；
 * （3）组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点；成为 JavaScript 中最常用的继承模式。而且，instanceof 和 isPrototypeOf()
 * 也能够用于识别基于组合继承创建的对象；
 * 缺点：无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部
 */
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
SuperType.prototype.sayName = function() {
  alert(this.name)
}

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name) // 注意：第二次调用 SuperType()
  this.age = age
}
// 继承方法
SubType.prototype = new SuperType() // 注意：第一次调用 SuperType()
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function() {
  alert(this.age)
}

var instance1 = new SubType('Nicholas', 29)
instance1.colors.push('black')
alert(instance1.colors) // "red,blue,green,black"
instance1.sayName() // "Nicholas"
instance1.sayAge() // 29

var instance2 = new SubType('Greg', 27)
alert(instance2.colors) // "red,blue,green"
instance2.sayName() // "Greg";
instance2.sayAge()  // 27

/**
 * 4.原型式继承：借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型
 * 克罗克福德主张的这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给 object() 函数，
 * 然后再根据具体需求对得到的对象加以修改即可；
 * 缺点：包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样
 */
function object(o) {
  function F() {} // 先创建了一个临时性的构造函数
  F.prototype = o // 然后将传入的对象作为这个构造函数的原型
  return new F() // 最后返回了这个临时类型的一个新实例
}

// 从本质上讲，object() 对传入其中的对象执行了一次浅复制。来看下面的例子：
var person = {
  name: 'Nicholas',
  friends: ["Shelby", "Court", "Van"]
}
var anotherPerson = object(person)
anotherPerson.name = "Greg"
anotherPerson.friends.push("Rob")

var yetAnotherPerson = object(person)
yetAnotherPerson.name = "Linda"
yetAnotherPerson.friends.push("Barbie")

alert(person.friends) // "Shelby,Court,Van,Rob,Barbie"

// ECMAScript 5 通过新增 Object.create() 方法规范化了原型式继承。这个方法接收两个参数：
// 一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。在传入一个参数的情况下，Object.create() 与 object() 方法的行为相同

/**
 * 5.寄生式继承
 * 寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，
 * 最后再像真地是它做了所有工作一样返回对象；
 * 缺点：使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率；这一点与构造函数模式类似
 */
// 这个例子中的代码基于 person 返回了一个新对象 anotherPerson。新对象不仅具有 person 的所有属性和方法，而且还有自己的 sayHi() 方法
function object(o) {
  function F() {} // 先创建了一个临时性的构造函数
  F.prototype = o // 然后将传入的对象作为这个构造函数的原型
  return new F() // 最后返回了这个临时类型的一个新实例
}
function createAnother(original) {
  var clone = object(original) // 通过调用函数创建一个新对象
  clone.sayHi = function() { // 以某种方式来增强这个对象
    alert("hi")
  }
  return clone // 返回这个对象
}
// 前面示范继承模式时使用的 object() 函数不是必需的；任何能够返回新对象的函数都适用于此模式

/**
 * 6.寄生组合式继承：通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。
 * 思路：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，
 * 就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。
 * 优势总结：
 * （1）高效率体现在它只调用了一次 SuperType 构造函数，并且因此避免了在 SubType.prototype 上面创建不必要的、多余的属性；
 * （2）原型链还能保持不变；
 * （3）由于原型链能保持不变，还能够正常使用 instanceof 和 isPrototypeOf()
 * （4）开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式！！！
 */
function object(o) {
  function F() {} // 先创建了一个临时性的构造函数
  F.prototype = o // 然后将传入的对象作为这个构造函数的原型
  return new F() // 最后返回了这个临时类型的一个新实例
}

function inheritPrototype(subType, superType) { // 两个参数：子类型构造函数和超类型构造函数
  // Step1：创建超类型原型的一个副本。
  // prototype { __proto__: superType.prototype }
  var prototype = object(superType.prototype) // 创建对象

  // Step2：为创建的副本添加 constructor 属性，从而弥补因重写原型而失去的默认的 constructor 属性
  prototype.constructor = subType // 增强对象

  // Step3: 将新创建的对象（即副本）赋值给子类型的原型
  subType.prototype = prototype // 指定对象
}

function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function() {
  alert(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}

inheritPrototype(SubType, SuperType)

SubType.prototype.sayAge = function() {
  alert(this.age)
}
