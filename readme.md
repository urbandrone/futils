# futils
**A collection of functions and tools to use functional programming paradigms in JavaScript** 

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)

## About
`futils` is a collection of small utility functions composed of helpers from these categories:
1. Type checking
2. Arity modifier
3. Function combinators and decorators
4. Comparators
5. Collection iterators
6. Lenses
7. Transducers

One of it's goals in planning was to have a toolset of commonly used functional helpers when writing applications and/or webpage related code with reactive streams. It can be compared with the excellent `allong.es` library written by [Mr. Braithwaite](http://raganwald.com/) to a certain extend, but instead of it supporting monads it supports lenses and transducers, as well as supporting es2015 which [allong.es](http://allong.es/) does not.

Where applicable, all functions in `futils` are autocurried. This allows you to "skip" the invocation until all needed parameters are given. Below is some code for demonstration purposes:
```
const {pipe, and, isString, isObject, eq, field} = require('futils');

let data = {
    "name": "Harrison Ford",
    "dayOfBirth": "1942-07-13",
    "url": "https://en.wikipedia.org/wiki/Harrison_Ford"
}

const hasHarrisonFordsName = pipe(
    field('name'),
    and(isString, eq('Harrison Ford'))
);

const hasHarrisonFordsBirthday = pipe(
    field('dayOfBirth'),
    and(isString, eq('1942-07-13'))
);

const isHarrisonFord = and(
    isObject,
    hasHarrisonFordsName,
    hasHarrisonFordsBirthday
);

if (isHarrisonFord(data)) {
    console.log('Hey, it\'s Harrison_Ford!');
}
```

## More information
[API Documentation](http://www.der-davi.de/futils/docs/index.html)  
[Examples](./examples/readme.md)  

## Install with NPM
Global or local installation
```
npm install futils -g
npm install futils --save-dev
```

After installation you can access the functions by calling require:
```
const {given, isString, pipe, exec} = require('futils');

// your code
```

## Install for ES6 (via jspm.io and SystemJS)
If you use `jspm` either for a Node or Browser based application:
```
jspm install npm:futils
```

After the package has been installed successfully, you can import and use the toolkit like you would do with any other package too:
```
import {given, isString, pipe, exec} from 'futils';

// your code
```

## Install for browsers
Download the `futils.js` file and include it with a script tag which allows you to get access to the global `futils` namespace:
```
<script src="path/to/futils.js"></script>
```

You can then access the namespace from there:
```
var given = futils.given,
    isString = futils.isString,
    pipe = futils.pipe,
    exec = futils.exec;

// your code
```

## Install for AMD
If you want to use `futils` with a AMD powered development workflow, you can do that too. Just like using it in the browser, all you have to do is download the file `futils.js` and use it in your code:
```
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