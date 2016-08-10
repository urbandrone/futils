# futils
**A collection of functions and tools to use functional programming paradigms in JavaScript** 

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)

## Information
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