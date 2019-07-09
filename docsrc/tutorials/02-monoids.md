A selection of examples of `Monoids` and their use cases.

#### Further readings
- [Fantas, eel and specification](http://www.tomharding.me/fantasy-land/)



# Examples

### Sum and Product

Examples of using the `Sum` and `Product` monoids with an array of numbers. 

**Sum**
```javascript
const { monoid: {Sum}, operation: {fold, foldMap} } = require('futils');

const DATA = [1, 2, 3, 4, 5];

// equivalent
fold(Sum, DATA);                                      // -> Sum(15)
foldMap(x => Sum.of(x), DATA);                           // -> Sum(15)
DATA.reduce((a, b) => a.concat(Sum(b)), Sum.empty()); // -> Sum(15)
```

**Product**
```javascript
const { monoid: {Product}, operation: {fold, foldMap} } = require('futils');

const DATA = [1, 2, 3, 4, 5];

// equivalent
fold(Product, DATA);                                          // -> Product(120)
foldMap(x => Product.of(x), DATA);                               // -> Product(120)
DATA.reduce((a, b) => a.concat(Product(b)), Product.empty()); // -> Product(120)
```


### Min and Max

`Min` and `Max` monoids used to find the lowest and hightest number in a array. 

**Min**
```javascript
const { monoid: {Min}, operation: {fold, foldMap} } = require('futils');

const DATA = [2, 5, 4, 1, 3];

// equivalent
fold(Min, DATA);                                      // -> Min(1)
foldMap(x => Min.of(x), DATA);                           // -> Min(1)
DATA.reduce((a, b) => a.concat(Min(b)), Min.empty()); // -> Min(1)
```

**Max**
```javascript
const { monoid: {Max}, operation: {fold, foldMap} } = require('futils');

const DATA = [2, 5, 4, 1, 3];

// equivalent
fold(Max, DATA);                                      // -> Max(5)
foldMap(x => Max.of(x), DATA);                           // -> Max(5)
DATA.reduce((a, b) => a.concat(Max(b)), Max.empty()); // -> Max(5)
```


### Any and All

Determining if any value is true or if all values are true with the `Any` and
`All` monoids. 

**Any**
```javascript
const { monoid: {Any}, operation: {fold, foldMap} } = require('futils');

const DATA = [true, false, true, true];

// equivalent
fold(Any, DATA);                                      // -> Any(true)
foldMap(x => Any.of(x), DATA);                           // -> Any(true)
DATA.reduce((a, b) => a.concat(Any(b)), Any.empty()); // -> Any(true)
```

**All**
```javascript
const { monoid: {All}, operation: {fold, foldMap} } = require('futils');

const DATA = [true, false, true, true];

// equivalent
fold(All, DATA);                                      // -> All(false)
foldMap(x => All.of(x), DATA);                           // -> All(false)
DATA.reduce((a, b) => a.concat(All(b)), All.empty()); // -> All(false)
```


### Char

Using `Char` to combine an array of `String`s into a single `String`. 

**Char**
```javascript
const { monoid: {Char}, operation: {fold, foldMap} } = require('futils');

const DATA = ['Hello', ' ', 'world'];

// equivalent
fold(Char, DATA);                                       // -> Char('Hello world')
foldMap(x => Char.of(x), DATA);                            // -> Char('Hello world')
DATA.reduce((a, b) => a.concat(Char(b)), Char.empty()); // -> Char('Hello world')
```


### Fn

Function composition with the `Fn` monoid.

**Fn**
```javascript
const { monoid: {Fn}, operation: {fold, foldMap} } = require('futils');

const DATA = [
  x => x.split(','),
  x => x.map(Number)
];

// equivalent
fold(Fn, DATA);                                     // -> Fn(x -> x.split(',').map(Number))
foldMap(x => Fn.of(x), DATA);                          // -> Fn(x -> x.split(',').map(Number))
DATA.reduce((a, b) => a.concat(Fn(b)), Fn.empty()); // -> Fn(x -> x.split(',').map(Number))
```


### Record

Use `Record` to merge objects together. Overrides existing properties. Original
values are kept intact.

**Record**
```javascript
const { monoid: {Record}, operation: {fold, foldMap} } = require('futils');

const DATA = [
  { a: 1 },
  { b: 2, c: 4 },
  { c: 3 }
];

// equivalent
fold(Record, DATA);                                         // -> Record({ a: 1, b: 2, c: 3 })
foldMap(x => Record.of(x), DATA);                              // -> Record({ a: 1, b: 2, c: 3 })
DATA.reduce((a, b) => a.concat(Record(b)), Record.empty()); // -> Record({ a: 1, b: 2, c: 3 })
```



# Custom monoids

Example of custom `Date` based monoids.

```javascript
const { adt: {Type}, generics: {Show, Eq, Ord} } = require('futils');


const Earliest = Type('Earliest', ['date']).
  deriving(Show, Eq, Ord);

Earliest.empty = () => Earliest(new Date(Date.now()));

Earliest.fn.concat = function (E) {
  return Number(this.date) < Number(E.date) ? this : E;
}


const MostRecent = Type('MostRecent', ['date']).
  deriving(Show, Eq, Ord);

MostRecent.empty = () => MostRecent(new Date(0, 0, 0, 0, 0, 0));

MostRecent.fn.concat = function (E) {
  return Number(this.date) < Number(E.date) ? E : this;
}
```

Example of a `Mut` and `Const` monoid. `Mut` prefers to change, while `Const`
only changes once.

```javascript
const { adt: {Type}, generics: {Show, Eq, Ord} } = require('futils');


const Mut = Type('Mut', ['value']).
  deriving(Show, Eq, Ord);

Mut.empty = () => Mut(undefined);

Mut.fn.concat = function (E) {
  return E.value !== undefined ? E : this;
}


const Const = Type('Const', ['value']).
  deriving(Show, Eq, Ord);

Const.empty = () => Const(undefined);

Const.fn.concat = function (E) {
  return this.value !== undefined ? this : E;
}
```


