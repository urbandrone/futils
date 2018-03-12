![futils Logo](/logo.png?raw=true, 'futils Logo')

**A collection of tools to do functional programming in JavaScript** 

[![NPM](https://nodei.co/npm/futils.png)](https://nodei.co/npm/futils/)

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)
[![dependencies](https://david-dm.org/urbandrone/futils.svg)](https://david-dm.org/urbandrone/futils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About
`futils` (spoken "f-utils") is a small (~ 10 Kb gzipped) but versatile collection of functional programming goodies. It ships helpers from these categories:

1. Type checking
2. Arity modifications
3. Function combinators and decorators
4. Trampolines
5. Collection operations
6. Lenses (van Laarhoven)
7. Transducers
8. Monoids (Additive, Multiple, Char, Fn, All, Any, Min, Max, Dict, Unit)
9. Monads (Identity, Maybe, Either, State, IO, Task)
10. Maths (small extensions to _Math_)
11. Abstract types and pattern matching (Experimental)

One of it's goals in planning was to have a toolset of commonly used functional helpers when writing applications and/or webpage related code. It works great with a lot of other stuff – here is a small excerpt: jQuery, Reactive Streams, React/Preact and virtual-dom, Immutable.js, Electron...

Where applicable, all functions in `futils` are autocurried. This allows you to "skip" the execution until all needed parameters are given, for example:
```javascript
const incAll = map((n) => n + 1);

incAll([1, 2, 3]); // -> [2, 3, 4]
```

## More information
[API Documentation](http://www.der-davi.de/futils/docs/index.html)  
[Examples](./examples/readme.md)  

## Install with NPM
Global or local installation
```
npm install futils -g
npm install futils --save
```

After installation you can access the functions by calling require:
```javascript
const {curry, pipe, map} = require('futils');

// your code
```

## Install for ES6
If you use `jspm` either for a Node or Browser based application:
```
jspm install npm:futils
```

After the package has been installed successfully, you can import and use the toolkit like you would do with any other package:
```javascript
import {curry, pipe, map} from 'futils';

// your code
```

> If you want to use `futils` in conjunction with a bundler which supports
> tree shaking (like `webpack` or `rollup`), only those functions which you 
> already use will be included in the final build, which may significantly
> lower the file size of your scripts after bundling. Just make sure you
> _transpile it after bundling_, because otherwise you may end up with ES5
> and ES6 code mixed together.

## Install for browsers
Download the `futils.js` file and include it with a script tag which allows you to get access to the global `futils` namespace:
```
<script src="path/to/futils.js"></script>
```

You can then access the namespace from there:
```javascript
var {curry, pipe, map} = futils;

// your code
```

### Via CDN
Grab the latest version of `futils` either from [jsdelivr](https://www.jsdelivr.com/package/npm/futils) or [unpkg](https://unpkg.com/futils@latest/futils.js).

> If you want to use `futils` in non ES2015-ready browsers, make sure you
> include a ES2015 environment polyfill like 
> [core-js](https://github.com/zloirock/core-js).
> It's fine if you only use the native shim without ES7 proposels.

## Install for AMD
If you want to use `futils` with a AMD powered development workflow, you can do that too. Just like using it in the browser, all you have to do is download the file `futils.js` and use it in your code:
```javascript
define(['path/to/futils'], function (futils) {
    // your code
});

require(['path/to/futils'], function (futils) {
    // your code
});
```

## Local API Docs
You can create a local copy of the [Online API](http://www.der-davi.de/futils/docs/index.html) documentation like this:
```
cd path/to/futils/
npm run docs
```

## Tests
You can run the test suite like this:
```
cd path/to/futils/
npm test
```

---
*License*: MIT  
*NPM*: https://npmjs.org/package/futils  
*GitHub*: https://github.com/urbandrone/futils