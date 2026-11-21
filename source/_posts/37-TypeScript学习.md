---
title: TypeScript指北
date: 2022-02-11 19:30:01
categories: TypeScript
tags:
---

TypeScript在2012年由微软发布，它是基于JavaScript的强类型编程语言。TypeScript最终都会被转为普通的JS代码运行。本篇是本人TypeScript的学习记录。

<!-- more -->

# 目录
<!-- doctoc filename生成文件目录 -->
<!-- URL为何需要编码 -->
<!-- 对于Url来说，之所以要进行编码，是因为Url中有些字符会引起歧义。 -->
<!-- URL中采用何种编码 -->
<!-- Url的编码格式采用的是ASCII码，而不是Unicode，这也就是说你不能在Url中包含任何非ASCII字符 
Url中只允许包含英文字母（a-zA-Z）、数字（0-9）、-_.~4个特殊字符以及所有保留字符。 -->
- [目录](#%E7%9B%AE%E5%BD%95)
- [环境安装](#%E7%8E%AF%E5%A2%83%E5%AE%89%E8%A3%85)
- [静态类型](#%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B)
- [基础静态类型和对象静态类型](#%E5%9F%BA%E7%A1%80%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%AF%B9%E8%B1%A1%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B)
- [类型注解和类型推断](#%E7%B1%BB%E5%9E%8B%E6%B3%A8%E8%A7%A3%E5%92%8C%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD)
- [函数参数类型和函数返回值类型定义](#%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E5%80%BC%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)
  - [函数返回值类型定义](#%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E5%80%BC%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)
  - [函数参数类型定义](#%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)
- [数组类型定义](#%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)
- [元组](#%E5%85%83%E7%BB%84)
- [接口](#%E6%8E%A5%E5%8F%A3)
  - [接口中的函数属性](#%E6%8E%A5%E5%8F%A3%E4%B8%AD%E7%9A%84%E5%87%BD%E6%95%B0%E5%B1%9E%E6%80%A7)
  - [可选属性](#%E5%8F%AF%E9%80%89%E5%B1%9E%E6%80%A7)
  - [额外属性检测](#%E9%A2%9D%E5%A4%96%E5%B1%9E%E6%80%A7%E6%A3%80%E6%B5%8B)
  - [接口对类的约束](#%E6%8E%A5%E5%8F%A3%E5%AF%B9%E7%B1%BB%E7%9A%84%E7%BA%A6%E6%9D%9F)
  - [接口的继承](#%E6%8E%A5%E5%8F%A3%E7%9A%84%E7%BB%A7%E6%89%BF)
- [类的概念与使用](#%E7%B1%BB%E7%9A%84%E6%A6%82%E5%BF%B5%E4%B8%8E%E4%BD%BF%E7%94%A8)
  - [类属性修饰符](#%E7%B1%BB%E5%B1%9E%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6)
  - [类的构造函数](#%E7%B1%BB%E7%9A%84%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)
  - [类的存取器](#%E7%B1%BB%E7%9A%84%E5%AD%98%E5%8F%96%E5%99%A8)
  - [类的静态属性](#%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7)
  - [类的readonly关键字](#%E7%B1%BB%E7%9A%84readonly%E5%85%B3%E9%94%AE%E5%AD%97)
  - [抽象类和抽象方法](#%E6%8A%BD%E8%B1%A1%E7%B1%BB%E5%92%8C%E6%8A%BD%E8%B1%A1%E6%96%B9%E6%B3%95)
- [编译配置文件](#%E7%BC%96%E8%AF%91%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
  - [include、exclude和files](#includeexclude%E5%92%8Cfiles)
  - [常见的compilerOptions配置项](#%E5%B8%B8%E8%A7%81%E7%9A%84compileroptions%E9%85%8D%E7%BD%AE%E9%A1%B9)
  - [compilerOptions配置项详情](#compileroptions%E9%85%8D%E7%BD%AE%E9%A1%B9%E8%AF%A6%E6%83%85)
- [联合类型和类型保护](#%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B%E5%92%8C%E7%B1%BB%E5%9E%8B%E4%BF%9D%E6%8A%A4)
  - [联合类型](#%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B)
  - [类型保护](#%E7%B1%BB%E5%9E%8B%E4%BF%9D%E6%8A%A4)
  - [常见的类型保护方法](#%E5%B8%B8%E8%A7%81%E7%9A%84%E7%B1%BB%E5%9E%8B%E4%BF%9D%E6%8A%A4%E6%96%B9%E6%B3%95)
- [Enum 枚举类型](#enum-%E6%9E%9A%E4%B8%BE%E7%B1%BB%E5%9E%8B)
- [泛型](#%E6%B3%9B%E5%9E%8B)
- [命名空间](#命名空间)
- [外部模块使用import和export](#外部模块使用import和export)
- [参考](#%E5%8F%82%E8%80%83)


# 环境安装
安装TypeScript
```
npm i -g typescript
```

命令行将ts文件转为js文件
```
tsc demo1.ts
```

转换为js文件后执行js文件
```
node demo1.js
```

通过ts-node工具直接执行ts文件
```
npm i -g ts-node
npm i -D tslib @types/node
ts-node demo1.ts
```

# 静态类型
静态类型: Static Typing

如何理解静态类型：
1. 一旦变量使用了静态类型，之后类型不可改变
2. 一旦变量使用静态类型，变量可以使用类型上的属性和方法
3. 一旦变量使用静态类型，变量的属性和方法也随之确定

如何定义静态类型：  
以“: 类型名”的形式定义
```
// count变量可以使用number类型上的方法
let count : number = 1;
```

除了常见JS基础类型外，还可以自定义静态类型:
```
interface person {
    name: string,
    age: number
}

let xiaoming : person = {
    name: 'xiaoming',
    age: 28
}
console.log(xiaoming.name)
```

# 基础静态类型和对象静态类型
TypeScript的静态类型分为：
1. 基础静态类型

2. 对象静态类型

基础静态类型示例：
```
let count: number = 1;
let name: string = 'ddd';
```
// 常见的基础静态类型还有：null, undefined, boolean, symbol, void

对象静态类型示例：
```
// 对象类型
let obj : { name: string, age: number } = {
    name: '小明',
    age: 18
}


// 数组类型
let arr : string [] = ['1', '2'];
// 表示arr是个数组 且 内部元素都为字符串


// 类类型
class person {}
let aPerson : person = new person();
// 表示对象必须为类的实例


// 函数类型
let fn : ()=> string = () => '1';
// 表示函数的返回值必须为字符串
console.log(count, name, obj, arr, aPerson, fn)

```

# 类型注解和类型推断
类型注解(annotation)：明确的声明变量的类型
```js
let count : number;
count = 1;
```
如上述代码，明确的规定了count是一个数字类型，这就是类型注解。


类型推断(inference)：TypeScript对变量的类型是有推断能力的，如果TypeScript能够自动推断出变量的类型，就不需要写类型注解。
```js
let a = 1;
```
把鼠标放到a上，会自动显示number类型，这就是TypeScript推断出来的。

写一个两数求和函数
```js
function sum(a, b) {
    return a + b;
}
```
把鼠标放到a上，会发现它是any类型，代表TypeScript此时不能推断出a变量的类型，这个时候就需要写类型注解。正确的写法如下：

```js
function sum(a : number, b : number) {
    return a + b;
}
let total = sum(1, 2);
```
为什么total不需要写类型注解？因为此时a，b加上类型注解后，TS能够自动推断出total的类型

TypeScript能够推断出对象属性的静态类型
```js
let o = {
    name: 'ts',
    age: 18
}
```
把鼠标放到name上，TS会提示出它是一个字符串类型.

工作中的潜规则：
1. 如果TS能够自动分析出变量类型，就不用写类型注解。
2. TS无法分析变量类型，就需要写类型注解。


# 函数参数类型和函数返回值类型定义
## 函数返回值类型定义
如何给函数的返回值加上类型注解？
方法：在函数体前加上类型注解

一般情况下函数的声明
```js
function sum(a : number, b: number) : number {
    return a + b;
    // 写成以下情况会报错 因为规定了函数的返回值类型
    // return a + b + '';
}
let total = sum(1, 2);

```

void类型：函数没有返回值时将返回类型设置成void
```js
function sayHi() : void {
    console.log('Hi')
    // 写成以下情况会报错 因为void已经规定了函数没有返回类型
    // return 1;
}
let res = sayHi();

```

never类型：函数永远执行不完，存在代码不会执行，对返回值使用never类型
```js
function errFunc() : never {
    throw new Error();
    console.log(1)
}

function forE() : never {
    while(true) {}
    console.log(1)
}
```

## 函数参数类型定义
给函数参数加上类型注解，一般情况如下：
```js
function sumP(a : number, b: number) {
    return a + b;
}
```

当函数参数为对象解构时，一般都需要写类型注解：
```js
function sumP({ a, b }) {
    return a + b;
}
const r = sumP( { a: 2, b: 2});
```
此时上述代码会报错，因为sump中的a，b，以及返回值r都是any类型的。

当函数的参数为类型结构时，一定有要注意类型注解的正确写法：
```js
// 错误的类型注解
function sumP({ a : number, b : number })  {
    return a + b;
}

// 正确的类型注解
function sumP({ a, b } : { a : number, b: number}) {
    return a + b
}
```

```js
// 错位的类型注解
function getNum({ a } : number) {
    return a ;
}

// 正确的类型注解
function getNum({ a } : { a : number }) {}
```

# 数组类型定义
一般情况下 数组类型的可以进行类型推断的，以下情况都会成功进行类型推断
```js
let d1 = [1, 2, 3];
let d2 = ['1', '2', '3'];
let d3 = [1, '2', 3];
let d4 = [{ name: 'st', age: 28 }, 1, '2'];
```

但也可以主动写类型注解。  
元素为基础类型的写法：
```js
let arr1 : number [] = [1, 2, 3];
let arr2 : string [] = ['1', '2'];
```

元素为对象类型的写法
```js
let arr4 : { name: string, age: number } [] = [{ name: 'st', age: 28 }];
```
上述写法写对象类型的类型注解比较麻烦，可以自定义类型别名(type alias)
```js
type person = {
    name: string,
    age: number
};

let arr5 : person [] = [{ name: 'st', age: 18 } ];

```

数组元素为混合元素的写法
```js
let arr3 : (number | string | person) [] = [1, '2', 3, { name: 'st', age: 28 }];
```

# 元组
元素和数组类似，可以把它理解为一种特殊的数组，它规定了数组每个下标对应元素的具体类型。

元素的注解如下：
```js
let arr: [string, number] = ['st', 18];
```
表示数组的第一个元素为字符串类型，第二个元素为数字类型，因此下述写法会报错：
```js
let arr1: [string, number] = [18, 'st'];
```


元组类型的变量赋值时要严格按照注解上的规定（长度和元素类型必须保持一致）
```js
let arr: [string, number] = ['st', 18]; // 正确
let arr: [string, number] = ['st']; // 错误
let arr: [string, number] = ['st', 18, 19]; //错误
```

元组可以添加边界元素，边界元素的类型会被限制为元组中每个类型的联合类型：
```js
let arr: [string, number] = ['st', 18];
arr.push(1); // 正确
arr.push({}) // 错误
```

元素的应用场景很少，一般用于对数组元素类型做严格规定：
```js
let arr: [string, number][] = [
    ['st', 18]
] 
console.log(arr)
```


# 接口
接口(interface)：对元素（对象类型）的类型注解做统一规范，使代码的编写更符合面向对象编程。

考虑以下加、减函数的声明情况：
```js
function sum(a: number, b: number) {
    return a + b;
}

function diff(a: number, b: number) {
    return a - b;
}
```
sum函数和diff函数中的参数类型是一致的，没有必要多次重复声明，可以用接口做统一约束。
```js
interface param {
    a: number;
    b: number
}
function sum(o: param) {
    return o.a + o.b;
}
function diff(o: param) {
    return o.a - o.b;
}
```
可以看到，接口param在函数参数中进行了复用，达到同样的目的。不同的是，函数参数类型从2个number类型变成了1个对象类型。

上述改写用类型别名(type alias) 也能达到同样的目的：
```js
type param = {
    a: number,
    b: number
}
function sum(o: param) {
    return o.a + o.b;
}
function diff(o: param) {
    return o.a - o.b;
}
```
那么接口和类型别名有什么区别呢？

类型别名可以赋值为任意类型，而接口只能代表对对象的约束。

## 接口中的函数属性
除了描述对象的普通属性，也可以描述对象的方法（函数属性）
```js
interface person {
    name: string;
    age: number;
    say(): string; // 函数返回值为string类型
}
let aPerson: person = {
    name: 'st',
    age: 18,
    say() { console.log('Hello world'); return 'Hello World'; }
}
aPerson.say()
```

## 可选属性
接口可以指定可选属性，指定后，对象上的该属性可有可无。
```js
interface person {
    name: string;
    age: number;
}
let aPerson1: person = { name: 'st', age: 28 }; // 正确
let aPerson2: person = { name: 'st', age: 28, sex: 'man' }; // 错误
```
上述代码接口中明确了只有name和age属性，因此aPerson2中加入了sex属性会报错。此时就可以使用额外属性来解决，声明方法就是在属性后加上`?:`
```js
interface person {
    name: string;
    age: number;
    sex?: string
}
let aPerson1: person = { name: 'st', age: 28 }; // 正确
let aPerson2: person = { name: 'st', age: 28, sex: 'man' }; // 正确
```

## 额外属性检测
接口还可以统一指定其他额外属性的类型。考虑如下情况：
```js
interface person {
    name: string;
    age: number;
}
let aPerson: person = {
    name: 'st',
    age: 18,
    sex: 'man', // 错误 接口中没有指定sex属性
    phone: '183333' // 错误 接口中没有指定phone属性
}
```
sex、phone属性在接口中没有指定类型，此时会报错，可以使用额外属性检测类解决：
```js
interface person {
    name: string;
    age: number;
    [propName: string]: string // 其他所有的额外属性都是sting类型
}

let aPerson: person = {
    name: 'st',
    age: 18,
    sex: 'man',
    phone: '183',
}
```

## 接口对类的约束
理解：类是接口的实现
```js
interface iPerson {
    name: string;
    age: number;
    say(): string;
}

class cPerson implements iPerson {
    name = 'Bob';
    age = 18;
    say() {
        return '11111'
    }
}
console.log(cPerson)
```

## 接口的继承
```js
interface person {
    name: string;
    age: number;
}

interface teacher extends person {
    skill: string
}

let a: teacher = {
    name: 'mary', // teacher继承person 必须声明name属性
    age: 18, // teacher继承person 必须声明age属性
    skill: 'english'
}
```

# 类的概念与使用
TypeScript中的类和ES6中的类的用法大致相同，TypeScript除了实现ES6的类的所有功能外，还拓展了一些额外的功能。

简单使用:
```js
class Person {
    sayHello() {
        console.log('Hello')
    }
}

let aPerson = new Person();
aPerson.sayHello(); // Hello
```

类中如果声明了属性，在生成实例一定要初始化，以下情况会报错：
```js
class Perosn {
    name: string;
    age: number
}

let aPerson = new Perosn(); // Property 'name' has no initializer and is not definitely assigned in the constructor.
```
正确的写法1：
```js
class Perosn {
    name = 'st';
    age = 18;
}

let aPerson = new Perosn();
```
正确的写法2:
```js
class Perosn {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}
let aPerson = new Perosn('st', 18);
console.log(aPerson)
```

类的继承：子类通过extends关键字继承父类的属性和方法
```js
class Person {
    sayHello() {
        console.log('Hello');
    }
}
class Teacher extends Person {
    sayHi() {
        console.log('Hi');
    }
}

let aTeacher = new Teacher();
aTeacher.sayHello();
aTeacher.sayHi();
```

类的重写：子类可重写父类的方法
```js
class Person {
    sayHello() {
        console.log('Hello');
    }
}
class Teacher extends Person {
    sayHello() {
        console.log('Hello, I am a teacher!');
    }
}

let aTeacher = new Teacher();
aTeacher.sayHello();
```
重写方法时，函数返回类型需保持一致，以下情况会报错
```js
class Person {
    func1() {
        return 1;
    }
}
class Teacher extends Person {
    func1() {
        return '1';
    }
}
```

类中super关键字的使用：
1. 作为函数使用时，指向父类的构造函数
2. 作为对象方法使用时，指向父类原型对象
```js
class Person {
    sayHello() {
        return 'Hello';
    }
}
class Teacher extends Person {
    sayHello() {
        return super.sayHello() + ', I am a teacher!';
    }
}
let aTeacher = new Teacher();
console.log(aTeacher.sayHello());

```

## 类属性修饰符
类的访问属性有三种修饰符，代表了属性的不同用法：
1. public：public修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
2. private: private修饰的属性或方法是私有的，不能在声明它的类的外部访问
3. protected: protected修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

public的使用：
```js
// public声明的属性在类的内部和外部都可以使用
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayName() {
        console.log(`My name is ${this.name}`)
    }
}
let aPerson = new Person('st');
console.log(aPerson.name); // st
aPerson.sayName(); // My name is st
```
属性默认修饰符都为public，name属性在内部和外部都可以访问。

private的使用：
```js
class Perosn {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}
let aPerson = new Perosn('st');
console.log(aPerson.name); // 报错 Property 'name' is private and only accessible within class 'Perosn'.

class teacher extends Perosn {
    constructor(name: string) {
        super(name);
        console.log(this.name); // 报错 Property 'name' is private and only accessible within class 'Perosn'.
    }
}
```
如上，name私有属性只能在声明的类中使用。


protected的使用：
```js
class Perosn {
    protected name: string;
    constructor(name: string) {
        this.name = name;
    }
}

let aPerson = new Perosn('st');
// console.log(aPerson.name) // 报错 Property 'name' is protected and only accessible within class 'Perosn' and its subclasses.

class teacher extends Perosn {
    constructor(name: string) {
        super(name);
        console.log(this.name); // 正常访问 输出st
    }
}
let aTeacher = new teacher('st');
// console.log(aTeacher.name) // 报错 Property 'name' is protected and only accessible within class 'Perosn' and its subclasses
```
protected属性name能在声明类及其子类内部使用，不能在外部使用


## 类的构造函数
构造函数用于生成实例对象，常规用法如下：
```js
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
        console.log(this.name); // st
    }
}
let aPerson = new Person('st'); 
```
new操作符生成实例对象时会自动调用构造函数。


构造函数的参数结合修饰符可以对以上形式进行简写
```js
class Person {
    constructor(public name: string) {}
}

let aPerson = new Person('st');
console.log(aPerson.name); // st
```

子类在继承父类时，构造函数必须调用super方法，意味调用父类的构造函数：
```js
class Person {
    constructor(public name: string) {}
}

class teacher extends Person {
    constructor(public name: string) {
        super(name); // 
    }
}
```

## 类的存取器
使用getter和setter可以对类属性的访问和赋值进行改写
```js
class Person {
    constructor(private _age: number) {}
    get age() {
        return this._age - 10;
    }
    set age(age: number) {
        this._age = age;
    }
}
let aPerson = new Person(28);
console.log(aPerson.age); // 18
aPerson.age = 50;
console.log(aPerson.age); // 40
console.log(aPerson); // Person { _age: 50 }
```
这里用age的getter和setter实现了对_age的改写

注意：存取器看起来像方法，但本质上使用时还是属性


## 类的静态属性
当不需要使用实例时，可以直接将属性和方法用静态属性声明。

声明方法：使用static关键字
```js
class Person {
    static say() {
        console.log('I say');
    }
}
Person.say(); // I say
```


## 类的readonly关键字
关键字readonly表示只读属性，赋值以后不允许改写。

readonly和其他修饰符同时存在时，放置在其他修饰符后面。
```js
class Person {
    public readonly name: string;
    constructor(name: string) { this.name = name; }
}
let aPerson = new Person('st');
aPerson.name = 'sttt'; // 报错 Cannot assign to 'name' because it is a read-only property.
```


## 抽象类和抽象方法
抽象类和继承中的父类很像，它表示对多个子类的共有属性和方法进行统一的抽象表示。

使用abstract声明一个抽象类：
```js
abstract class Person {
    constructor(public name: string) {}
}
```

抽象类不能够使用new关键字进行实例化
```js
abstract class Person {
    constructor(public name: string) {}
}
let aPerson = new Person('st'); // 报错 Cannot create an instance of an abstract class.
```


使用abstract声明抽象方法，抽象方法需要子类实现，在父类声明时没有函数体
```js
abstract class Perosn {
    abstract say(): void; //因为没有具体的方法，这里不写括号
}

class Perosn1 extends Perosn {
    say(): void {
        console.log('say 1')
    }
}

class Perosn2 extends Perosn {
    say(): void {
        console.log('say 2')
    }
}

class Perosn3 extends Perosn {
    say(): void {
        console.log('say 3')
    }
}

```

注意，在普通类中声明的普通方法可以不设置返回类型，但是抽象类中的抽象方法需要设置返回类型。

如下，普通类中的普通方法可以通过编译：
```js
class Perosn {
    sayHello() {
        console.log('Hello')
    }
}
```

而抽象类中的抽象方法如果不设置返回类型，TS转换时会报错：
```js
abstract class Perosn {
    abstract sayHello(); // 报错 'sayHello', which lacks return-type annotation, implicitly has an 'any' return type.
}
```
需改成如下写法：
```js
abstract class Person {
    abstract sayHello(): void;
}
```

# 编译配置文件
一般TypeScript项目中都会有tsconfig.json，它就是TypeScript的编译配置文件。

作用：配置ts文件的编译规则，即TypeScript如何编译成最终的JS文件

tsconfig文件如何生成？通过**tsc --init**命令在当前目录下生成tyconfig.json文件，生成后文件内容大致如下：
```js
{
    "compilerOptions": {}
}
```
那么如何让这个配置文件生效呢？答案是使用**tsc**命令。我们可以创建一个.ts文件，写上如下内容：
```js
// 这是一句注释
let a: number = 1;
```
然后配置tsconfig.json文件的一条规则，意为去除注释：
```js
{
    "compilerOptions": {
        //...
        "removeComments": true,     
        //...
    }
}
```
在当前目录下调用命令**tsc**，发现上述创建的ts文件已被编译，编译结果如下：
```js
"use strict";
let a = 1;
```
可以看到，注释已被去除，tsconfig.json文件的配置规则已经生效。

那么调用**tsc filename**命令将原ts文件转为JS文件结果如何呢？答案如下：
```js
// 这是一句注释
var a = 1;
```
编译后注释还在，说明tsconfig.json未生效。

需要注意的是，**ts-node filename**是遵循配置文件的。


## include、exclude和files
除了**compilerOptions**属性外，常见的配置配置属性还有include、exclude、files。


include配置：指定哪些文件需要被编译
```js
{
    "compilerOptions": {},
    "include": ["d1.ts"]
}
```
表示只将t1.ts文件编译成JS文件


exclude：意味排除，指定不需要编译的文件，其他文件都需要编译
```js
{
    "compilerOptions": {},
    "exclude": ["d2.ts"]
}
```
表示除了d2.ts文件都需要编译

files: 需要编译的文件名，和include意思大致相同
```js
{
    "compilerOptions": {},
    "files": ["d1.ts", "d2.ts"]
}
```
只编译d1.ts和d2.ts文件

## 常见的compilerOptions配置项
strict：严格类型检查选项。为true表示ts文件代码必须按照最严格的规范来写。为false时表示可以配合其他属性（noImplicitAny、strictNullChecks等）不那么严格检查。

noImplicitAny： 是否允许any类型不用特意声明（默认值为false），设置为true时，以下代码会报错
```js
function person(name) {
    return name;
}
```

strictNullChecks：是否强制检查 NULL 类型（默认值为false），设置为true时以下代码会报错
```js
let number1: number = null;
```

rootDir和outDir，分别指定原ts文件目录和编译后输出的JS目录
```js
{
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./build"     
    } 
}
```

allowJs（默认值为false）:是否允许编译JS，配合target可以将JS代码编译为ES5或ES6形式
```js
{
    "compilerOptions": {
        "allowJs": true
        "target": 'ES5'
    }    
}
```

sourceMap属性：取值为true/false，用于配置是否生成sourceMap文件（默认值为false）。  
sourceMap文件：与编译前的文件形成一个映射，代码出错时除错工具将显示原出错的代码而不是编译后的代码
```js
{
    "compilerOptions": {
        "sourceMap": true
    } 
}
```

noUnusedLocals：是否允许存在未使用的局部变量，
设置为true时以下代码编译会报错（默认值为false）
```js
const jspang: string = null;
export const name = "jspang";
```


noUnusedParameters: 是否允许函数参数未使用（默认值为false)），设置为true时以下代码编译会报错
```js
function sum(a: number, b: number) {
    return a;
}
```

## compilerOptions配置项详情
[编译选项详解](https://www.tslang.cn/docs/handbook/compiler-options.html)


# 联合类型和类型保护
## 联合类型
联合类型：表示类型的取值可以是多个类型种的一种。

使用方法：用|符号分隔每个类型。
```js
let a1: number | string = '1';
let a2: number | string = 1;
```

## 类型保护
类型保护：通过判断来确定变量的具体类型。

什么情况下需要类型保护?  
TypeScript不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型中共有的属性或方法，如果需要访问类型种的私有属性或方法，则需要类型保护。

如下情况：
```js
interface dog {
    name: string;
    run(): void;
}

interface fish {
    name: string;
    swim(): void;
}

function animalMove(animal: fish | dog) {
    animal.run();
}
```
此时animal.run()会报错，因为animalMove函数执行时并不知道传入的是哪种类型，从而不能访问类型中的私有方法，此时就需要类型保护。

## 常见的类型保护方法
使用类型断言（主动指定变量的类型）：
```js
interface dog {
    name: string;
    run(): void;
}

interface fish {
    name: string;
    swim(): void;
}

function isFish(animal: fish | dog) {
    if(typeof (animal as fish).swim === 'function') {
        return true;
    }
    return false;
}
```


使用in语法：
```js
interface dog {
    name: string;
    run(): void;
}

interface fish {
    name: string;
    swim(): void;
}
// 因为使用了in方法进行了属性判断，TypeScript就能够自动推断出变量的类型
function animalMove(animal: fish | dog) {
    if('swim' in animal) {
        animal.swim();
    } else {
        animal.run();
    }
}
```



使用typeof语法：
```js
function sum1(a: number | string, b: number | string) {
    return a + b; // 报错 Operator '+' cannot be applied to types 'string | number' and 'string | number'.
}
// 使用了typeof进行了类型判断，TypeScript就能够自动推断出变量的类型
function sum2(a: number | string, b: number | string) {
    if(typeof a === 'number' && typeof b === 'number') {
        return a + b;
    }
    return `${a}${b}`
}
```


使用instanceof语法：
```js
class dog {
    run() {}
}
class fish {
    swim() {}
}
// 因为使用了instanceof进行了类型判断，TypeScript就能够自动推断出变量的类型
function animalMove(animal: dog | fish) {
    if(animal instanceof dog) {
        animal.run();
    } else {
        animal.swim();
    }
}
```

# Enum 枚举类型
枚举类型是TypeScript中的数据类型，在JS并不存在。

它的含义是创建一组带有名字的常量，在属性和成员间形成一种双向映射，它通常的使用场景是：创建一组有区别的案例（如一周有7天）。

定义方法：使用enum关键字。
```js
enum week {
    Sun, 
    Mon, 
    Tue, 
    Wed, 
    Thu, 
    Fri, 
    Sat
};
console.log(week.Sun); // 0
console.log(week.Mon); // 1
console.log(week.Tue); // 2
console.log(week.Wed); // 3
console.log(week.Thu); // 4
console.log(week.Fri); // 5
console.log(week.Sat); // 6
console.log(week[0]); // Sun
console.log(week[1]); // Mon
console.log(week[2]); // Tue
console.log(week[3]); // Wed
console.log(week[4]); // Thu
console.log(week[5]); // Fri
console.log(week[6]); // Sat
```
可以看到，枚举类型创建了这样一些带有名字的常量。同时枚举成员（如1）和它的名称形成了一种双向映射，可以通过下标的形式（week[1])）反查到枚举的名称。

以上枚举类型编译成JS代码是这样的：
```js
(function (week) {
    week[week["Sun"] = 0] = "Sun";
    week[week["Mon"] = 1] = "Mon";
    week[week["Tue"] = 2] = "Tue";
    week[week["Wed"] = 3] = "Wed";
    week[week["Thu"] = 4] = "Thu";
    week[week["Fri"] = 5] = "Fri";
    week[week["Sat"] = 6] = "Sat";
})(week || (week = {}));
```
这下就很容易理解了，可以一目了然的知道变量和值之间的映射关系

## 数字枚举
枚举成员默认是数字，从0开始，依此递增，如：
```js
enum nums {
    a,b,c
};
console.log(nums.a) // 0
console.log(nums.b) // 1
console.log(nums.c) // 2
```

也可以主动指定递增初始值，如：
```js
enum nums {
    a = 1,b,c
};
console.log(nums.a) // 1
console.log(nums.b) // 2
console.log(nums.c) // 3
```

也可以主动指定每一项的值：
```js
enum nums {
    a = 9,
    b = 3,
    c = 7
};
console.log(nums.a) // 9
console.log(nums.b) // 3
console.log(nums.c) // 7
```

## 字符串枚举
例：
```js
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
}
```
由于字符串枚举没有增长属性，所以在定义时要求对每一个成员进行初始化，且必须为字符串。

# 泛型
泛型（Generics）：泛指的静态类型，它是静态类型的一种特殊用法。在定义函数、接口、类的时候不指定具体的类型，而在具体的使用环节里指定具体的类型。

首先通过简单示例理解泛型，假如有一个字符串拼接函数如下：
```js
function comB(a: string | number, b: string | number): string {
    return `${a}${b}`
}
console.log(comB('1', 1)); // 11
console.log(comB(1, '1')); // 11
```
现在有一个要求，需要强制规定comB函数的两个参数类型必须一致，如果不一致，TypeScript能够检测出来并编译报错。

明显之前的知识储备是解决不了这个问题的，这个时候就需要使用泛型。使用泛型重新定义后结果如下：
```js
function comB<T>(a: T, b: T): string {
    return `${a}${b}`;
}

comB<string>('1', '2'); // 正确
comB<number>(1, 2); // 正确
comB<string>('1', 2); // 报错
```
上述函数声明时通过<T>定义了泛型T，参数a，b的类型都是定义的泛型，在函数调用时再指定具体的类型，从而保证a,b的参数类型保持一致。

## 泛型的类型推断
```js
function sum<T, U>(a: T, b: U): string {
    return `${a}${b}`;
}
sum(1, '2');
```
此时调用sum时没有指定具体的泛型类型，也能正常运行。
因为TS自动推断出了sum函数运行时的泛型，把鼠标放置在sum上，显示`function sum<number, string>(a: number, b: string): string`。

虽然泛型支持类型推断，但是在使用时还是尽量提前指定泛型类型，便于理解。

## 泛型数组
数组类型一般使用[]定义，如：
```js
let a: number[] = [1, 2];
let b: string[] = ['1', '2'];
```

也可以使用泛型表示数组类型，如：
```js
let c: Array<number> = [1, 2];
let d: Array<string> = ['1', '2'];
```

## 泛型约束
在函数内部使用泛型变量时，由于事先不知道它的类型，所以不能随意操作泛型的属性和方法，如下：
```js
function arr<T>(arr: T) {
    return arr.length; // 报错
}
```
上例中，arr类型为T，不一定含有length属性。这时，可以对泛型制定一些约束，规定泛型T必须含有name属性。如下：
```js
interface a {
    length: number;
}

function arr<T extends a>(a: T) {
    return a.length;
}
arr([1, '1']); // 正确
arr(8); // 错误
```
上述代码规定了泛型T必须符合接口a的形状，也就说泛型T必须具有name属性，也就是说参数a必须具有length属性。

## 泛型接口
泛型接口：定义接口时使用泛型。

普通接口定义对象的形状：
```js
interface person {
    name: string,
    say(): string
}

let person1: person = {
    name: 'st',
    say() {
        return 'I am st!'
    }
}
```

泛型接口定义对象的形状：
```js
interface person<T> {
    name: T,
    say(): T,
}

let person1: person<string> = {
    name: '1',
    say() {
        return 'I am st!'
    }
};

let person2: person<number> = {
    name: 1,
    say() {
        return 1;
    }
}
```

普通接口定义函数的形状：
```js
interface myFunc {
    (a: number, b: number): number;
}
let sum: myFunc = function(a: number, b: number): number {
    return a + b;
}
console.log(sum(1, 2))
```

泛型接口定义函数的形状：
```js
interface myFunc<T> {
    (a: T, b: T): T;
}
let myfunc1: myFunc<number>;
myfunc1 = function<T>(a: T, b: T): T {
    if(a < b) {
        return a;
    } else {
        return b;
    }
}
myfunc1(1, 2);

```

## 泛型类
在类中使用泛型：
```js
class person<T> {
    constructor(public name: T) {}
    say(): T {
        console.log(this.name);
        return this.name;
    }
}

let a = new person<string>('st');
a.say()

```

# 命名空间
TypeScript中命名空间类似JS中模块的概念，它起着模块化的作用。
1. 作用域隔离。
2. 提高代码的复用性和可维护性。

使用方法：使用`namespace`关键字声明命名空间，在命名空间的内部使用`export`关键字将命名空间内部的变量供给外部使用。

## 工程角度看命名空间

命名空间起着模块的作用，这里就从工程的角度来理解。首先创建以下结构的工程目录：
```
│  index.html
│  package.json
│  tsconfig.json
├─build
│      page.js
│
└─src
        page.ts
```

各部分代码如下：

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeScript命名空间</title>
    <script src="./build/page.js"></script>
</head>
<body>
    <script>
        new Template.Page();
    </script>
</body>
</html>
```

tsconfig.json：
```JSON
{
    "compilerOptions": {
        "rootDir": "./src", 
        "outDir": "./build", 
    }
}

```
我们在src目录下书写TypeScript代码，使用tsc命令转义到build目录中。


首先先声明一个Template命名空间，用于生成页面内容：
```js
namespace Template {
    class Header {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is header!';
            document.body.appendChild(E);
        };
    }
    class Content {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is content!';
            document.body.appendChild(E);
        };
    }
    class Footer {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is footer!';
            document.body.appendChild(E);
        };
    }
    export class Page {
        constructor() {
            new Header();
            new Header();
            new Footer();
        };
    }
}
```
然后在页面中使用命名空间：
```js
<body>
    <script>
        new Template.Page();
    </script>
</body>

```
使用tsc命令转义后，打开页面，页面中就出现了提前设置好的模板内容。
```
This is header!
This is header!
This is footer!
```

那么，命名空间是如何起到模块作用的呢？我们可以看以下转义后的代码：
```js
"use strict";
var Template;
(function (Template) {
    class Header {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is header!';
            document.body.appendChild(E);
        }
        ;
    }
    class Content {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is content!';
            document.body.appendChild(E);
        }
        ;
    }
    class Footer {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is footer!';
            document.body.appendChild(E);
        }
        ;
    }
    class Page {
        constructor() {
            new Header();
            new Header();
            new Footer();
        }
        ;
    }
    Template.Page = Page;
})(Template || (Template = {}));

```
由此可见，命名空间和ES5中的模块的概念是一致的，通过自执行匿名函数维护了自己的作用域，并且提供外部访问内部的途径。


## 子命名空间
命名空间内部还可以维护子命名空间：
```js
namespace Template {
    export namespace son {
        export let str = 'test';
    }
}
```
可以通过`Template.son.str`访问子命名空间的变量。

转义后结果如下：
```js
"use strict";
var Template;
(function (Template) {
    let son;
    (function (son) {
        son.str = 'test';
    })(son = Template.son || (Template.son = {}));
})(Template || (Template = {}));
```


## 工程的改进
工程中，一般都会进行模块复用，现在对上述工程进一步改进：
```
│  index.html
│  tsconfig.json
│
├─build
│      component.js
│      page.js
│
└─src
        component.ts
        page.ts

```

其中component.ts：
```js
namespace Component {
    export class Header {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is header!';
            document.body.appendChild(E);
        };
    }
    export class Content {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is content!';
            document.body.appendChild(E);
        };
    }
    export class Footer {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is footer!';
            document.body.appendChild(E);
        };
    }
}

```
page.ts：
```js
namespace Template {
    export class Page {
        constructor() {
            new Component.Header();
            new Component.Header();
            new Component.Footer();
        };
    }
}

```
html：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeScript命名空间</title>
    <script src="./build/page.js"></script>
    <script src="./build/component.js"></script>
</head>
<body>
    <script>
        new Template.Page();
    </script>
</body>
</html>

```
现在，模块Template使用到了模块Component，有了模块化的交互，就是有一个麻烦点，就是必须同时引入好几个转义后的JS：
```
<script src="./build/page.js"></script>
<script src="./build/component.js"></script>
```


可以进行进一步的优化tsconfig.json，将ts文件都转义输出到同一个文件page.js：
```JSON
{
    "compilerOptions": {
        "rootDir": "./src", 
        "outDir": "./build",
        "outFile": "./build/page.js",     /* 只有 "AMD"和 "System"能和 --outFile一起使用*/
        "module": "amd",  /* 指定生成哪个模块系统代码 */
    }
}
```

# 外部模块使用import和export
前面说过，使用命名空间可以创建模块，但是命名空间创建的模块是指“内部模块”。事实上，TypeScript的ts文件是天然就有模块的概念，可以自由的导入和导出，这称之为外部模块。

如何理解外部模块？TypeScript与ECMAScript 2015一样，任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的。

# 在工程用运用import和export
创建如下工程：
```
│  index.html
│  package.json
│  README.md
│  tsconfig.json
│
├─build
│
└─src
        component.ts
        page.ts

```

各文件内容如下：

tsconfig.json 
```JSON
{
    "compilerOptions": {
        "module": "amd",
        "rootDir": "./src",  
        "outDir": "./build",    
        "outFile": "./build/page.js",
        "module": "amd", 
    }
}
```

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeScript模块的使用</title>
    <script src="./build/page.js"></script>
</head>
<body>
    <script>
    </script>
</body>
</html>
```


component.ts：
```js
export class Header {
    constructor() {
        let E = document.createElement('div');
        E.innerHTML = 'This is header!';
        document.body.appendChild(E);
    };
}

export class Content {
    constructor() {
        let E = document.createElement('div');
        E.innerHTML = 'This is content!';
        document.body.appendChild(E);
    };
}

export class Footer {
    constructor() {
        let E = document.createElement('div');
        E.innerHTML = 'This is footer!';
        document.body.appendChild(E);
    };
}


```

page.ts：
```js
import { Header, Content, Footer } from './component';

export default class Page {
    constructor() {
        new Header();
        new Content();
        new Footer();
    };
}

```

此时，ts文件都将视为模块，编译后page.js结果如下：
```js
define("component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = exports.Content = exports.Header = void 0;
    class Header {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is header!';
            document.body.appendChild(E);
        }
        ;
    }
    exports.Header = Header;
    class Content {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is content!';
            document.body.appendChild(E);
        }
        ;
    }
    exports.Content = Content;
    class Footer {
        constructor() {
            let E = document.createElement('div');
            E.innerHTML = 'This is footer!';
            document.body.appendChild(E);
        }
        ;
    }
    exports.Footer = Footer;
});
define("page", ["require", "exports", "component"], function (require, exports, component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Page {
        constructor() {
            new component_1.Header();
            new component_1.Content();
            new component_1.Footer();
        }
        ;
    }
    exports.default = Page;
});

```
由此可见TypeScript的模块被编译成了符合amd规范的模块内容，这样的代码是不能直接在浏览器中运行的，它需要require.js模块加载器。

最终改造HTML代码才能正常运行转译后的js代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeScript模块的使用</title>
    <script src=" https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js"></script>
    <script src="./build/page.js"></script>
</head>
<body>
    <script>
        require(["page"], function (page) {
            new page.default();
        });
    </script>
</body>
</html>
```


# RequireJS 和 AMD 规范的理解
模块的封装原理：匿名自制行函数维护内部变量，提供外部访问接口。


RequireJS加载器原理：通过script标签异步加载js（load事件）后执行相应的回调。

详细了解需进一步参考：
[阮一峰-Javascript模块化编程（三）：require.js的用法](https://www.ruanyifeng.com/blog/2012/11/require_js.html)

[从 RequireJs 源码剖析脚本加载原理](https://blog.csdn.net/ai52011/article/details/77113611)



# 参考
[TypeScript中文网](https://ts.xcatliu.com/introduction/index.html)  
[TypeScript 入门教程](https://github.com/xcatliu/typescript-tutorial)  
[jspang TypeScript 从入门到精通图文视频教程](https://jspang.com/article/63)






    



