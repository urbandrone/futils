<div class="readme_logo">![futils Logo](logo.jpg?raw=true, 'futils Logo')</div>

## About
Welcome to the futils documentation. Here you'll find detailed information about everything the library provides. Each explanation is accompanied by short example codes to give brief introductions.

### How this documentation is organized
The library itself is divided into several packages or modules, and the documentation is organized the same way. Here is a short list of all modules of futils.

| Package    | Namespace     | Description                                                                                    |
|------------|---------------|------------------------------------------------------------------------------------------------|
| Trampoline | `.trampoline` | Useful to create tail recursive functions in a not tail recursive language.                    |
| Operation  | `.operation`  | Functions inside allow to operate with various data structures in a Point-Free form.           |
| Lambda     | `.lambda`     | Contains helpers for working with functions, like `curry`, `flip` and `compose`.               |
| ADT        | `.adt`        | Allows easy creation of algebraic single and union data types.                                 |
| Generics   | `.generics`   | Building blocks for new data structures which can derive generic methods.                      |
| Monoid     | `.monoid`     | A collection of some of the most common monoidal structures like `Sum` and `All`.              |
| Data       | `.data`       | Pre-made data structures. All of these implement various interface contracts (typeclasses).    |
| Optic      | `.optic`      | van Laarhoven based lenses for `Object` and `Array` structures.                                |

## Quickstart
To help you get started, here's a quick start guide to get you up and running the library in a browser environment. Throughout, you'll be introduced to the structure of the library and to some of it's most common functions and structures. It is written in ES6/ES2015 but should easily be portable to ES5.

##### Step 1: Download
The library can be loaded either by downloading it from the [NPM](https://www.npmjs.com/package/futils), by getting it from a [CDN]() or by downloading it from [Github](). This quickstart uses the CDN path, but depending on your preferences you can choose one of the methods and adapt the relevant parts.

> **CDN** `<script src="https://unpkg.com/futils@latest/dist/futils.js"></script>`
>
> **Github** `<script src="your/local/path/to/futils.js"></script>`
>
> **NPM** `npm i futils`


##### Step 2: The expected result
By completing the tutorial, you should have a working text processor which allows to encode the contents of a text file with the help of a matrix. You can either use 2d or 3d matrices for the encoding, but the tutorial uses 2d ones.

We start by building a parser and the matrix functions for the 2d/3d matrices.


##### Step 3: Modeling types
To model the types, we make use of the **ADT** package.
```
const {adt: {Type, UnionType}} = futils;
```


```
const Matrix = Type('Matrix2d', ['_matrix']);
Matrix.fn._matrix = [[1, 0], [0, 1]];

Matrix.fn.map = function (f) {
    return Matrix(this._matrix.map(xy => xy.map(f)));
}
```




##### Step 4: Modeling functions


##### Step 5: Let's use `data`


> If you have choosen to use the `NPM` route of the quickstart, this is the end. You should now have a working module ready
> to be used. 

##### Step 6: Connecting the parts


##### Step 7: Testing