![futils Logo](/logo.png?raw=true, 'futils Logo');
**A collection of tools to use functional programming paradigms in JavaScript** 
[![NPM](https://nodei.co/npm/futils.png)](https://nodei.co/npm/futils/)

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)

[![dependencies](https://david-dm.org/urbandrone/futils.svg)](https://david-dm.org/urbandrone/futils)

## About
`futils` (spoken "f-utils") is a collection composed of helpers from these categories:

1. Type checking
2. Arity modifications
3. Function combinators and decorators
4. Trampolining
5. Collection operations
6. Lenses
7. Transducers
8. Monoids (Additive, Multiple, Fn, All, Any, Min, Max, Dict)
9. Monads (Identity, Maybe, Either, State, IO, Task)
10. Uniontypes

One of it's goals in planning was to have a toolset of commonly used functional helpers when writing applications and/or webpage related code. It works great with a lot of other stuff too: jQuery, Reactive Streams, React/Preact and virtual-dom, JSPM, Electron...

Where applicable, all functions in `futils` are autocurried. This allows you to "skip" the invocation until all needed parameters are given.

Below is some code for demonstration purposes:
```javascript
const {Task, call, map} = require('futils');
const fetch = require('node-fetch');

const getXHR = (url) => new Task((fail, done) => fetch(url).then(done, fail));
const success = (msg) => console.log(msg);
const error = (exc) => console.error(exc);

getXHR('https://api.github.com/users/octocat/repos').
    map(call('json')).
    map(map((repo) => `${repo.name}: ${repo.html_url}`)).
    map(call('join', '\n')).
    run(error, success);
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
const _ = require('futils');

// your code
```

## Install for ES6 (via jspm.io and SystemJS)
If you use `jspm` either for a Node or Browser based application:
```
jspm install npm:futils
```

After the package has been installed successfully, you can import and use the toolkit like you would do with any other package too:
```
import {pipe, isString, call} from 'futils';

// your code
```

### Note:
If you want to use `futils` in conjunction with a bundler which supports tree shaking (like `rollup`), only those functions which you already use from `futils` will be included in the final build, which may significantly lower the file size of your scripts after bundling.

## Install for browsers
Download the `futils.js` file and include it with a script tag which allows you to get access to the global `futils` namespace:
```
<script src="path/to/futils.js"></script>
```

You can then access the namespace from there:
```
var _ = futils;

// your code
```

### Note:
If you want to use `futils` in non ES2015-ready browsers, make sure you include a ES2015 environment polyfill like [core-js](https://github.com/zloirock/core-js). It's fine if you only use the native shim without ES7 proposels.

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