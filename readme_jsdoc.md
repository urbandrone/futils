<div class="readme_logo">![futils Logo](logo.jpg?raw=true, 'futils Logo')</div>

# About futils
The futils library is designed to allow you to incorporate various aspects of _functional programming_ techniques into your JavaScript code, for example _Pointfree_ programming, where most (critical) parts of your programs read like natural language – as if you'd written a complete DSL for it.

If that doesn't fire you up, here's some example code for the [SCUMM](https://en.wikipedia.org/wiki/SCUMM) engine, which [Ron Gilbert](https://en.wikipedia.org/wiki/Ron_Gilbert) has shown in 2011:

```
cut-scene {
    ...
    actor nurse-edna in-room edna-bedroom at 60,20
    camera-follow nurse-edna
    actor nurse-edna walk-to 30,20
    wait-for-actor nurse-edna
    say-line nurse-edna "WHATS'S YOUR POINT ED!!!"
    wait-for-talking nurse-edna
    ...
}
```

It's a beautiful example of _declarative_ code. And it's quite easy to understand, right? The first line says it's a "cut-scene", the curly brackets denote everything inside it as part of a block (or group), and each line in the block reads like an instruction. That has been a _huge_ benefit over complicated APIs and enabled people without much programming experience to write programs.

_Pointfree_ or _tacit_ programming allows you to write parts of your program in a similiar style.

#### Further readings:
- [A Gentle Introduction to Functional JavaScript Style](https://jrsinclair.com/articles/2016/gentle-introduction-to-functional-javascript-style/)
- [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://github.com/MostlyAdequate/mostly-adequate-guide)
- [Fantas, eel and specification](http://www.tomharding.me/fantasy-land/)
- [Monads in JavaScript](https://curiosity-driven.org/monads-in-javascript) _Note: `unit` is the type constructor and `bind` is `flatMap` in futils_

> *Why is `flatMap` chosen over `bind` or `chain`?*
> Mostly in favor to have a unified interface with the native `Array.prototype.flatMap` and `Array.prototype.flat` methods. Read more about it:
> [`Array.prototype.flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
> [`Array.prototype.flat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
> [EcmaScript Proposal](https://github.com/tc39/proposal-flatMap)



# How this library is organized
The library itself is divided into several packages or modules, and the documentation is organized the same way. In it, you'll find that each piece of documentation is accompanied by short example codes to give brief introductions. Here is a short list of all modules of futils.

| Package    | Namespace     | Description                                                                           |
|------------|---------------|---------------------------------------------------------------------------------------|
| Trampoline | `.trampoline` | Useful to create tail recursive functions in a not tail recursive language.           |
| Operation  | `.operation`  | Functions that allow to operate with various data structures in a Point-Free form.    |
| Lambda     | `.lambda`     | Contains helpers for working with functions, like `curry`, `flip` and `compose`.      |
| ADT        | `.adt`        | Allows easy creation of algebraic single and union data types.                        |
| Generics   | `.generics`   | Building blocks for new data structures which can derive generic methods.             |
| Monoid     | `.monoid`     | A collection of some of the most common monoidal structures like `Sum` and `All`.     |
| Data       | `.data`       | Pre-made data structures. All of these implement various typeclasses (like `Monad`).  |
| Optic      | `.optic`      | van Laarhoven based lenses for `Object` and `Array` structures.                       |



# Quickstart
To help you get started, here's a quick start guide to get you up and running the library in a node based environment. Throughout, you'll be introduced to the structure of the library and to some of it's most common functions and data containers. It is written in ES6/ES2015 but should easily be portable to ES5.

### The expected result
By completing the tutorial, you should have a working text processor which allows to obfuscate the contents of a text file with the help of a parser in just 31 lines of actual code. It can process single words, lines of words or complete paragraphs with linebreaks. In case you want to have a peek at what we are striving for: [futils at npm.runkit.com](https://npm.runkit.com/futils)

## Step 1: Download
The library can be loaded either by downloading it from [NPM](https://www.npmjs.com/package/futils), by getting it from a [CDN](https://unpkg.com/futils@latest) or by downloading it from [Github](https://raw.githubusercontent.com/urbandrone/futils/master/dist/futils.js). This quickstart uses NPM.

| Source     | Snippet                                                                  |
| -----------|--------------------------------------------------------------------------|
| **NPM**    | `npm i futils`                                                           |
| **CDN**    | `<script src="https://unpkg.com/futils@latest"></script>`                |
| **Github** | `<script src="local/path/to/futils.js"></script>`                        |


## Step 2: Modeling types
To model the types, we make use of the **ADT** package.
```javascript
const { adt: {Type} } = require('futils');
```

#### Matrix
We start by creating a `Matrix` data type with the `Type` function. You can use `Type` and `UnionType` in your programs to add more clarity to it and create your own data types and enumeration types. The signature of `Type` looks like this:

`Type :: String -> Array String -> Constructor`.

The `Matrix` data type is going to carry the individual shifting matrix for the characters of a given string.
```javascript
// data Matrix = Matrix (Array String)
const Matrix = Type('Matrix', ['value']);

Matrix.fn.map = function (f) {
    return Matrix(this.value.map(f));
}

Matrix.fn.reduce = function (f, a) {
    return this.value.reduce(f, a);
}
```

Also, let's make `Matrix` a part of the `Functor` family by providing a `map` method for it. Because `Matrix` is a container for an `Array` of `Array`s of `String`s, the `map` method takes a single function and projects it over each `String` in the inner `Array`s, then returning a new `Matrix` of the results.
We can make `Matrix` be a part of the `Foldable` typeclass as well by providing a `reduce` method.


#### Char
Each character of the text will be presented in a special type `Char`. The purpose of char is to provide the possibility to manipulate characters in terms of their character code. We make `Char` part of the family of `Functor`s to provide it with the necessary capability.
```javascript
// data Char = Char String
const Char = Type('Char', ['value']);

Char.fn.map = function (f) {
    return Char(String.fromCharCode(f(this.value.charCodeAt(0))));
}
```


#### Operation
To represent the shifting operations, introduce a typeclass `Operation` which takes a function and allows classifies it as operation. To accomplish building chains of operations with this, let's make `Operation` a part of the family of `Monoid` type classes with the `concat` method being designed to perform function composition.
```javascript
// data Operation = Operation (a -> a)
const Operation = Type('Operation', ['run']);

Operation.empty = () => Operation(a => a);

Operation.fn.concat = function (f) {
    return Operation(x => f.run(this.run(x)));
}
```

As it turns out, that's exactly what the `Fn` monoid from futils is designed to do. You will find it in the **monoid** namespace. This means, we can get rid of `Operation` and just use `Fn`.
```javascript
const { adt: {Type},
        monoid: {Fn} } = require('futils');
```


## Step 3: Modeling functions
So now we have types, let's think about the functions we need. The **lambda** namespace of futils grants access to utilities for combining and manipulating functions. 
```javascript
const { adt: {Type},
        monoid: {Fn} ,
        lambda: {curry, pipe} } = require('futils');

```

#### Text processing
First off, we need a way to take a complete text, transform it into lines of text, transform the lines into individual words and transform these words into separate characters. JavaScript implements the `split` method for `String`s, and we are going to use it. Let's create a pure `split` function we can toss around. The function takes a "mark" argument which can either be a string or a regular expression.
```javascript
// split :: String|Regex -> String -> Array String
const split = curry((mark, str) => str.split(mark));

// toChars :: String -> Array (Array (Array String))
//            ^         ^      ^      ^
//            Text      Lines  Words  Chars
const toChars = pipe(
    split(/\r|\n|\r\n/g),
    lines => lines.map(split(/\s+/g)),
    lines => lines.map(words => words.map(split(''))));
```

With it, we can build a pipeline of operations (`toChar`) we want to perform on a given string to split it into lines, words and characters while preserving the correct nesting as `Array` structure. This structure is the reason why we have to dot chain `.map` all the way down. It looks a bit ugly, mainly because we havn't written it in a point-free form. Let's change it.
```javascript
const { adt: {Type},
        monoid: {Fn} ,
        lambda: {curry, pipe},
        operation: {map, prop} } = require('futils');
```

With the help of the `map` function from **operation**, we can omit specifying the (cognitive) type of data we are working with. This helps us to not tie a function to a specific problem domain and therefor increase the chance for us to reuse it in other parts of our program.
```javascript
// split :: String|Regex -> String -> Array String
const split = curry((mark, str) => str.split(mark));

// toChars :: String -> Array (Array (Array String))
const toChars = pipe(
    split(/\r|\n|\r\n/g),
    map(split(/\s+/g)),
    map(map(split(''))));
```

#### Homomorphisms
Complementing to `split` and `toChars`, let's write two other functions `join` and `fromChars`. The `split` and `join` functions are symmetrical and in conjuction form a homomorphism, the same goes for `toChars` and `fromChars`. This means if you put a text into `toChars` and the output of `toChars` into `fromChars`, you get the initial input back.

`fromChars(toChars('hello world')) === 'hello world'`.

Here is the implementation:
```javascript
// join :: String -> Array String -> String
const join = curry((mark, xs) => xs.join(mark));

// fromChars :: Array (Array (Array String)) -> String
const fromChars = pipe(
    map(map(join(''))),
    map(join(' ')),
    join('\n'));
```

#### The parser
It's time we create our "parser". As you know, a parser is a piece of software that takes an AST and transforms it into machine code. To some extend, our parser works in the same way, although it is much simpler. Have a look at the code below: 
```javascript
// Parser :: Object (String : String -> Fn (Number -> Number))
const Parser = {
    '=': val => Fn(() => Number(val.replace('=', ''))),
    '+': val => Fn(n => n + Number(val.replace('+', ''))),
    '-': val => Fn(n => n - Number(val.replace('-', ''))),
    '*': val => Fn(n => n * Number(val.replace('*', ''))),
    '/': val => Fn(n => n / Number(val.replace('/', '')))
}
```

Basically, our parser is just an assignment of some mathematical symbols to functions that return a `Fn` monoid as a result.

The final pieces we have to write utilize the `foldMap` function of the **operation** namespace, so we have to import it:
```javascript
const { adt: {Type},
        monoid: {Fn} ,
        lambda: {curry, pipe},
        operation: {map, prop, foldMap} } = require('futils');
```

In general, the signature of `foldMap` looks like this:

`foldMap :: Functor F, Semigroup S => (a -> S a) -> F a -> S a`

So it takes a function from some type `a` to a `Semigroup a`, then a `Functor a` and it finally returns a `Semigroup a`. Knowing that every monoid is also a valid semigroup, it is useful to conflate the `Fn` monoids from our parser into a single monoid while simultaneously mapping the parser over a given matrix. Finally, we return the `.value` property of the resulting monoid which holds the complete transformation for any given number.  
```javascript
// interpreter :: (Matrix, Parser) -> (Number -> Number)
const interpreter = (m, p) => foldMap(x => p[x[0]](x), m).value;
```

The hidden beauty of this design is this: The `interpreter` function allows us to use _any parser as well as any kind of matrix that implements `Foldable`_. This means we can use it with other parsers, too!
```javascript
// Parser :: Object (String : () -> Fn (String -> String))
const Parser = {
    '^': _ => Fn(s => s[0].toUpperCase() + s.slice(1)),
    '!': _ => Fn(s => s + '!'),
    '<': _ => Fn(s => s.split('').reverse().join(''))
}

// matrix :: Matrix (Array String)
const matrix = Matrix(['^', '!', '<']);

// interpret :: String -> String
const interpret = interpreter(matrix, Parser);

// mapWords :: forall a b. (a -> b) -> String -> String
const mapWords = curry((f, s) => s.split(/\s/g).map(f).join(' '));

console.log(mapWords(interpret, 'hello world, how are you today?'));
// logs "!olleH !,dlroW !woH !erA !uoY !?yadoT"
``` 

With this at our fingertips, we can generalise the way how the interpreter functions we create with `interpreter` will be applied to a character unit inside a `Char`:
```javascript
// transform :: (Matrix, Parser) -> (String -> String)
const transform = (m, p) => pipe(Char, map(interpreter(m, p)), prop('value'));

// convert :: Matrix -> Parser -> (String -> String)
const convert = curry((m, p) => pipe(toChars, map(map(map(transform(m, p)))), fromChars));
```

The `convert` function just glues all the pieces together. 


## Step 4: Done
It's time to do a quick test. Just create two matrices for encoding and decoding, the corresponding encoder and decoder and try it:
```javascript
const encoderMatrix = Matrix(['*2', '+2', '/2']);
const decoderMatrix = Matrix(['*2', '-2', '/2']);

const encoder = convert(encoderMatrix, Parser);
const decoder = convert(decoderMatrix, Parser);

console.log(`Encoded 'Hello world': ${encoder('Hello world')}`);
console.log(`Homomorphism? ${encoder(decoder('Hello world')) === 'Hello world'}`);
```

You can see the complete code below.

```javascript
const { adt: {Type},
        monoid: {Fn},
        lambda: {curry, pipe},
        operation: {map, prop, foldMap} } = require('futils');



/********** DATA TYPES **********/

// data Matrix = Matrix (Array String)
const Matrix = Type('Matrix', ['value']);

Matrix.fn.map = function (f) {
    return Matrix(this.value.map(f));
}

Matrix.fn.reduce = function (f, a) {
    return this.value.reduce(f, a);
}


// data Char = Char String
const Char = Type('Char', ['value']);

Char.fn.map = function (f) {
    return Char(String.fromCharCode(f(this.value.charCodeAt(0))));
}



/********** PARSER **********/

// Parser :: Object (String : String -> Fn (Number -> Number))
const Parser = {
    '=': val => Fn(() => Number(val.replace('=', ''))),
    '+': val => Fn(n => n + Number(val.replace('+', ''))),
    '-': val => Fn(n => n - Number(val.replace('-', ''))),
    '*': val => Fn(n => n * Number(val.replace('*', ''))),
    '/': val => Fn(n => n / Number(val.replace('/', '')))
}



/********** FUNCTIONS **********/

// split :: String|Regex -> String -> Array String
const split = curry((mark, str) => str.split(mark));

// join :: String -> Array String -> String
const join = curry((mark, xs) => xs.join(mark));


// toChars :: String -> Array (Array (Array String))
const toChars = pipe(
    split(/\r|\n|\r\n/g),
    map(split(/\s+/g)),
    map(map(split(''))));

// fromChars :: Array (Array (Array String)) -> String
const fromChars = pipe(
    map(map(join(''))),
    map(join(' ')),
    join('\n'));



// interpreter :: (Matrix, Parser) -> (Number -> Number)
const interpreter = (m, p) => foldMap(x => p[x[0]](x), m).value;

// transform :: (Matrix, Parser) -> (String -> String)
const transform = (m, p) => pipe(Char, map(interpreter(m, p)), prop('value'));

// convert :: Matrix -> Parser -> (String -> String)
const convert = curry((m, p) => pipe(toChars, map(map(map(transform(m, p)))), fromChars));



module.exports = {Matrix, Parser, convert};
```