# futils
**A collection of functions and tools to use functional programming paradigms in JavaScript** 

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)

## Requirements
*Node*: `6.3.1+`  
*NPM*: `3.7.1+`

## Information
[API Documentation](http://www.der-davi.de/futils/docs/index.html) 
[Examples](./examples/readme.md) 

## Install with NPM
Global or local installation
```
npm install futils -g
npm install futils --save-dev
```

After installation you can access the functions by calling require with `'futils'` as parameter:
```
const {given, isString, pipe, exec} = require('futils');

// your code
```

## Install for ES6 (via jspm.io and SystemJS)
If you use `jspm` either for a Node or Browser based application, just install the package from npm:
```
jspm install npm:futils
```

After the package has been installed successfully, you can import and use the toolkit like you would do with any other package too:
```
import {given, isString, pipe, exec} from 'futils';

// your code
```

## Install for Browsers
Download the `futils.bundle.js` file and include it with a script tag which allows you to get access to the global `futils` namespace:
```
<script src="path/to/futils.bundle.js"></script>
```

For cleaner code, you can wrap everything up into a IIFE (Immediatly invoked function expression) and access the namespace from there:
```
/* globals futils, jQuery */
(function (run) { run(futils, jQuery); })(function (_, $) {

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