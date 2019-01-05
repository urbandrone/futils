<div class="readme_logo">![futils Logo](logo.jpg?raw=true, 'futils Logo')</div>

# About futils
Welcome to the futils documentation. Here you'll find detailed information about everything the library provides. Each explanation is accompanied by short example codes to give brief introductions.

## How this library is organized
The library itself is divided into several packages or modules, and the documentation is organized the same way. Here is a short list of all modules of futils.

| Package    | Namespace     | Description                                                                                    |
|------------|---------------|------------------------------------------------------------------------------------------------|
| Trampoline | `.trampoline` | Useful to create tail recursive functions in a not tail recursive language.                    |
| Operation  | `.operation`  | Functions that allow to operate with various data structures in a Point-Free form.             |
| Lambda     | `.lambda`     | Contains helpers for working with functions, like `curry`, `flip` and `compose`.               |
| ADT        | `.adt`        | Allows easy creation of algebraic single and union data types.                                 |
| Generics   | `.generics`   | Building blocks for new data structures which can derive generic methods.                      |
| Monoid     | `.monoid`     | A collection of some of the most common monoidal structures like `Sum` and `All`.              |
| Data       | `.data`       | Pre-made data structures. All of these implement various interface contracts (typeclasses).    |
| Optic      | `.optic`      | van Laarhoven based lenses for `Object` and `Array` structures.                                |

# Quickstart
To help you get started, here's a quick start guide to get you up and running the library in a browser environment. Throughout, you'll be introduced to the structure of the library and to some of it's most common functions and structures. It is written in ES6/ES2015 but should easily be portable to ES5.

## Step 1: Download
The library can be loaded either by downloading it from [NPM](https://www.npmjs.com/package/futils), by getting it from a [CDN](https://unpkg.com/futils@latest) or by downloading it from [Github](https://raw.githubusercontent.com/urbandrone/futils/dist/futils.js). This quickstart uses NPM.

| Source     | Snippet                                                                  |
| -----------|--------------------------------------------------------------------------|
| **NPM**    | `npm i futils`                                                           |
| **CDN**    | `<script src="https://unpkg.com/futils@latest"></script>`                |
| **Github** | `<script src="local/path/to/futils.js"></script>`                        |


## Step 2: The expected result
By completing the tutorial, you should have a working text processor which allows to obfuscate the contents of a text file with the help of a parser.


## Step 3: Modeling types
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
```

Also, let's make `Matrix` a part of the `Functor` family by providing a `map` method for it. Because `Matrix` is a container for an `Array` of `Array`s of `String`s, the `map` method takes a single function and projects it over each `String` in the inner `Array`s, then returning a new `Matrix` of the results.


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


## Step 4: Modeling functions
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

So it takes a function from some type `a` to a `Semigroup a`, then a `Functor a` and it finally returns a `Semigroup a`. Knowing that every monoid is also a valid semigroup, it is useful to conflate the `Fn` monoids from our parser into a single monoid while simultaneously mapping the parser over a given matrix.

```javascript
// interpreterFrom :: (Matrix, Parser) -> Fn (Number -> Number)
const interpreterFrom = (m, p) => foldMap(x => p[x[0]](x), m);

// convert :: Matrix -> Parser -> String -> String
const convert = curry((m, parser, str) => {
    const interpreter = interpreterFrom(m, parser);
    const transformer = pipe(Char.of, map(interpreter.run), prop('value'));
    return fromChars(toChars(str).map(map(map(transformer))));
});
```

The `convert` function just glues all the pieces together. 


## Step 5: Done
It's time to do a quick test. Just create two matrices for encoding and decoding, the corresponding encoder and decoder and try it:
```javascript
const encoderMatrix = Matrix(['*2', '+2', '/2']);
const decoderMatrix = Matrix(['*2', '-2', '/2']);

const myEncoder = convert(encoderMatrix, Parser);
const myDecoder = convert(decoderMatrix, Parser);

const encData = myEncoder('Hello world');
console.log(`Encoded: ${encData}`);
console.log(`Decoded: ${myDecoder(encData)}`);
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



// interpreterFrom :: (Matrix, Parser) -> Fn a
const interpreterFrom = (m, p) => foldMap(x => p[x[0]](x), m);

// convert :: Matrix -> Parser -> String -> String
const convert = curry((m, parser, str) => {
    const interpreter = interpreterFrom(m, parser);
    const transformer = pipe(Char.of, map(interpreter.run), prop('value'));
    return fromChars(toChars(str).map(map(map(transformer))));
});



module.exports = {Matrix, Parser, convert};
```